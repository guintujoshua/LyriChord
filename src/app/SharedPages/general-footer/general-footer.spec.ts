import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralFooter } from './general-footer';

describe('GeneralFooter', () => {
  let component: GeneralFooter;
  let fixture: ComponentFixture<GeneralFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
