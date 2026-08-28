import { z } from "zod"; import { phoneSchema } from "./phone"; export const orderLookupSchema = z.object({ orderNumber: z.string().min(1), phone: phoneSchema });
