import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeftNav } from './admin-left-nav';

describe('AdminLeftNav', () => {
  let component: AdminLeftNav;
  let fixture: ComponentFixture<AdminLeftNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLeftNav],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLeftNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
