export type ConversationStep =
    | 'name'
    | 'price'
    | 'shortDescription'
    | 'longDescription'
    | 'category'
    | 'tags'
    | 'images'
    | 'stock'
    | 'sku'
    | 'status'
    | 'productType'
    | 'shipping'
    | 'attributes'
    | 'complete';

export type ProductStatus = 'draft' | 'pending' | 'private' | 'publish';

export type ProductData = {
    name: string;
    price: string;
    shortDescription: string;
    longDescription: string;
    category: string;
    tags: string;
    images: string;
    stock: string;
    sku: string;
    status: string;
    productType: string;
    shippingDetails: string;
    attributes: string;
};

export type ShippingDimensions = {
    length?: string;
    width?: string;
    height?: string;
};

export type ShippingInfo = {
    weight?: string;
    dimensions?: ShippingDimensions;
};

export type AttributeOverride = {
    name: string;
    value: string;
    visible: boolean;
    variation: boolean;
};

export interface SplitOptions {
    allowHierarchy?: boolean;
}
