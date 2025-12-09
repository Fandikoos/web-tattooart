/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminStudioDataEditComponent } from './admin-studio-data-edit.component';

describe('AdminStudioEditComponent', () => {
  let component: AdminStudioDataEditComponent;
  let fixture: ComponentFixture<AdminStudioDataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminStudioDataEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStudioDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
