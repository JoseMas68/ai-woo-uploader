import { NextResponse } from 'next/server';
import { parseProductDescription } from '@/lib/llm';
import { generateCSV } from '@/lib/csv';
import { Product } from '@/lib/schema';

type Overrides = Partial<Pick<Product,
    'name' |
    'short_description' |
    'description' |
    'regular_price' |
    'sale_price' |
    'sku' |
    'status' |
    'type' |
    'weight'
>> & {
    categories?: string[];
    tags?: string[];
    images?: string[];
    stock_quantity?: number;
    attributes?: Product['attributes'];
    dimensions?: Product['dimensions'];
};

const mergeOverrides = (product: Product, overrides?: Overrides): Product => {
    if (!overrides) return product;

    const sanitizeList = (value?: string[]): string[] | undefined => {
        if (!value) return undefined;
        const filtered = value.map((item) => item.trim()).filter((item) => item.length > 0);
        if (filtered.length === 0) return undefined;
        return Array.from(new Set(filtered));
    };

    const sanitizedCategories = sanitizeList(overrides.categories);
    const sanitizedTags = sanitizeList(overrides.tags);
    const sanitizedImages = sanitizeList(overrides.images);
    const sanitizedAttributes = overrides.attributes && overrides.attributes.length > 0
        ? overrides.attributes.filter((attr) => attr.name && attr.value)
        : undefined;
    const sanitizedDimensions = overrides.dimensions && (
        overrides.dimensions.length || overrides.dimensions.width || overrides.dimensions.height
    )
        ? {
              length: overrides.dimensions.length,
              width: overrides.dimensions.width,
              height: overrides.dimensions.height,
          }
        : undefined;
    const sanitizedWeight = overrides.weight?.trim();
    const sanitizedSku = overrides.sku?.trim();
    const allowedStatuses: Product['status'][] = ['draft', 'pending', 'private', 'publish'];
    const sanitizedStatus = overrides.status
        ? (overrides.status.trim().toLowerCase() as Product['status'])
        : undefined;
    const statusValue = sanitizedStatus && allowedStatuses.includes(sanitizedStatus) ? sanitizedStatus : undefined;
    const sanitizedType = overrides.type?.trim().toLowerCase();

    return {
        ...product,
        ...(overrides.name ? { name: overrides.name } : {}),
        ...(overrides.short_description ? { short_description: overrides.short_description } : {}),
        ...(overrides.description ? { description: overrides.description } : {}),
        ...(overrides.regular_price ? { regular_price: overrides.regular_price } : {}),
        ...(overrides.sale_price ? { sale_price: overrides.sale_price } : {}),
        ...(sanitizedCategories ? { categories: sanitizedCategories } : {}),
        ...(sanitizedTags ? { tags: sanitizedTags } : {}),
        ...(sanitizedImages ? { images: sanitizedImages } : {}),
        ...(sanitizedSku ? { sku: sanitizedSku } : {}),
        ...(statusValue ? { status: statusValue } : {}),
        ...(sanitizedType ? { type: sanitizedType } : {}),
        ...(sanitizedWeight ? { weight: sanitizedWeight } : {}),
        ...(sanitizedDimensions ? { dimensions: sanitizedDimensions } : {}),
        ...(sanitizedAttributes ? { attributes: sanitizedAttributes } : {}),
        ...(overrides.stock_quantity !== undefined ? { stock_quantity: overrides.stock_quantity } : {}),
    };
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text, overrides } = body as { text?: string; overrides?: Overrides };

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const product = await parseProductDescription(text);

        if (!product) {
            return NextResponse.json({ error: 'Failed to parse product' }, { status: 500 });
        }

        const finalProduct = mergeOverrides(product, overrides);
        const csv = generateCSV([finalProduct]);

        return NextResponse.json({ product: finalProduct, csv });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
