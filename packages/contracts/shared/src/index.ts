import { z } from "zod";
import { roomSchema } from "./schemas/room.schema";
 
z.parse(roomSchema, { });
