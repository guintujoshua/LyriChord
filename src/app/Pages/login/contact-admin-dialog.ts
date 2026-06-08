import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contact-admin-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-header">
      <mat-icon class="dialog-icon">admin_panel_settings</mat-icon>
      <h2 mat-dialog-title>Request an Account</h2>
    </div>

    <mat-dialog-content>
      <p>
        LyriChord accounts are by invitation only. To request access,
        please contact the admin directly via email:
      </p>
      <a class="admin-email" href="mailto:guintujoshua@gmail.com">
        <mat-icon>email</mat-icon>
        guintujoshua&#64;gmail.com
      </a>
      <p class="dialog-note">
        Include your name and intended use in the message and we'll get back to you as soon as possible.
      </p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" mat-dialog-close>Got it</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 20px 24px 0;
    }

    .dialog-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: var(--mat-sys-primary);
    }

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
    }

    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 12px;
      font-size: 14px;
      line-height: 1.6;

      p {
        margin: 0;
      }
    }

    .admin-email {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--mat-sys-primary);
      font-weight: 600;
      text-decoration: none;
      font-size: 15px;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      &:hover {
        text-decoration: underline;
      }
    }

    .dialog-note {
      color: var(--mat-sys-on-surface-variant);
      font-size: 13px;
    }
  `],
})
export class ContactAdminDialog {}
