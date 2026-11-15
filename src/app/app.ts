import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';

import { Character } from './characters/schemas/character.schema';
import { CharactersService } from './characters/characters.service';

type GlobalSearchResult =
  | { type: 'character'; character: Character }
  | { type: 'setting'; title: string; description: string; icon: string; route: string };

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly charactersService = inject(CharactersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly searchViewModel$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    map((query) => query.trim()),
    debounceTime(250),
    distinctUntilChanged(),
    switchMap((query) => {
      if (!query) {
        return of({ results: [] as GlobalSearchResult[], loading: false, error: '' });
      }

      return this.charactersService.search(query).pipe(
        map((characters) => ({
          results: this.createSearchResults(query, characters),
          loading: false,
          error: '',
        })),
        startWith({ results: [] as GlobalSearchResult[], loading: true, error: '' }),
        catchError((error: Error) =>
          of({ results: [] as GlobalSearchResult[], loading: false, error: error.message }),
        ),
      );
    }),
    takeUntilDestroyed(this.destroyRef),
  );

  openCharacter(id: number): void {
    this.searchControl.setValue('');
    void this.router.navigate(['/characters', id]);
  }

  openSetting(route: string): void {
    this.searchControl.setValue('');
    void this.router.navigate([route]);
  }

  private createSearchResults(query: string, characters: Character[]): GlobalSearchResult[] {
    const results: GlobalSearchResult[] = characters.map((character) => ({
      type: 'character',
      character,
    }));
    const normalizedQuery = query.toLocaleLowerCase();

    if (['setting', 'settings', 'theme', 'dark mode', 'appearance'].some((term) =>
      normalizedQuery.includes(term),
    )) {
      results.push({
        type: 'setting',
        title: 'Appearance settings',
        description: 'Change light or dark mode',
        icon: 'settings',
        route: '/settings',
      });
    }

    return results;
  }
}
