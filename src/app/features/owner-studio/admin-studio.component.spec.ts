/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OwnerStudioComponent } from './admin-studio.component';

describe('OwnerStudioComponent', () => {
  let component: OwnerStudioComponent;
  let fixture: ComponentFixture<OwnerStudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerStudioComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
