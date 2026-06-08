import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Managesong } from './managesong';

describe('Managesong', () => {
  let component: Managesong;
  let fixture: ComponentFixture<Managesong>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Managesong],
    }).compileComponents();

    fixture = TestBed.createComponent(Managesong);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
