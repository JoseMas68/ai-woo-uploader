require('dotenv').config({ path: '../.env' });
require('ts-node').register({ transpileOnly: true });
const { createProduct } = require('../src/lib/woocommerce');

// Minimal product object based on CSV first row
const product = {
    name: 'Scalextric 1',
    short_description: 'Short description',
    description: 'Long description of the product',
    regular_price: '25',
    sale_price: '',
    stock_quantity: 1,
    categories: 'Scalextric > Pistas y Circuitos Scalextric, Scalextric',
    images: 'https://dodgerblue-beaver-670149.hostingersite.com/wp-content/uploads/2025/11/grand-challenge.webp',
    attributes: [],
};

(async () => {
    try {
        const result = await createProduct(product);
        console.log('Product created successfully:', result);
    } catch (error) {
        console.error('Error creating product:', error);
    }
})();
