import { Component, inject, OnInit, OnDestroy, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgClass, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TokenService } from '../../../core/services/token.service';
import { StudioService } from '../../../core/services/studio.service';
import { ArtistService } from '../../../core/services/artist.service';
import { BookingService } from 'src/app/core/services/booking.service';
import { Booking } from 'src/app/shared/models/interfaces/Booking';
import { Studio } from 'src/app/shared/models/interfaces/Studio';
import { Artist } from 'src/app/shared/models/interfaces/Artist';
import { MatDialogDayBookingsComponent } from 'src/app/shared/components/booking/mat-dialog-day-bookings/mat-dialog-day-bookings.component';
import { MatDialogCreateBookingComponent } from 'src/app/shared/components/booking/mat-dialog-create-booking/mat-dialog-create-booking.component';

interface StatCard {
  label: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
  value: ReturnType<typeof signal<number | string>>;
}

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  imports: [NgClass, DatePipe],
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private tokenService = inject(TokenService);
  private studioService = inject(StudioService);
  private artistService = inject(ArtistService);
  private bookingService = inject(BookingService);
  private dialog = inject(MatDialog);

  private idStudios: number[] = [];
  private studios: Studio[] = [];
  private artists: Artist[] = [];

  username = signal<string>('Admin');
  bookings = signal<Booking[]>([]);

  // Clock
  currentTime = signal<string>('--:--:--');
  currentDate = signal<string>('');
  currentDayName = signal<string>('');

  // Calendar
  calendarYear = signal<number>(new Date().getFullYear());
  calendarMonth = signal<number>(new Date().getMonth());
  selectedDay = signal<number | null>(null);

  // Stat values — studios and artists come from real API calls
  private studioCount = signal<number | string>('—');
  private artistCount = signal<number | string>('—');
  private appointCount = signal<number | string>('—');
  private reviewCount = signal<number | string>('—');

  readonly stats: StatCard[] = [
    { label: 'Active studios', icon: 'fa-solid fa-store', gradientFrom: '#2563eb', gradientTo: '#60a5fa', glowColor: 'rgba(59,130,246,0.4)', value: this.studioCount },
    { label: 'Artists', icon: 'fa-solid fa-palette', gradientFrom: '#7c3aed', gradientTo: '#a78bfa', glowColor: 'rgba(139,92,246,0.4)', value: this.artistCount },
    { label: 'Appointments', icon: 'fa-solid fa-calendar-check', gradientFrom: '#059669', gradientTo: '#34d399', glowColor: 'rgba(16,185,129,0.4)', value: this.appointCount },
    { label: 'Pending reviews', icon: 'fa-solid fa-star', gradientFrom: '#d97706', gradientTo: '#fbbf24', glowColor: 'rgba(245,158,11,0.4)', value: this.reviewCount },
  ];

  openDialogToCreateNewBooking(): void {
    const ref = this.dialog.open(MatDialogCreateBookingComponent, {
      data: { studios: this.studios, artists: this.artists },
      panelClass: 'booking-day-dialog-panel',
    });
    ref.afterClosed().subscribe(created => {
      if (created) this.loadBookings();
    });
  }

  readonly weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  private clockInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    const profile = this.tokenService.getProfileUserDto();
    this.username.set(profile?.username ?? 'Admin');

    this.loadStats(profile?.idUser);

    if (isPlatformBrowser(this.platformId)) {
      this.updateClock();
      this.clockInterval = setInterval(() => this.updateClock(), 1000);
    }
  }

  loadBookings(): void {
    this.bookingService.findByIdStudioOrderByStartDateTime(this.idStudios).subscribe({
      next: (bookings) => {
        this.bookings.set(bookings);
      },
      error: () => this.bookings.set([]),
    });
  }

  studioName(idTattooStudio: number): string {
    return this.studios.find(s => s.idStudio === idTattooStudio)?.name ?? '—';
  }

  bookingColorForDay(day: number): string | null {
    const year = this.calendarYear();
    const month = this.calendarMonth();
    const match = this.bookings().find(b => {
      const d = new Date(b.startDateTime);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
    return match?.color ?? null;
  }

  statusClass(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'confirmada' || s === 'confirmed') return 'status-confirmada';
    if (s === 'cancelada' || s === 'cancelled' || s === 'canceled') return 'status-cancelada';
    return 'status-pendiente';
  }

  ngOnDestroy(): void {
    if (this.clockInterval) clearInterval(this.clockInterval);
  }

  private loadStats(idUser: number | undefined): void {
    if (idUser == null) return;

    // Ambas peticiones corren en paralelo y se actualizan los contadores al recibir ambas respuestas, si una falla se cancelaria el resto 
    forkJoin({
      studios: this.studioService.findByIdAdmin(idUser),
      artists: this.artistService.getArtistByIdUser(idUser),
    }).subscribe(({ studios, artists }) => {
      this.studios = studios;
      this.artists = artists;
      this.studioCount.set(studios.length);
      this.idStudios = studios
        .map(s => s.idStudio)
        .filter((id): id is number => id !== undefined);
      this.artistCount.set(artists.length);
      this.loadBookings();
    });
  }

  private updateClock(): void {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    this.currentTime.set(`${h}:${m}:${s}`);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.currentDayName.set(days[now.getDay()]);
    this.currentDate.set(`${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);
  }

  // ── Calendar helpers ──────────────────────────────────────────────────────

  get calendarDays(): (number | null)[] {
    const year = this.calendarYear();
    const month = this.calendarMonth();
    const firstDow = new Date(year, month, 1).getDay();    // 0=Sun
    const offset = firstDow === 0 ? 6 : firstDow - 1;   // Mon-first grid
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(offset).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }

  get monthLabel(): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[this.calendarMonth()]} ${this.calendarYear()}`;
  }

  prevMonth(): void {
    if (this.calendarMonth() === 0) { this.calendarMonth.set(11); this.calendarYear.update(y => y - 1); }
    else { this.calendarMonth.update(m => m - 1); }
  }

  nextMonth(): void {
    if (this.calendarMonth() === 11) { this.calendarMonth.set(0); this.calendarYear.update(y => y + 1); }
    else { this.calendarMonth.update(m => m + 1); }
  }

  isToday(day: number): boolean {
    const now = new Date();
    return day === now.getDate()
      && this.calendarMonth() === now.getMonth()
      && this.calendarYear() === now.getFullYear();
  }

  selectDay(day: number | null): void {
    if (day === null) return;
    this.selectedDay.set(day);

    const year = this.calendarYear();
    const month = this.calendarMonth();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayBookings = this.bookings()
      .filter(b => {
        const d = new Date(b.startDateTime);
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
      })
      .map(b => ({ ...b, studioName: this.studioName(b.idTattooStudio) }));

    const ref = this.dialog.open(MatDialogDayBookingsComponent, {
      data: {
        date: `${months[month]} ${day}, ${year}`,
        bookings: dayBookings,
        studios: this.studios,
        artists: this.artists,
      },
      panelClass: 'booking-day-dialog-panel',
    });
    ref.afterClosed().subscribe(changed => {
      if (changed) this.loadBookings();
    });
  }

  trackByIndex(i: number): number { return i; }
}
