import { z } from "zod";

export const roomSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  maxPlayers: z.number().int().min(2).max(8),
});
