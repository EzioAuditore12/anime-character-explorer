import { AsyncPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap, throwError } from 'rxjs';

import { CharactersService } from '../characters.service';
import { CharacterDetailedProfile } from '../schemas/character-detailed-profile.schema';
import { FavoritesStore } from '../state/favorites.store';

interface PayloadRow {
  key: string;
  value: string;
  linkedIds: number[];
  relatedCharacters: RelatedCharacter[];
}

interface RelatedCharacter {
  id: number;
  name: string;
  relation?: string;
}

@Component({
  selector: 'app-character-profile',
  standalone: true,
  imports: [
    AsyncPipe,
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    RouterLink,
    TitleCasePipe,
  ],
  templateUrl: './character-profile.html',
  styleUrl: './character-profile.css',
})
export class CharacterProfile {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly charactersService = inject(CharactersService);
  readonly favoritesStore = inject(FavoritesStore);

  readonly payloadColumns = ['property', 'value'];

  readonly viewModel$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) =>
      Number.isInteger(id) && id > 0
        ? this.charactersService.getCharacterProfile(id)
        : throwError(() => new Error('Invalid character id.')),
    ),
    map((character) => ({ character, error: '', loading: false })),
    startWith({ character: null as CharacterDetailedProfile | null, error: '', loading: true }),
    catchError((error: Error) =>
      of({ character: null as CharacterDetailedProfile | null, error: error.message, loading: false }),
    ),
  );

  getPayloadRows(payload: unknown): PayloadRow[] {
    return this.flattenPayload(payload);
  }

  toggleFavorite(character: CharacterDetailedProfile): void {
    this.favoritesStore.toggle(character);
  }

  private flattenPayload(payload: unknown, parentKey = ''): PayloadRow[] {
    if (payload === null || payload === undefined) {
      return [];
    }

    if (Array.isArray(payload)) {
      return payload.flatMap((item, index) => this.flattenPayload(item, `${parentKey}[${index + 1}]`));
    }

    if (typeof payload === 'object') {
      return Object.entries(payload).flatMap(([key, value]) =>
        this.flattenPayload(value, parentKey ? `${parentKey}.${key}` : key),
      );
    }

    const text = String(payload);
    const markdownLink = text.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    const value = markdownLink?.[1] ?? text;
    const linkedIds = this.extractIds(text);
    const relatedCharacters = this.extractRelatedCharacters(text);

    return parentKey
      ? [{ key: parentKey, value, linkedIds, relatedCharacters }]
      : [];
  }

  openRelatedCharacter(id: number): void {
    void this.router.navigate(['/characters', id]);
  }

  private extractIds(value: string): number[] {
    const urls = value.match(/https?:\/\/[^\s)]+/gi) ?? [];
    const ids = urls
      .map((url) => url.match(/\/(?:character|anime)\/(\d+)(?:[/?#]|$)/i)?.[1])
      .filter((id): id is string => Boolean(id))
      .map(Number);

    return [...new Set(ids)];
  }

  private extractRelatedCharacters(value: string): RelatedCharacter[] {
    const relatedCharacters: RelatedCharacter[] = [];
    const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    let match: RegExpExecArray | null;

    while ((match = linkPattern.exec(value)) !== null) {
      if (!/\/character\//i.test(match[2])) {
        continue;
      }

      const id = this.extractId(match[2]);
      if (id !== undefined && !relatedCharacters.some((character) => character.id === id)) {
        const prefix = value
          .slice(0, match.index)
          .match(/(?:^|[,;])\s*([^,\[\]]+?)\s*:\s*$/);
        const suffix = value.slice(match.index + match[0].length).match(/^\s*\(([^)]+)\)/);
        const relation = prefix?.[1].trim() ?? suffix?.[1].trim();

        relatedCharacters.push({ id, name: match[1], relation });
      }
    }

    return relatedCharacters;
  }

  private extractId(url: string): number | undefined {
    const match = url.match(/\/(?:character|anime)\/(\d+)(?:[/?#]|$)/i);
    return match ? Number(match[1]) : undefined;
  }
}
