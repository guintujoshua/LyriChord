import { Routes } from '@angular/router';
import { Main } from './Pages/main/main';
import { SongList } from './Pages/song-list/song-list';

export const routes: Routes = [

    {
        "path":"",component:Main
    },
    { 
        path: 'SongList', component: SongList 
    }
];

