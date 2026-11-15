import {z} from 'zod'

export const characterSchema = z.object({
    id: z.number(),

    name: z.string(),

    nameNative: z.string(),

    gender: z.string(),

    favorites: z.number(),

    mediumImageUrl: z.string(),
})

export type Character = z.infer<typeof characterSchema>