import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '../.env' });

const api = new WooCommerceRestApi({
    url: process.env.WOOCOMMERCE_URL || "",
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || "",
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || "",
    version: "wc/v3",
});

async function testConnection() {
    console.log("🔍 Testing WooCommerce API Connection...\n");

    console.log("Configuration:");
    console.log("- URL:", process.env.WOOCOMMERCE_URL);
    console.log("- Consumer Key:", process.env.WOOCOMMERCE_CONSUMER_KEY?.substring(0, 10) + "...");
    console.log("- Consumer Secret:", process.env.WOOCOMMERCE_CONSUMER_SECRET?.substring(0, 10) + "...\n");

    try {
        // Test 1: Get store information
        console.log("📡 Test 1: Fetching store system status...");
        const systemStatus = await api.get("system_status");
        console.log("✅ Connection successful!");
        console.log("Store Name:", systemStatus.data.settings?.general_settings?.title || "N/A");
        console.log("WooCommerce Version:", systemStatus.data.environment?.version || "N/A");
        console.log("");

        // Test 2: Get products count
        console.log("📦 Test 2: Fetching products...");
        const products = await api.get("products", { per_page: 5 });
        console.log(`✅ Found ${products.data.length} products (showing first 5)`);

        if (products.data.length > 0) {
            console.log("\nSample products:");
            products.data.forEach((product: any, index: number) => {
                console.log(`  ${index + 1}. ${product.name} - $${product.price}`);
            });
        } else {
            console.log("  (No products found in store)");
        }
        console.log("");

        // Test 3: Get categories
        console.log("🏷️  Test 3: Fetching product categories...");
        const categories = await api.get("products/categories", { per_page: 5 });
        console.log(`✅ Found ${categories.data.length} categories (showing first 5)`);

        if (categories.data.length > 0) {
            console.log("\nSample categories:");
            categories.data.forEach((cat: any, index: number) => {
                console.log(`  ${index + 1}. ${cat.name} (ID: ${cat.id})`);
            });
        }
        console.log("");

        console.log("🎉 All tests passed! WooCommerce API is working correctly.");

    } catch (error: any) {
        console.error("❌ Connection failed!");
        console.error("\nError details:");
        console.error("Message:", error.message);

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        }

        console.error("\n💡 Troubleshooting tips:");
        console.error("1. Verify the WooCommerce URL is correct and accessible");
        console.error("2. Check that the Consumer Key and Secret are valid");
        console.error("3. Ensure the WooCommerce REST API is enabled in your store");
        console.error("4. Verify that your hosting allows API connections");

        process.exit(1);
    }
}

testConnection();
