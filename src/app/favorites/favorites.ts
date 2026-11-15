import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { CharacterList } from '../characters/character-list/character-list';
import { FavoritesStore } from '../characters/state/favorites.store';

@Component({
  selector: 'app-favorites',
  imports: [CharacterList, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  readonly favoritesStore = inject(FavoritesStore);
}
