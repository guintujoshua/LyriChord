import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { signal } from '@angular/core';
import { HeadToolBarNav } from '../../SharedPages/head-tool-bar-nav/head-tool-bar-nav';
import { GeneralFooter } from '../../SharedPages/general-footer/general-footer';
import { ContactAdminDialog } from './contact-admin-dialog';
import { UserService } from '../../services/user.service';

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
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  hidePassword = true;
  isLoading = signal(false);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
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
      return;
    }

    this.isLoading.set(true);
    const credentials = this.form.getRawValue();

    this.userService.login({
      email: credentials.email || '',
      password: credentials.password || ''
    }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          // Store token only when present.
          if (response.token) {
            localStorage.setItem('auth_token', response.token);
          }
          localStorage.setItem('user', JSON.stringify(response.user));
          
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/admin']);
        } else {
          this.snackBar.open(response.message || 'Login failed', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Login error:', err);
        this.snackBar.open('Login failed. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  openContactDialog(): void {
    this.dialog.open(ContactAdminDialog, { width: '380px' });
  }
}
