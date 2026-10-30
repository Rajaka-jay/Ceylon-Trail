import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const destinationSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters").max(120),
  slug: z.string().trim().regex(slugPattern, "Slug must use lowercase letters, numbers and hyphens").max(120),
  location: z.string().trim().min(2, "Location must contain at least 2 characters").max(120),
  shortDescription: z.string().trim().min(20, "Description must contain at least 20 characters").max(500),
  imageUrl: z.union([z.string().url("Image URL must be a valid URL"), z.literal("")]).optional().default(""),
  seoDescription: z.string().trim().max(320, "SEO description cannot exceed 320 characters").optional().default(""),
  categoryId: z.coerce.number().int().positive("Category must be a positive integer"),
});

export type DestinationInput = z.infer<typeof destinationSchema>;
