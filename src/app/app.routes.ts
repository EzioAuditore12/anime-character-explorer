import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'characters',
  },
  {
    path: 'characters',
    loadComponent: () =>
      import('./characters/characters').then(({ Characters }) => Characters),
  },
  {
    path: 'characters/:id',
    loadComponent: () =>
      import('./characters/character-profile/character-profile').then(
        ({ CharacterProfile }) => CharacterProfile,
      ),
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings').then(({ Settings }) => Settings),
  },
  {
    path: 'favorites',
    loadComponent: () => import('./favorites/favorites').then(({ Favorites }) => Favorites),
  },
  {
    path: '**',
    redirectTo: 'characters',
  },
];
