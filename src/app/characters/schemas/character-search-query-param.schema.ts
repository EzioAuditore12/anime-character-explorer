import {z} from 'zod'

import { characterSchema } from "./character.schema";

export const characterSearchQueryParamSchema = characterSchema.pick({
    name: true,

    gender: true,
}).extend({
    nickname: z.string(),

    page: z.number().min(0),

    size: z.number().min(1).max(20).default(20),

    sort: z.array(z.literal(['favorites', 'DESC', 'id'])),
}).partial()

export type CharacterSearchQueryParam = z.infer<typeof characterSearchQueryParamSchema>