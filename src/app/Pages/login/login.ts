import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HeadToolBarNav } from '../../SharedPages/head-tool-bar-nav/head-tool-bar-nav';
import { GeneralFooter } from '../../SharedPages/general-footer/general-footer';
import { ContactAdminDialog } from './contact-admin-dialog';

@Component({
  selector: 'app-login',
  imports: [
    HeadToolBarNav,
    GeneralFooter,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly dialog = inject(MatDialog);
  hidePassword = true;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get emailError(): string {
    const ctrl = this.form.controls.email;
    if (ctrl.hasError('required')) return 'Email is required';
    if (ctrl.hasError('email')) return 'Enter a valid email';
    return '';
  }

  get passwordError(): string {
    const ctrl = this.form.controls.password;
    if (ctrl.hasError('required')) return 'Password is required';
    if (ctrl.hasError('minlength')) return 'At least 6 characters';
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }
  }

  openContactDialog(): void {
    this.dialog.open(ContactAdminDialog, { width: '380px' });
  }
}
