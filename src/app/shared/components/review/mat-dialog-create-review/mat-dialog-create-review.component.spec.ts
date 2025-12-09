import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogCreateReviewComponent } from './mat-dialog-create-review.component';

describe('MatDialogCreateReviewComponent', () => {
  let component: MatDialogCreateReviewComponent;
  let fixture: ComponentFixture<MatDialogCreateReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogCreateReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatDialogCreateReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
