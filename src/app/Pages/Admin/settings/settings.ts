import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminLeftNav } from '../admin-left-nav/admin-left-nav';
import { GeneralFooter } from '../../../SharedPages/general-footer/general-footer';
import { MaintenanceService } from '../../../core/maintenance.service';

@Component({
  selector: 'app-settings',
  imports: [AdminLeftNav, GeneralFooter, MatCardModule, MatIconModule, MatSlideToggleModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  readonly maintenanceService: MaintenanceService = inject(MaintenanceService);

  onMaintenanceToggle(event: MatSlideToggleChange): void {
    this.maintenanceService.setMaintenanceMode(event.checked);
  }
}
