import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';

import { Character } from './schemas/character.schema';
import { CharacterSearchQueryParam } from './schemas/character-search-query-param.schema';
import { PageInfo } from './schemas/page-info.schema';
import { CharactersService } from './characters.service';
import { CharacterList } from './character-list/character-list';
import { CharacterFilter } from './character-filter/character-filter';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [
    AsyncPipe,
    CharacterFilter,
    CharacterList,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSidenavModule,
    RouterLink,
  ],
  templateUrl: './characters.html',
  styleUrl: './characters.css',
})
export class Characters {
  private readonly charactersService = inject(CharactersService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly querySubject = new BehaviorSubject<CharacterSearchQueryParam>({});
  private currentQuery: CharacterSearchQueryParam = {};

  readonly isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 720px)').pipe(map(({ matches }) => matches)),
    { initialValue: false },
  );

  private readonly emptyPage: PageInfo = {
    size: 8,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  };

  readonly viewModel$ = this.querySubject.pipe(
    debounceTime(250),
    distinctUntilChanged(
      (previous, current) =>
        previous.name === current.name &&
        previous.gender === current.gender &&
        previous.page === current.page &&
        previous.size === current.size,
    ),
    switchMap((query) =>
      this.charactersService.getCharacters(query).pipe(
        map((response) => ({
          characters: response.content,
          total: response.page.totalElements,
          page: response.page,
          loading: false,
          error: '',
        })),
        startWith({ characters: [] as Character[], total: 0, page: this.emptyPage, loading: true, error: '' }),
        catchError((error: Error) =>
          of({ characters: [] as Character[], total: 0, page: this.emptyPage, loading: false, error: error.message }),
        ),
      ),
    ),
  );

  onFiltersChanged(query: CharacterSearchQueryParam): void {
    this.currentQuery = query;
    this.querySubject.next(query);
  }

  onPageChange(event: PageEvent): void {
    this.currentQuery = {
      ...this.currentQuery,
      page: event.pageIndex,
      size: 8,
    };
    this.querySubject.next(this.currentQuery);
  }
}
