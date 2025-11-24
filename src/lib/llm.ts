import OpenAI from 'openai';
import { ProductSchema, Product } from './schema';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function parseProductDescription(text: string): Promise<Product | null> {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert e-commerce assistant. Extract product details from the user's description into a structured JSON object that matches the following schema:
          
          {
            "name": "string",
            "short_description": "string",
            "description": "string",
            "regular_price": "string",
            "sale_price": "string",
            "stock_quantity": number,
            "categories": ["string"],
            "tags": ["string"],
            "images": ["string"],
            "attributes": [{"name": "string", "value": "string", "visible": boolean, "variation": boolean}]
          }

          Infer missing details where reasonable. Ensure the response is valid JSON.`
                },
                { role: "user", content: text },
            ],
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) return null;

        const parsed = JSON.parse(content);
        // Validate with Zod
        const product = ProductSchema.parse(parsed);
        return product;
    } catch (error) {
        console.error("Error parsing product description:", error);
        return null;
    }
}
