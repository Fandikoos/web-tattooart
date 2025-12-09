import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Review } from '../models/interfaces/Review';

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
}
