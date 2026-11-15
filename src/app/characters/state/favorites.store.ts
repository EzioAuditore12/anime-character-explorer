import { Injectable, computed, signal } from '@angular/core';
import type { Character } from '../schemas/character.schema';

@Injectable({
  providedIn: 'root',
})
export class FavoritesStore {
  private readonly storageKey = 'anime-character-explorer.favorite-ids';
  private readonly favoriteCharacters = signal<Map<number, Character>>(this.loadFavorites());

  readonly favorites = computed(() => [...this.favoriteCharacters().values()]);
  readonly count = computed(() => this.favoriteCharacters().size);

  isFavorite(id: number): boolean {
    return this.favoriteCharacters().has(id);
  }

  toggle(character: Character): void {
    const nextFavorites = new Map(this.favoriteCharacters());

    if (nextFavorites.has(character.id)) {
      nextFavorites.delete(character.id);
    } else {
      nextFavorites.set(character.id, character);
    }

    this.favoriteCharacters.set(nextFavorites);
    this.persist(nextFavorites);
  }

  clear(): void {
    this.favoriteCharacters.set(new Map());
    this.persist(new Map());
  }

  private loadFavorites(): Map<number, Character> {
    if (typeof localStorage === 'undefined') {
      return new Map();
    }

    try {
      const storedValue: unknown = JSON.parse(localStorage.getItem(this.storageKey) ?? '[]');
      if (!Array.isArray(storedValue)) {
        return new Map();
      }

      const favorites = storedValue.filter(this.isCharacter);
      return new Map(favorites.map((character) => [character.id, character]));
    } catch (error) {
      console.warn('Unable to read saved favorites.', error);
      return new Map();
    }
  }

  private persist(favorites: Map<number, Character>): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify([...favorites.values()]));
      } catch (error) {
        console.warn('Unable to persist favorites.', error);
      }
    }
  }

  private isCharacter(value: unknown): value is Character {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const character = value as Partial<Character>;
    return (
      typeof character.id === 'number' &&
      typeof character.name === 'string' &&
      typeof character.nameNative === 'string' &&
      typeof character.gender === 'string' &&
      typeof character.favorites === 'number' &&
      typeof character.mediumImageUrl === 'string'
    );
  }
}
