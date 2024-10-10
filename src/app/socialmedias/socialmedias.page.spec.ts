import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialmediasPage } from './socialmedias.page';

describe('SocialmediasPage', () => {
  let component: SocialmediasPage;
  let fixture: ComponentFixture<SocialmediasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialmediasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
