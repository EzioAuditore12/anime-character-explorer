import { z } from 'zod';
import {characterSchema} from './character.schema';

export const characterDetailedProfileSchema = characterSchema.extend({
    about: z.string(),

    payload: z.json(),

    age: z.string(),

    dobYear: z.number(),

    dobMonth: z.number(),

    dobDay: z.number(),

    imageUrl: z.string(),

    largeImageUrl: z.string(),

    source: z.string(),

    sourceUrl: z.url(),

    nicknames: z.array(z.string()),

    appearances: z.array(z.object({
        animeId: z.number(),

        malId: z.number(),

        title: z.string(),

        titleEnglish: z.string(),

        siteUrl: z.url(),

        imageUrl: z.string(),

        role: z.enum(['MAIN','SUPPORTING','BACKGROUND']),

    })),

    voiceActors: z.array(z.object({
        id: z.number(),

        name: z.string(),

        nameNative: z.string(),

        language: z.string(),

        imageUrl: z.string(),

        url: z.url(),

    })),

});

export type CharacterDetailedProfile = z.infer<typeof characterDetailedProfileSchema>;