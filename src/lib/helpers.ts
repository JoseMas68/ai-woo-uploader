import { AttributeOverride, ProductStatus, ShippingInfo, ShippingDimensions, SplitOptions } from '../types';

export const splitInputList = (value: string, options: SplitOptions = {}): string[] => {
    if (!value) return [];
    const parts = value
        .split(/[\n,]+/)
        .flatMap((part) => (options.allowHierarchy ? part.split('>') : [part]))
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

    return Array.from(new Set(parts));
};

export const parseStockQuantity = (value: string): number | undefined => {
    if (!value) return undefined;
    const normalized = value.replace(/[^0-9.,-]/g, '').replace(',', '.');
    if (!normalized) return undefined;
    const parsed = parseFloat(normalized);
    if (!Number.isFinite(parsed)) return undefined;
    return Math.max(0, Math.round(parsed));
};

export const mapStatusAnswer = (value: string): ProductStatus | undefined => {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return undefined;
    if (normalized.includes('borrador') || normalized.includes('draft')) return 'draft';
    if (normalized.includes('pend')) return 'pending';
    if (normalized.includes('priv')) return 'private';
    const sanitized = normalized.replace(/[^a-záéíóúüñ\s]/g, ' ');
    const tokens = sanitized.split(/\s+/).filter(Boolean);
    if (
        normalized.includes('public') ||
        normalized.includes('activar') ||
        tokens.includes('si') ||
        tokens.includes('sí')
    ) {
        return 'publish';
    }
    return undefined;
};

export const parseShippingDetails = (raw: string): ShippingInfo => {
    if (!raw.trim()) return {};

    const toNumber = (input: string): number | undefined => {
        const normalized = input.replace(/[^0-9.,-]/g, '').replace(',', '.');
        if (!normalized) return undefined;
        const parsed = parseFloat(normalized);
        return Number.isFinite(parsed) ? parsed : undefined;
    };

    const formatNumber = (value: number): string => {
        const rounded = Math.round(value * 1000) / 1000;
        return Number.isInteger(rounded) ? String(rounded) : rounded.toString();
    };

    const weightMatch = raw.match(/peso\s*: ?([\d.,]+)\s*([a-zA-Z]*)/i) || raw.match(/weight\s*: ?([\d.,]+)\s*([a-zA-Z]*)/i);
    let weight: string | undefined;
    if (weightMatch) {
        const amount = toNumber(weightMatch[1]);
        if (amount !== undefined) {
            const unit = (weightMatch[2] || '').toLowerCase();
            if (unit.startsWith('g')) {
                weight = formatNumber(amount / 1000);
            } else {
                weight = formatNumber(amount);
            }
        }
    }

    const dimensions: ShippingDimensions = {};
    const dimensionPattern = raw.match(/dimensiones?\s*: ?([\d.,]+)\s*[xX]\s*([\d.,]+)\s*[xX]\s*([\d.,]+)/);

    if (dimensionPattern) {
        const lengthValue = toNumber(dimensionPattern[1]);
        const widthValue = toNumber(dimensionPattern[2]);
        const heightValue = toNumber(dimensionPattern[3]);
        if (lengthValue !== undefined) dimensions.length = formatNumber(lengthValue);
        if (widthValue !== undefined) dimensions.width = formatNumber(widthValue);
        if (heightValue !== undefined) dimensions.height = formatNumber(heightValue);
    } else {
        const lengthMatch = raw.match(/(largo|longitud|length)\s*: ?([\d.,]+)/i);
        const widthMatch = raw.match(/(ancho|width)\s*: ?([\d.,]+)/i);
        const heightMatch = raw.match(/(alto|altura|height)\s*: ?([\d.,]+)/i);

        if (lengthMatch) {
            const value = toNumber(lengthMatch[2]);
            if (value !== undefined) dimensions.length = formatNumber(value);
        }
        if (widthMatch) {
            const value = toNumber(widthMatch[2]);
            if (value !== undefined) dimensions.width = formatNumber(value);
        }
        if (heightMatch) {
            const value = toNumber(heightMatch[2]);
            if (value !== undefined) dimensions.height = formatNumber(value);
        }
    }

    const hasDimensions = Object.values(dimensions).some(Boolean);

    return {
        weight,
        dimensions: hasDimensions ? dimensions : undefined,
    };
};

export const parseAttributesInput = (raw: string): AttributeOverride[] => {
    if (!raw.trim()) return [];

    const segments = raw
        .split(/[\n;]+/)
        .flatMap((segment) => segment.split(','))
        .map((segment) => segment.trim())
        .filter((segment) => segment.length > 0);

    const attributesMap = new Map<string, AttributeOverride>();

    segments.forEach((segment) => {
        const [rawName, rawValue] = segment.split(/[:=|-]/).map((part) => part.trim());
        if (!rawName || !rawValue) return;

        const key = rawName.toLowerCase();
        if (!attributesMap.has(key)) {
            attributesMap.set(key, {
                name: rawName,
                value: rawValue,
                visible: true,
                variation: false,
            });
        }
    });

    return Array.from(attributesMap.values());
};

export const normalizeProductResult = (payload: any) => {
    if (!payload?.product) return payload;

    const product = payload.product;
    const normalizedCategories = Array.isArray(product.categories)
        ? product.categories
        : splitInputList(String(product.categories ?? ''), { allowHierarchy: true });
    const normalizedTags = Array.isArray(product.tags)
        ? product.tags
        : splitInputList(String(product.tags ?? ''));
    const normalizedImages = Array.isArray(product.images)
        ? product.images
        : splitInputList(String(product.images ?? ''));
    const parsedStock = typeof product.stock_quantity === 'number'
        ? product.stock_quantity
        : parseStockQuantity(String(product.stock_quantity ?? ''));

    return {
        ...payload,
        product: {
            ...product,
            categories: normalizedCategories,
            tags: normalizedTags,
            images: normalizedImages,
            stock_quantity: parsedStock ?? undefined,
            attributes: Array.isArray(product.attributes) ? product.attributes : [],
        },
    };
};
