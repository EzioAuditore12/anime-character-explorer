import { z } from 'zod';

export const pageInfoSchema = z.object({
    size: z.number(),

    number: z.number(),

    totalElements: z.number(),

    totalPages: z.number(),

}); 

export type PageInfo = z.infer<typeof pageInfoSchema>;