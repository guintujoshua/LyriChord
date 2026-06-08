import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const MAINTENANCE_STORAGE_KEY = 'lyrichord_maintenance_mode';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly isMaintenanceMode = signal(false);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const persisted = localStorage.getItem(MAINTENANCE_STORAGE_KEY);
    this.isMaintenanceMode.set(persisted === 'true');
  }

  setMaintenanceMode(enabled: boolean): void {
    this.isMaintenanceMode.set(enabled);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(MAINTENANCE_STORAGE_KEY, String(enabled));
  }
}
