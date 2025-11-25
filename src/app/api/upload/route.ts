import { NextResponse } from 'next/server';
import { createProduct } from '@/lib/woocommerce';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { product, images, wooSettings } = body;

        if (!product) {
            return NextResponse.json({ error: 'Product data is required' }, { status: 400 });
        }

        // Merge images if provided
        const fullProduct = { ...product, images };
        const result = await createProduct(fullProduct, wooSettings);
        return NextResponse.json({ success: true, product: result });
    } catch (error) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
