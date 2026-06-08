import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDeleteSong } from './add-edit-delete-song';

describe('AddEditDeleteSong', () => {
  let component: AddEditDeleteSong;
  let fixture: ComponentFixture<AddEditDeleteSong>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditDeleteSong],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditDeleteSong);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
