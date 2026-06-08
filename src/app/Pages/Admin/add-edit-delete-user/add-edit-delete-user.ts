import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface AdminUserRecord {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: string;
}

export interface UserDialogData {
  mode: 'add' | 'edit' | 'delete';
  user?: AdminUserRecord;
}

export interface UserDialogResult {
  mode: 'add' | 'edit' | 'delete';
  user?: AdminUserRecord;
}

@Component({
  selector: 'app-add-edit-delete-user',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './add-edit-delete-user.html',
  styleUrl: './add-edit-delete-user.scss',
})
export class AddEditDeleteUser {
  readonly mode: 'add' | 'edit' | 'delete';

  readonly form;

  get isCurrentlyActive(): boolean {
    return this.data.user?.status === 'Active';
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditDeleteUser, UserDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData,
  ) {
    this.mode = data.mode;

    this.form = this.fb.nonNullable.group({
      fullName: [data.user?.fullName ?? '', [Validators.required, Validators.maxLength(80)]],
      email: [data.user?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(120)]],
      role: [data.user?.role ?? '', [Validators.required, Validators.maxLength(40)]],
      status: [data.user?.status ?? '', [Validators.required, Validators.maxLength(20)]],
    });

    if (this.mode === 'delete') {
      this.form.disable();
      return;
    }

    if (this.mode === 'edit') {
      this.form.controls.status.disable();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.mode === 'delete') {
      this.dialogRef.close({ mode: 'delete', user: this.data.user });
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const statusValue = this.mode === 'edit' ? (this.data.user?.status ?? value.status) : value.status;
    const payload: AdminUserRecord = {
      id: this.data.user?.id ?? 0,
      fullName: value.fullName.trim(),
      email: value.email.trim().toLowerCase(),
      role: value.role.trim(),
      status: statusValue.trim(),
    };

    this.dialogRef.close({ mode: this.mode, user: payload });
  }
}
