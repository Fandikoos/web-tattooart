import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Review } from '../../../models/interfaces/Review';
import { TokenService } from '../../../../core/services/token.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MatDialogCreateReviewComponent } from '../mat-dialog-create-review/mat-dialog-create-review.component';
import { ReviewService } from '../../../../core/services/review.service';

@Component({
  selector: 'app-mat-dialog-reviews',
  templateUrl: './mat-dialog-reviews.component.html',
  styleUrl: './mat-dialog-reviews.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MatDialogReviewsComponent {

  private tokenService = inject(TokenService);
  private reviewService = inject(ReviewService);
  isLogged = this.tokenService.isLogged();
  idUser = this.tokenService.getProfileUserDto()?.idUser;
  isEdit: boolean = false;

  constructor(private matDialog: MatDialog, public matDialogRef: MatDialogRef<MatDialogReviewsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reviews: Review[], idStudio: number }
  ) {
    effect(() => {
      console.log(this.data);
    })
  }

  getStarsArray(rating: number) {
    const fullStars = Math.floor(rating);
    // Coge el resto de dividir entre 1: Ej: 4.7 / 1, el resto sería 0.7
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return {
      fullStars: Array(fullStars).fill(0),
      halfStar: halfStar ? [0] : [],
      emptyStars: Array(emptyStars).fill(0)
    };
  }

  deleteReview(idReview: number | undefined) {
    if (!idReview) {
      return;
    }
    this.reviewService.deleteReview(idReview).subscribe({
      next: () => {
        alert('Review deleted successfully');
        this.data.reviews = this.data.reviews.filter(review => review.idReview !== idReview);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  editReview(review: Review | undefined) {
    if(!review) return;
    this.isEdit = true;
    this.createEditReviewDialog(review, this.data.idStudio)
  }

  createEditReviewDialog(review : Review | null, idStudio: number) {
    this.matDialog.open(MatDialogCreateReviewComponent, {
      data: {
        idStudio: idStudio,
        review: review,
        isEdit: this.isEdit,
      },
      width: '55vw',
      maxWidth: '650px',
      height: '65vh',
      maxHeight: '700px',
      panelClass: 'gallery-modal',
    }).afterClosed().subscribe(created => {
      if (created) {
        this.loadReviews();
      }
    });

  }

  loadReviews() {
    this.reviewService.getReviewByStudio(this.data.idStudio).subscribe({
      next: (reviews) => {
        this.data.reviews = reviews;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
