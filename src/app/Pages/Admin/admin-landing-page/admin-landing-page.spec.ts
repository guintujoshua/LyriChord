import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLandingPage } from './admin-landing-page';

describe('AdminLandingPage', () => {
  let component: AdminLandingPage;
  let fixture: ComponentFixture<AdminLandingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLandingPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLandingPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
