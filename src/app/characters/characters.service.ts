import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CharacterListApiResponse,
  characterListApiResponseSchema,
} from './schemas/character-list-api-response.schema';
import {
  CharacterSearchQueryParam,
  characterSearchQueryParamSchema,
} from './schemas/character-search-query-param.schema';
import { Character, characterSchema } from './schemas/character.schema';
import {
  CharacterDetailedProfile,
  characterDetailedProfileSchema,
} from './schemas/character-detailed-profile.schema';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  private readonly responseDelayMs = 550;
  private readonly characters = characterSchema.array().parse([
    {
      id: 1,
      name: 'Naruto Uzumaki',
      nameNative: 'うずまきナルト',
      gender: 'Male',
      favorites: 18432,
      mediumImageUrl: 'https://placehold.co/96x96/ffb703/111827?text=NU',
    },
    {
      id: 2,
      name: 'Sakura Kinomoto',
      nameNative: '木之本桜',
      gender: 'Female',
      favorites: 12780,
      mediumImageUrl: 'https://placehold.co/96x96/fb7185/ffffff?text=SK',
    },
    {
      id: 3,
      name: 'Monkey D. Luffy',
      nameNative: 'モンキー・D・ルフィ',
      gender: 'Male',
      favorites: 22104,
      mediumImageUrl: 'https://placehold.co/96x96/ef4444/ffffff?text=ML',
    },
    {
      id: 4,
      name: 'Mikasa Ackerman',
      nameNative: 'ミカサ・アッカーマン',
      gender: 'Female',
      favorites: 16892,
      mediumImageUrl: 'https://placehold.co/96x96/64748b/ffffff?text=MA',
    },
    {
      id: 5,
      name: 'Satoru Gojo',
      nameNative: '五条悟',
      gender: 'Male',
      favorites: 25431,
      mediumImageUrl: 'https://placehold.co/96x96/38bdf8/0f172a?text=SG',
    },
    {
      id: 6,
      name: 'Chihiro Ogino',
      nameNative: '荻野千尋',
      gender: 'Female',
      favorites: 9432,
      mediumImageUrl: 'https://placehold.co/96x96/34d399/0f172a?text=CO',
    },
    {
      id: 7,
      name: 'Edward Elric',
      nameNative: 'エドワード・エルリック',
      gender: 'Male',
      favorites: 11208,
      mediumImageUrl: 'https://placehold.co/96x96/f59e0b/111827?text=EE',
    },
    {
      id: 8,
      name: 'Usagi Tsukino',
      nameNative: '月野うさぎ',
      gender: 'Female',
      favorites: 19765,
      mediumImageUrl: 'https://placehold.co/96x96/e879f9/ffffff?text=UT',
    },
    {
      id: 9,
      name: 'Tanjiro Kamado',
      nameNative: '竈門炭治郎',
      gender: 'Male',
      favorites: 8765,
      mediumImageUrl: 'https://placehold.co/96x96/22c55e/ffffff?text=TK',
    },
    {
      id: 10,
      name: 'Anya Forger',
      nameNative: 'アーニャ・フォージャー',
      gender: 'Female',
      favorites: 23109,
      mediumImageUrl: 'https://placehold.co/96x96/a855f7/ffffff?text=AF',
    },
    {
      id: 11,
      name: 'Spike Spiegel',
      nameNative: 'スパイク・スピーゲル',
      gender: 'Male',
      favorites: 10234,
      mediumImageUrl: 'https://placehold.co/96x96/0ea5e9/ffffff?text=SS',
    },
    {
      id: 12,
      name: 'Hinata Hyuga',
      nameNative: '日向ヒナタ',
      gender: 'Female',
      favorites: 7654,
      mediumImageUrl: 'https://placehold.co/96x96/c084fc/ffffff?text=HH',
    },
    {
      id: 13,
      name: 'Eren Yeager',
      nameNative: 'エレン・イェーガー',
      gender: 'Male',
      favorites: 18976,
      mediumImageUrl: 'https://placehold.co/96x96/334155/ffffff?text=EY',
    },
    {
      id: 14,
      name: 'Nezuko Kamado',
      nameNative: '竈門禰豆子',
      gender: 'Female',
      favorites: 21345,
      mediumImageUrl: 'https://placehold.co/96x96/f43f5e/ffffff?text=NK',
    },
    {
      id: 15,
      name: 'Levi Ackerman',
      nameNative: 'リヴァイ・アッカーマン',
      gender: 'Male',
      favorites: 24567,
      mediumImageUrl: 'https://placehold.co/96x96/475569/ffffff?text=LA',
    },
    {
      id: 16,
      name: 'Rem',
      nameNative: 'レム',
      gender: 'Female',
      favorites: 27890,
      mediumImageUrl: 'https://placehold.co/96x96/60a5fa/ffffff?text=RE',
    },
    {
      id: 17,
      name: 'Ichigo Kurosaki',
      nameNative: '黒崎一護',
      gender: 'Male',
      favorites: 15678,
      mediumImageUrl: 'https://placehold.co/96x96/f97316/ffffff?text=IK',
    },
    {
      id: 18,
      name: 'Nami',
      nameNative: 'ナミ',
      gender: 'Female',
      favorites: 20123,
      mediumImageUrl: 'https://placehold.co/96x96/facc15/111827?text=NA',
    },
    {
      id: 19,
      name: 'Kakashi Hatake',
      nameNative: 'はたけカカシ',
      gender: 'Male',
      favorites: 17654,
      mediumImageUrl: 'https://placehold.co/96x96/94a3b8/111827?text=KH',
    },
    {
      id: 20,
      name: 'Violet Evergarden',
      nameNative: 'ヴァイオレット・エヴァーガーデン',
      gender: 'Female',
      favorites: 14321,
      mediumImageUrl: 'https://placehold.co/96x96/818cf8/ffffff?text=VE',
    },
    {
      id: 21,
      name: 'Gintoki Sakata',
      nameNative: '坂田銀時',
      gender: 'Male',
      favorites: 9876,
      mediumImageUrl: 'https://placehold.co/96x96/bae6fd/111827?text=GS',
    },
    {
      id: 22,
      name: 'Yor Forger',
      nameNative: 'ヨル・フォージャー',
      gender: 'Female',
      favorites: 22456,
      mediumImageUrl: 'https://placehold.co/96x96/be123c/ffffff?text=YF',
    },
    {
      id: 23,
      name: 'Kyojuro Rengoku',
      nameNative: '煉獄杏寿郎',
      gender: 'Male',
      favorites: 16789,
      mediumImageUrl: 'https://placehold.co/96x96/f97316/111827?text=KR',
    },
    {
      id: 24,
      name: 'Maomao',
      nameNative: '猫猫',
      gender: 'Female',
      favorites: 13245,
      mediumImageUrl: 'https://placehold.co/96x96/65a30d/ffffff?text=MM',
    },
  ]);

  getCharacters(query: CharacterSearchQueryParam = {}): Observable<CharacterListApiResponse> {
    const parsedQuery = characterSearchQueryParamSchema.parse(query);
    const page = parsedQuery.page ?? 0;
    const size = 8;

    return of(this.createResponse(this.filterCharacters(parsedQuery), page, size)).pipe(
      delay(this.responseDelayMs),
      map((response) => characterListApiResponseSchema.parse(response)),
    );
  }

  search(query: string): Observable<Character[]> {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const results = normalizedQuery
      ? this.characters.filter((character) =>
          [character.name, character.nameNative].some((value) =>
            value.toLocaleLowerCase().includes(normalizedQuery),
          ),
        )
      : [];

    return of(results.slice(0, 8)).pipe(
      delay(this.responseDelayMs),
      map((items) => characterSchema.array().parse(items)),
    );
  }

  getCharacter(id: number): Observable<Character> {
    const character = this.characters.find((item) => item.id === id);

    if (!character) {
      return throwError(() => new Error(`Character with id ${id} was not found.`));
    }

    return of(character).pipe(
      delay(this.responseDelayMs),
      map((item) => characterSchema.parse(item)),
    );
  }

  getCharacterProfile(id: number): Observable<CharacterDetailedProfile> {
    const character = this.characters.find((item) => item.id === id);

    if (!character) {
      return throwError(() => new Error(`Character with id ${id} was not found.`));
    }

    const profile = characterDetailedProfileSchema.parse({
      ...character,
      about: `${character.name} is one of the most memorable characters in the anime archive.`,
      payload: {
        Race: 'Human',
        Height: `181 cm (5'11")`,
        Zampakuto: 'Zangetsu',
        Relatives:
          'Father: [Ishhin Kurosaki](https://anilist.com/character/2553/Ishhin-Kurosaki), Mother: [Masaki Kurosaki](https://anilist.com/character/2554/Masaki-Kurosaki)',
      },
      age: 'Not available',
      dobYear: 2000,
      dobMonth: 1,
      dobDay: 1,
      imageUrl: character.mediumImageUrl,
      largeImageUrl: character.mediumImageUrl,
      source: 'Anime Character Explorer',
      sourceUrl: 'https://example.com/anime-character-explorer',
      nicknames: [character.name.split(' ')[0]],
      appearances: [
        {
          animeId: id * 10,
          malId: id * 100,
          title: `${character.name} Chronicles`,
          titleEnglish: `${character.name} Chronicles`,
          siteUrl: `https://example.com/anime/${id * 10}`,
          imageUrl: character.mediumImageUrl,
          role: 'MAIN',
        },
        {
          animeId: id * 10 + 1,
          malId: id * 100 + 1,
          title: 'Anime Archive Stories',
          titleEnglish: 'Anime Archive Stories',
          siteUrl: `https://example.com/anime/${id * 10 + 1}`,
          imageUrl: character.mediumImageUrl,
          role: 'SUPPORTING',
        },
      ],
      voiceActors: [
        {
          id: id * 1000,
          name: `${character.name} Voice Actor`,
          nameNative: 'ボイスアクター',
          language: 'Japanese',
          imageUrl: character.mediumImageUrl,
          url: `https://example.com/voice-actors/${id * 1000}`,
        },
      ],
    });

    return of(profile).pipe(
      delay(this.responseDelayMs),
      map((item) => characterDetailedProfileSchema.parse(item)),
    );
  }

  private filterCharacters(query: CharacterSearchQueryParam): Character[] {
    const name = query.name?.trim().toLowerCase();
    const nickname = query.nickname?.trim().toLowerCase();
    const filteredCharacters = this.characters.filter((character) => {
      const matchesName = !name || character.name.toLowerCase().includes(name);
      const matchesNickname = !nickname || character.name.toLowerCase().includes(nickname);
      const matchesGender = !query.gender || character.gender === query.gender;

      return matchesName && matchesNickname && matchesGender;
    });

    const sortField = query.sort?.[0];
    if (sortField !== 'favorites' && sortField !== 'id') {
      return filteredCharacters;
    }

    const descending = query.sort?.[1] === 'DESC';
    return [...filteredCharacters].sort((first, second) => {
      const firstValue = sortField === 'favorites' ? first.favorites : first.id;
      const secondValue = sortField === 'favorites' ? second.favorites : second.id;
      return descending ? secondValue - firstValue : firstValue - secondValue;
    });
  }

  private createResponse(characters: Character[], page: number, size: number): CharacterListApiResponse {
    const totalPages = Math.ceil(characters.length / size);
    const start = page * size;
    const response = {
      content: characters.slice(start, start + size),
      page: {
        size,
        number: page,
        totalElements: characters.length,
        totalPages,
      },
    };

    return characterListApiResponseSchema.parse(response);
  }
}