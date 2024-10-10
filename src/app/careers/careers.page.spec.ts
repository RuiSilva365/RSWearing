import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CareersPage } from './careers.page';

describe('CareersPage', () => {
  let component: CareersPage;
  let fixture: ComponentFixture<CareersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CareersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
