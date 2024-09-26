import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhoareusPage } from './whoareus.page';

describe('WhoareusPage', () => {
  let component: WhoareusPage;
  let fixture: ComponentFixture<WhoareusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoareusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
