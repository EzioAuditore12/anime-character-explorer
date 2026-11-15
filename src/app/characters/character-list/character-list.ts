import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ClientSideRowModelModule,
  CellStyleModule,
  ColDef,
  ICellRendererParams,
} from 'ag-grid-community';

import { Character } from '../schemas/character.schema';
import { FavoritesStore } from '../state/favorites.store';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './character-list.html',
  styleUrl: './character-list.css',
})
export class CharacterList {
  private readonly favoritesStore = inject(FavoritesStore);
  private readonly router = inject(Router);
  readonly gridModules = [CellStyleModule, ClientSideRowModelModule];
  readonly columnDefs: ColDef<Character>[] = [
    {
      headerName: '',
      width: 64,
      sortable: false,
      filter: false,
      cellRenderer: ({ data }: ICellRendererParams<Character>) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'grid-favorite-button';
        const setIcon = (isFavorite: boolean): void => {
          button.innerHTML = `<span class="material-icons" aria-hidden="true">${isFavorite ? 'star' : 'star_border'}</span>`;
        };
        setIcon(this.favoritesStore.isFavorite(data?.id ?? -1));
        button.setAttribute(
          'aria-label',
          `${this.favoritesStore.isFavorite(data?.id ?? -1) ? 'Remove' : 'Add'} ${data?.name ?? 'character'} ${'favorite'}`,
        );
        button.addEventListener('click', () => {
          if (data) {
            this.favoritesStore.toggle(data);
            const isFavorite = this.favoritesStore.isFavorite(data.id);
            setIcon(isFavorite);
            button.setAttribute(
              'aria-label',
              `${isFavorite ? 'Remove' : 'Add'} ${data.name} favorite`,
            );
          }
        });
        return button;
      },
    },
    {
      field: 'mediumImageUrl',
      headerName: 'Portrait',
      width: 90,
      sortable: false,
      filter: false,
      cellRenderer: ({ value }: ICellRendererParams<Character>) => {
        const image = document.createElement('img');
        image.src = value;
        image.alt = 'Character portrait';
        image.className = 'character-portrait';
        return image;
      },
    },
    {
      field: 'name',
      headerName: 'Character',
      flex: 1.4,
      minWidth: 180,
    },
    {
      field: 'nameNative',
      headerName: 'Native name',
      flex: 1.5,
      minWidth: 190,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'favorites',
      headerName: 'Favorites',
      flex: 0.9,
      minWidth: 130,
      valueFormatter: ({ value }) => Number(value).toLocaleString(),
    },
    {
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filter: false,
      cellRenderer: ({ data }: ICellRendererParams<Character>) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'View profile';
        button.setAttribute('aria-label', `View ${data?.name ?? 'character'} profile`);
        button.style.cursor = 'pointer';
        button.style.padding = '6px 10px';
        button.addEventListener('click', () => {
          if (data) {
            void this.router.navigate(['/characters', data.id]);
          }
        });
        return button;
      },
    },
  ];

  readonly defaultColDef: ColDef<Character> = {
    resizable: true,
    cellStyle: {
      paddingLeft: '20px',
      paddingRight: '20px',
    },
  };

  @Input({ required: true }) characters: Character[] = [];
}
