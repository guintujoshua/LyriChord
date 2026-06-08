import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDeleteUser } from './add-edit-delete-user';

describe('AddEditDeleteUser', () => {
  let component: AddEditDeleteUser;
  let fixture: ComponentFixture<AddEditDeleteUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditDeleteUser],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditDeleteUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
