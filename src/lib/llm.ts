import OpenAI from 'openai';
import { ProductSchema, Product } from './schema';
import { AISettings } from '../types/user';

export async function parseProductDescription(text: string, settings?: AISettings): Promise<Product | null> {
    try {
        const apiKey = settings?.apiKey || process.env.OPENAI_API_KEY;

        if (!apiKey) {
            throw new Error("OpenAI API Key is missing. Please configure it in settings.");
        }

        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: settings?.provider === 'groq' ? 'https://api.groq.com/openai/v1' : undefined,
        });

        const model = settings?.model || "gpt-4-turbo";
        const temperature = settings?.temperature ?? 0.7;
        const maxTokens = settings?.maxTokens ?? 1000;

        const completion = await openai.chat.completions.create({
            model: model,
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
            temperature: temperature,
            max_tokens: maxTokens,
        });

        const content = completion.choices[0].message.content;
        if (!content) return null;

        const parsed = JSON.parse(content);
        // Validate with Zod
        const product = ProductSchema.parse(parsed);
        return product;
    } catch (error: any) {
        console.error("Error parsing product description:", error);
        if (error.response) {
            console.error("OpenAI Response Status:", error.response.status);
            console.error("OpenAI Response Data:", error.response.data);
        }
        return null;
    }
}
