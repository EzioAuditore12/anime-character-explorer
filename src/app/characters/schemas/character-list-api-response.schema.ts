import {z} from 'zod'
import { characterSchema } from './character.schema'
import { pageInfoSchema } from './page-info.schema'

export const characterListApiResponseSchema = z.object({
    content: z.array(characterSchema),

    page: pageInfoSchema

})

export type CharacterListApiResponse = z.infer<typeof characterListApiResponseSchema>