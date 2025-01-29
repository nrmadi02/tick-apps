import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" }),
});

export type RoleRequest = z.infer<typeof roleSchema>;
