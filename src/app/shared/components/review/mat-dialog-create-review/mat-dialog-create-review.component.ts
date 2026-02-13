import { Component, inject, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Review } from '../../../models/interfaces/Review';
import { ReviewService } from '../../../services/review.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-mat-dialog-create-review',
  templateUrl: './mat-dialog-create-review.component.html',
  styleUrl: './mat-dialog-create-review.component.css',
  imports: [ReactiveFormsModule]
})
export class MatDialogCreateReviewComponent {

  private reviewService = inject(ReviewService);
  private tokenService = inject(TokenService);

  constructor(public matDialogRef: MatDialogRef<MatDialogCreateReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idStudio: number, review: Review | null, isEdit: boolean }
  ) { }

  ngOnInit(): void {
    if (this.data.review) {
      this.editReviewForm.patchValue({
        review: this.data.review.review,
        rating: this.data.review.rating
      });
    }
  }

  editReviewForm = new FormGroup({
    review: new FormControl<string>(''),
    rating: new FormControl<number>(0)
  })

  onSubmit() {
    const formValueReviewEdit = this.editReviewForm.getRawValue();
    const review: Review = {
      review: formValueReviewEdit.review != null ? formValueReviewEdit.review : '',
      rating: formValueReviewEdit.rating != null ? formValueReviewEdit.rating : 0,
      idUser: this.tokenService.getUserId(),
      idTattooStudio: this.data.idStudio
    };

    if (!this.data.isEdit) {
      this.reviewService.createReview(review).subscribe({
        next: () => {
          alert('Review created successfully');
          this.matDialogRef.close(true);
        },
        error: (err) => {
          alert('Review not created');
          console.log(err);
        }
      })
    } else {
      if (!this.data.review) return;
      this.reviewService.updateReview(this.data.review.idReview!, review).subscribe({
        next: () => {
          alert('Review updated successfully');
          this.matDialogRef.close(true);
        },
        error: (err) => {
          alert('Review not updated');
          console.log(err);
        }
      })
    }
  }
}
