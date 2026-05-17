import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { BookingService } from '../../../../core/services/booking.service';
import { Booking } from '../../../models/interfaces/Booking';
import { Studio } from '../../../models/interfaces/Studio';
import { Artist } from '../../../models/interfaces/Artist';

export interface CreateBookingDialogData {
  studios: Studio[];
  artists: Artist[];
  booking?: Booking; // si se pasa, el dialog funciona en modo edición
}

/** Convierte un Date/string a formato 'YYYY-MM-DDTHH:mm' para inputs datetime-local */
function toDatetimeLocal(dt: Date | string | null | undefined): string {
  if (!dt) return '';
  const d = new Date(dt);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

@Component({
  selector: 'app-mat-dialog-create-booking',
  templateUrl: './mat-dialog-create-booking.component.html',
  styleUrl: './mat-dialog-create-booking.component.css',
  imports: [ReactiveFormsModule, MatDialogClose],
})
export class MatDialogCreateBookingComponent implements OnInit {
  private bookingService = inject(BookingService);
  public dialogRef = inject<MatDialogRef<MatDialogCreateBookingComponent>>(MatDialogRef);
  public data = inject<CreateBookingDialogData>(MAT_DIALOG_DATA);

  filteredArtists: Artist[] = [];
  isSubmitting = false;
  errorMessage = '';

  get isEditMode(): boolean {
    return !!this.data.booking;
  }

  readonly bookingTypes = ['BOOKING', 'NOTE', 'BLOCK_TIME'];
  readonly bookingStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

  bookingForm = new FormGroup({
    title:          new FormControl<string>('', [Validators.required]),
    description:    new FormControl<string>(''),
    startDateTime:  new FormControl<string>('', [Validators.required]),
    endDateTime:    new FormControl<string>(''),
    type:           new FormControl<string>('BOOKING', [Validators.required]),
    status:         new FormControl<string>('PENDING', [Validators.required]),
    clientName:     new FormControl<string>(''),
    clientPhone:    new FormControl<string>(''),
    clientEmail:    new FormControl<string>('', [Validators.email]),
    color:          new FormControl<string>('#3b82f6'),
    idTattooStudio: new FormControl<number | null>(null, [Validators.required]),
    idArtist:       new FormControl<number | null>(null),
  });


  ngOnInit(): void {
    if (this.isEditMode) {
      this.prefillForEdit(this.data.booking!);
    } else if (this.data.studios.length === 1) {
      const id = this.data.studios[0].idStudio ?? null;
      this.bookingForm.patchValue({ idTattooStudio: id });
      this.onStudioChange(id);
    }
  }

  private prefillForEdit(b: Booking): void {
    const idStudio = b.idTattooStudio ?? null;
    this.onStudioChange(idStudio); // carga los artistas del estudio

    this.bookingForm.patchValue({
      title:          b.title         ?? '',
      description:    b.description   ?? '',
      startDateTime:  toDatetimeLocal(b.startDateTime),
      endDateTime:    toDatetimeLocal(b.endDateTime),
      type:           b.type          ?? 'BOOKING',
      status:         b.status        ?? 'PENDING',
      clientName:     b.clientName    ?? '',
      clientPhone:    b.clientPhone   ?? '',
      clientEmail:    b.clientEmail   ?? '',
      color:          b.color         || '#3b82f6',
      idTattooStudio: idStudio,
      idArtist:       b.idArtist      ?? null,
    });
  }

  onStudioChange(idStudio: number | null): void {
    this.bookingForm.patchValue({ idArtist: null });
    if (idStudio == null) {
      this.filteredArtists = [];
      return;
    }
    this.filteredArtists = this.data.artists.filter(a => a.idTattooStudio === Number(idStudio));
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const raw = this.bookingForm.getRawValue();

    const payload: Record<string, unknown> = {
      title:          raw.title,
      startDateTime:  raw.startDateTime,
      type:           raw.type,
      status:         raw.status,
      idTattooStudio: raw.idTattooStudio,
      color:          raw.color || '#3b82f6',
    };

    if (raw.description)  payload['description']  = raw.description;
    if (raw.endDateTime)  payload['endDateTime']   = raw.endDateTime;
    if (raw.clientName)   payload['clientName']    = raw.clientName;
    if (raw.clientPhone)  payload['clientPhone']   = raw.clientPhone;
    if (raw.clientEmail)  payload['clientEmail']   = raw.clientEmail;
    if (raw.idArtist)     payload['idArtist']      = raw.idArtist;

    const request$ = this.isEditMode
      ? this.bookingService.updateBooking(this.data.booking!.idBooking, payload)
      : this.bookingService.createBooking(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.dialogRef.close(true);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = this.isEditMode
          ? 'Error al actualizar la cita. Inténtalo de nuevo.'
          : 'Error al crear la cita. Inténtalo de nuevo.';
      },
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.bookingForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
