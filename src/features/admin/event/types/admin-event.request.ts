import { z } from "zod";

export const coordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const ticketCategorySchema = z.object({
  name: z.string(),
  price: z.string().min(1, "Price required"),
  quota: z.string().min(1, "Quota required"),
  description: z.string().optional(),
});

export const createEventSchema = z.object({
  name: z.string().min(3, "Name event minimal 3 characters"),
  description: z.string().min(10, "Description minimal 10 characters"),
  startDate: z.date().min(new Date(), "Date must be in the future"),
  endDate: z.date(),
  venue: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  country: z.string().default("Indonesia"),
  postalCode: z.string().optional(),
  coordinates: coordinatesSchema.optional(),
  categories: z
    .array(ticketCategorySchema)
    .min(1, "At least one ticket category is required"),
});

export const getEventsSchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["date", "name", "createdAt"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateEventRequest = z.infer<typeof createEventSchema>;
