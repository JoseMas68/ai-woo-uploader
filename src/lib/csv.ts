import { stringify } from 'csv-stringify/sync';
import { Product } from './schema';

export function generateCSV(products: Product[]): string {
    // Map our internal Product schema to WooCommerce CSV columns
    const records = products.map(p => {
        const record: any = {
            'Type': 'simple',
            'SKU': '', // Could generate a random SKU if needed
            'Name': p.name,
            'Published': 1,
            'Is featured?': 0,
            'Visibility in catalog': 'visible',
            'Short description': p.short_description || '',
            'Description': p.description || '',
            'Date sale price starts': '',
            'Date sale price ends': '',
            'Tax status': 'taxable',
            'Tax class': '',
            'In stock?': p.stock_quantity ? 1 : 0,
            'Stock': p.stock_quantity || 0,
            'Backorders allowed?': 0,
            'Sold individually?': 0,
            'Weight (kg)': '',
            'Length (cm)': '',
            'Width (cm)': '',
            'Height (cm)': '',
            'Allow customer reviews?': 1,
            'Purchase note': '',
            'Sale price': p.sale_price || '',
            'Regular price': p.regular_price || '',
            'Categories': p.categories.join(', '),
            'Tags': p.tags ? p.tags.join(', ') : '',
            'Shipping class': '',
            'Images': p.images ? p.images.join(', ') : '',
            'Parent': '',
        };

        // Handle Attributes (WooCommerce expects specific column names like "Attribute 1 name", "Attribute 1 value(s)")
        if (p.attributes) {
            p.attributes.forEach((attr, index) => {
                const i = index + 1;
                record[`Attribute ${i} name`] = attr.name;
                record[`Attribute ${i} value(s)`] = attr.value;
                record[`Attribute ${i} visible`] = attr.visible ? 1 : 0;
                record[`Attribute ${i} global`] = 1;
            });
        }

        return record;
    });

    return stringify(records, {
        header: true
    });
}
