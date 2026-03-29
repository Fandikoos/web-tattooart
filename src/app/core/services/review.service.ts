import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../../shared/models/interfaces/Review';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private httpClient = inject(HttpClient);
  private urlApiReview = environment.apiUrlReview;

  constructor() { }

  getReviewByStudio(idStudio: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(`${this.urlApiReview}/${idStudio}`);
  }

  createReview(review: Review): Observable<Review> {
    return this.httpClient.post<Review>(`${this.urlApiReview}`, review);
  }

  deleteReview(idReview: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlApiReview}/${idReview}`);
  }

  updateReview(idReview: number, review: Review): Observable<void> {
    return this.httpClient.put<void>(`${this.urlApiReview}/${idReview}`, review);
  }
}
