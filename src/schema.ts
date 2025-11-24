import { z } from 'zod';

// Define the schema for a WooCommerce Product based on standard CSV import columns
export const ProductSchema = z.object({
    name: z.string().describe("The name of the product"),
    short_description: z.string().optional().describe("A short summary of the product"),
    description: z.string().optional().describe("Full details of the product"),
    regular_price: z.string().optional().describe("The normal price of the product"),
    sale_price: z.string().optional().describe("The discounted price of the product, if any"),
    stock_quantity: z.number().optional().describe("Number of items in stock"),
    categories: z.array(z.string()).describe("List of categories the product belongs to"),
    tags: z.array(z.string()).optional().describe("List of tags for the product"),
    images: z.array(z.string()).optional().describe("List of image URLs"),
    attributes: z.array(z.object({
        name: z.string(),
        value: z.string(),
        visible: z.boolean().default(true),
        variation: z.boolean().default(true)
    })).optional().describe("Product attributes like Size, Color, etc.")
});

export type Product = z.infer<typeof ProductSchema>;
