import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MaintenanceService } from './maintenance.service';

export const maintenanceGuard: CanActivateFn = (_route, state) => {
  const maintenanceService = inject(MaintenanceService);
  const router = inject(Router);

  const isMaintenanceEnabled = maintenanceService.isMaintenanceMode();
  const target = state.url.toLowerCase();

  if (!isMaintenanceEnabled) {
    return true;
  }

  if (target.startsWith('/admin') || target.startsWith('/maintenance')) {
    return true;
  }

  return router.createUrlTree(['/maintenance']);
};
