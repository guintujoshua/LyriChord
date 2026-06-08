import { Routes } from '@angular/router';
import { Main } from './Pages/main/main';
import { SongList } from './Pages/song-list/song-list';
import { Song } from './Pages/song/song';
import { Login } from './Pages/login/login';
import { NotFoundPage } from './Pages/Error/not-found-page/not-found-page';
import { AdminLandingPage } from './Pages/Admin/admin-landing-page/admin-landing-page';
import { Managesong } from './Pages/Admin/managesong/managesong';
import { ManageUser } from './Pages/Admin/manage-user/manage-user';
import { Settings } from './Pages/Admin/settings/settings';
import { MaintenancePage } from './Pages/Error/maintenance-page/maintenance-page';
import { maintenanceGuard } from './core/maintenance.guard';

export const routes: Routes = [

    {
        "path":"",component:Main, canActivate: [maintenanceGuard]
    },
    { 
        path: 'SongList', component: SongList, canActivate: [maintenanceGuard]
    },
    {
        path: 'song/:slug', component: Song, canActivate: [maintenanceGuard]
    },
    {
        path: 'login', component: Login, canActivate: [maintenanceGuard]
    },
    {
        path: 'maintenance', component: MaintenancePage
    },
    {
        path: 'admin', component: AdminLandingPage
    },
    {
        path: 'admin/songs', component: Managesong
    },
    {
        path: 'admin/users', component: ManageUser
    },
    {
        path: 'admin/settings', component: Settings
    },
    {
    path: '**',
    component: NotFoundPage
    }
];

