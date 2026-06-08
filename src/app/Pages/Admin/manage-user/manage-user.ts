import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { GeneralFooter } from '../../../SharedPages/general-footer/general-footer';
import { AdminLeftNav } from '../admin-left-nav/admin-left-nav';
import {
  AddEditDeleteUser,
  AdminUserRecord,
  UserDialogData,
  UserDialogResult,
} from '../add-edit-delete-user/add-edit-delete-user';

@Component({
  selector: 'app-manage-user',
  imports: [AdminLeftNav, GeneralFooter, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './manage-user.html',
  styleUrl: './manage-user.scss',
})
export class ManageUser {
  readonly displayedColumns = ['fullName', 'email', 'role', 'status', 'actions'];

  users: AdminUserRecord[] = [
    { id: 1, fullName: 'Joshua Guintu', email: 'joshua@example.com', role: 'Admin', status: 'Active' },
    { id: 2, fullName: 'Mara Santos', email: 'mara@example.com', role: 'Editor', status: 'Active' },
    { id: 3, fullName: 'Leo Cruz', email: 'leo@example.com', role: 'Viewer', status: 'Inactive' },
  ];

  constructor(private dialog: MatDialog) {}

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
          const nextId = this.users.length ? Math.max(...this.users.map((item) => item.id)) + 1 : 1;
          this.users = [...this.users, { ...result.user, id: nextId }];
          return;
        }

        if (result.mode === 'edit') {
          this.users = this.users.map((item) => (item.id === result.user!.id ? result.user! : item));
          return;
        }

        this.users = this.users.map((item) => {
          if (item.id !== result.user!.id) {
            return item;
          }

          return {
            ...item,
            status: item.status === 'Active' ? 'Inactive' : 'Active',
          };
        });
      });
  }
}
