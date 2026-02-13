import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminArtistsListComponent } from './admin-artists-list.component';

describe('AdminArtistsListComponent', () => {
  let component: AdminArtistsListComponent;
  let fixture: ComponentFixture<AdminArtistsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminArtistsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminArtistsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
