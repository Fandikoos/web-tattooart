import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogReviewsComponent } from './mat-dialog-reviews.component';

describe('MatDialogReviewsComponent', () => {
  let component: MatDialogReviewsComponent;
  let fixture: ComponentFixture<MatDialogReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatDialogReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
