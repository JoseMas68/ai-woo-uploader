import fs from 'fs';
import path from 'path';
import { parseProductDescription } from '../lib/llm';
import { generateCSV } from '../lib/csv';

async function main() {
    const description = process.argv[2];

    if (!description) {
        console.error("Please provide a product description as an argument.");
        console.error('Usage: npm run cli -- "Your product description here"');
        process.exit(1);
    }

    console.log("Analyzing product description...");
    const product = await parseProductDescription(description);

    if (!product) {
        console.error("Failed to parse product description.");
        process.exit(1);
    }

    console.log("Product parsed successfully:", product.name);

    const csvContent = generateCSV([product]);
    const outputPath = path.join(process.cwd(), 'products.csv');

    fs.writeFileSync(outputPath, csvContent);
    console.log(`CSV generated at: ${outputPath}`);
}

main();
