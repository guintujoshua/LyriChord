import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { GeneralFooter } from '../../../SharedPages/general-footer/general-footer';
import { AdminLeftNav } from '../admin-left-nav/admin-left-nav';
import {
  AddEditDeleteUser,
  AdminUserRecord,
  UserDialogData,
  UserDialogResult,
} from '../add-edit-delete-user/add-edit-delete-user';
import { UserService, UserDto } from '../../../services/user.service';

@Component({
  selector: 'app-manage-user',
  imports: [AdminLeftNav, GeneralFooter, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './manage-user.html',
  styleUrl: './manage-user.scss',
})
export class ManageUser implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);

  readonly displayedColumns = ['fullName', 'email', 'role', 'status', 'actions'];

  users: AdminUserRecord[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (data: UserDto[]) => {
        this.users = (Array.isArray(data) ? data : []).map((user) => this.toAdminUserRecord(user));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.users = [];
        this.isLoading = false;
        this.errorMessage = err?.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to load users.';
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
      }
    });
  }

  private toAdminUserRecord(user: Partial<UserDto>): AdminUserRecord {
    const rawStatus = String(user.status ?? '').trim();
    let normalizedStatus = rawStatus;

    if (!normalizedStatus) {
      normalizedStatus = 'Inactive';
    } else {
      const lower = normalizedStatus.toLowerCase();
      if (lower === 'true') {
        normalizedStatus = 'Active';
      } else if (lower === 'false') {
        normalizedStatus = 'Inactive';
      }
    }

    return {
      id: Number(user.id ?? 0),
      fullName: String(user.name ?? ''),
      email: String(user.email ?? ''),
      role: String(user.role ?? ''),
      status: normalizedStatus,
    };
  }

  openAddDialog(): void {
    this.openDialog({ mode: 'add' });
  }

  openEditDialog(user: AdminUserRecord): void {
    this.openDialog({ mode: 'edit', user });
  }

  openDeleteDialog(user: AdminUserRecord): void {
    this.openDialog({ mode: 'delete', user });
  }

  private openDialog(data: UserDialogData): void {
    this.dialog
      .open(AddEditDeleteUser, {
        width: '620px',
        maxWidth: '95vw',
        maxHeight: '92vh',
        data,
      })
      .afterClosed()
      .subscribe((result?: UserDialogResult) => {
        if (!result?.user) {
          return;
        }

        if (result.mode === 'add') {
          this.createUser(result.user);
          return;
        }

        if (result.mode === 'edit') {
          this.updateUser(result.user);
          return;
        }

        if (result.mode === 'delete') {
          this.deleteUser(result.user);
        }
      });
  }

  private createUser(user: AdminUserRecord): void {
    this.userService.createUser({
      name: user.fullName,
      email: user.email,
      role: user.role,
      password: 'DefaultPassword123!',
      status: user.status
    }).subscribe({
      next: () => {
        this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to create user:', err);
        this.snackBar.open('Failed to create user', 'Close', { duration: 3000 });
      }
    });
  }

  private updateUser(user: AdminUserRecord): void {
    this.userService.updateUser(user.id, {
      name: user.fullName,
      email: user.email,
      role: user.role,
      password: ''
    }).subscribe({
      next: () => {
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to update user:', err);
        this.snackBar.open('Failed to update user', 'Close', { duration: 3000 });
      }
    });
  }

  private deleteUser(user: AdminUserRecord): void {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to delete user:', err);
        this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
      }
    });
  }
}
