import { Component, inject, signal } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Booking } from '../../../models/interfaces/Booking';
import { Studio } from '../../../models/interfaces/Studio';
import { Artist } from '../../../models/interfaces/Artist';
import { BookingService } from '../../../../core/services/booking.service';
import { MatDialogCreateBookingComponent } from '../mat-dialog-create-booking/mat-dialog-create-booking.component';

export interface DayBookingsDialogData {
  date: string;
  bookings: Array<Booking & { studioName: string }>;
  studios: Studio[];
  artists: Artist[];
}

@Component({
  selector: 'app-mat-dialog-day-bookings',
  templateUrl: './mat-dialog-day-bookings.component.html',
  styleUrl: './mat-dialog-day-bookings.component.css',
  imports: [NgClass, DatePipe],
})
export class MatDialogDayBookingsComponent {
  private bookingService = inject(BookingService);
  private matDialog = inject(MatDialog);

  // inject() como campo garantiza que el valor está disponible antes de cualquier otro inicializador
  public data = inject<DayBookingsDialogData>(MAT_DIALOG_DATA);
  public dialogRef = inject<MatDialogRef<MatDialogDayBookingsComponent>>(MatDialogRef);

  // Ahora this.data ya existe cuando se ejecuta este inicializador
  bookings = signal<Array<Booking & { studioName: string }>>(this.data.bookings);
  deletingId = signal<number | null>(null);
  hasChanges = false;

  openEdit(booking: Booking & { studioName: string }): void {
    const ref = this.matDialog.open(MatDialogCreateBookingComponent, {
      data: { studios: this.data.studios, artists: this.data.artists, booking },
      panelClass: 'booking-day-dialog-panel',
    });

    ref.afterClosed().subscribe(updated => {
      if (updated) {
        // Cerramos el dialog de día con true para que admin-home recargue las citas
        this.dialogRef.close(true);
      }
    });
  }

  confirmDelete(booking: Booking & { studioName: string }): void {
    if (this.deletingId() !== null) return; // ya hay una eliminación en curso

    this.deletingId.set(booking.idBooking);
    this.bookingService.deleteBooking(booking.idBooking).subscribe({
      next: () => {
        this.bookings.update(list => list.filter(b => b.idBooking !== booking.idBooking));
        this.hasChanges = true;
        this.deletingId.set(null);
      },
      error: () => {
        this.deletingId.set(null);
        // Mostramos el error de forma sencilla (coherente con el resto de la app)
        alert('Error al eliminar la cita. Inténtalo de nuevo.');
      },
    });
  }

  close(): void {
    this.dialogRef.close(this.hasChanges);
  }

  statusClass(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'confirmada' || s === 'confirmed') return 'status-confirmada';
    if (s === 'cancelada' || s === 'cancelled' || s === 'canceled') return 'status-cancelada';
    return 'status-pendiente';
  }
}
