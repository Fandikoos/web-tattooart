import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { Observable } from 'rxjs';
import { Booking } from 'src/app/shared/models/interfaces/Booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private urlApiBooking = environment.apiUrlBooking;
  private httpClient = inject(HttpClient);

  findByIdStudioOrderByStartDateTime(idStudios: number[]): Observable<Booking[]> {
    return this.httpClient.get<Booking[]>(`${this.urlApiBooking}/studio/${idStudios}/order-by-date`);
  }

  createBooking(booking: Partial<Booking>): Observable<Booking> {
    return this.httpClient.post<Booking>(this.urlApiBooking, booking);
  }

  updateBooking(id: number, booking: Partial<Booking>): Observable<Booking> {
    return this.httpClient.put<Booking>(`${this.urlApiBooking}/${id}`, booking);
  }

  deleteBooking(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlApiBooking}/${id}`);
  }
}
