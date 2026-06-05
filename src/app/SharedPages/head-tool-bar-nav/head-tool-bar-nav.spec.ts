import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadToolBarNav } from './head-tool-bar-nav';

describe('HeadToolBarNav', () => {
  let component: HeadToolBarNav;
  let fixture: ComponentFixture<HeadToolBarNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadToolBarNav],
    }).compileComponents();

    fixture = TestBed.createComponent(HeadToolBarNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
