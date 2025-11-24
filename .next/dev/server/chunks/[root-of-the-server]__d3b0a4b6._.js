module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/src/lib/woocommerce.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createProduct",
    ()=>createProduct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$woocommerce$2f$woocommerce$2d$rest$2d$api$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@woocommerce/woocommerce-rest-api/index.js [app-route] (ecmascript)");
;
const api = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$woocommerce$2f$woocommerce$2d$rest$2d$api$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
    url: process.env.WOOCOMMERCE_URL || "",
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || "",
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || "",
    version: "wc/v3"
});
/**
 * Helper to split a string (comma‑separated or hierarchical using '>') into an array of trimmed strings.
 */ const parseStringArray = (value)=>{
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === "string") {
        return value.split(",").flatMap((part)=>part.split(">")).map((s)=>s.trim()).filter((s)=>s.length > 0);
    }
    return [];
};
const toSlug = (input)=>{
    const normalized = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-+/g, "-");
    return normalized || input.trim().toLowerCase().replace(/\s+/g, "-");
};
const ensureTerms = async (endpoint, names)=>{
    const ids = [];
    const seen = new Set();
    for (const originalName of names){
        const name = originalName.trim();
        if (!name || seen.has(name.toLowerCase())) {
            continue;
        }
        seen.add(name.toLowerCase());
        const slug = toSlug(name);
        const findExisting = async ()=>{
            try {
                const { data } = await api.get(endpoint, {
                    per_page: 50,
                    search: name
                });
                const match = Array.isArray(data) ? data.find((item)=>item?.slug === slug || item?.name?.toLowerCase() === name.toLowerCase()) : undefined;
                if (match?.id) {
                    return Number(match.id);
                }
            } catch (error) {
                console.error(`WooCommerce API Error fetching ${endpoint}:`, error.response?.data || error.message);
            }
            return undefined;
        };
        let termId = await findExisting();
        if (!termId) {
            try {
                const { data } = await api.post(endpoint, {
                    name,
                    slug
                });
                if (data?.id) {
                    termId = Number(data.id);
                }
            } catch (error) {
                const responseData = error.response?.data;
                const maybeExistingId = responseData?.data?.resource_id;
                if (maybeExistingId) {
                    termId = Number(maybeExistingId);
                } else {
                    // term_exists error when slug already present but search didn't return; try fetching by slug explicitly
                    try {
                        const { data } = await api.get(endpoint, {
                            per_page: 50,
                            slug
                        });
                        if (Array.isArray(data) && data[0]?.id) {
                            termId = Number(data[0].id);
                        }
                    } catch (secondaryError) {
                        console.error(`WooCommerce API Error resolving existing ${endpoint}:`, secondaryError.response?.data || secondaryError.message);
                    }
                    if (!termId) {
                        console.error(`WooCommerce API Error creating ${endpoint}:`, responseData || error.message);
                    }
                }
            }
        }
        if (termId) {
            ids.push(termId);
        }
    }
    return ids;
};
/**
 * Validate that an image URL is reachable (HEAD request). Returns true if the request succeeds (status 2xx).
 */ const isImageReachable = async (url)=>{
    try {
        const response = await fetch(url, {
            method: "HEAD"
        });
        return response.ok;
    } catch  {
        return false;
    }
};
async function createProduct(product) {
    const categoriesArray = Array.from(new Set(parseStringArray(product.categories)));
    const tagsArray = Array.from(new Set(parseStringArray(product.tags)));
    const imagesRawArray = parseStringArray(product.images);
    const [categoryIds, tagIds] = await Promise.all([
        ensureTerms("products/categories", categoriesArray),
        ensureTerms("products/tags", tagsArray)
    ]);
    // Filter out unreachable images – keep only those that respond with OK.
    const reachableImages = await Promise.all(imagesRawArray.map(async (img)=>await isImageReachable(img) ? img : null));
    const imagesArray = reachableImages.filter((i)=>i !== null);
    const manageStock = typeof product.stock_quantity === "number";
    const hasDimensions = Boolean(product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height));
    const data = {
        name: product.name,
        type: product.type || "simple",
        status: product.status,
        sku: product.sku,
        regular_price: product.regular_price,
        sale_price: product.sale_price,
        description: product.description,
        short_description: product.short_description,
        categories: categoryIds.length ? categoryIds.map((id)=>({
                id
            })) : categoriesArray.map((cat)=>({
                name: cat
            })),
        tags: tagIds.length ? tagIds.map((id)=>({
                id
            })) : tagsArray.map((tag)=>({
                name: tag
            })),
        images: imagesArray.map((img)=>({
                src: img
            })),
        manage_stock: manageStock,
        stock_quantity: manageStock ? product.stock_quantity : undefined,
        weight: product.weight,
        dimensions: hasDimensions ? {
            length: product.dimensions?.length,
            width: product.dimensions?.width,
            height: product.dimensions?.height
        } : undefined,
        attributes: product.attributes?.map((attr)=>({
                name: attr.name,
                options: [
                    attr.value
                ],
                visible: attr.visible,
                variation: attr.variation
            }))
    };
    try {
        const response = await api.post("products", data);
        return response.data;
    } catch (error) {
        console.error("WooCommerce API Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create product in WooCommerce");
    }
}
}),
"[project]/src/app/api/upload/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$woocommerce$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/woocommerce.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { product, images } = body;
        if (!product) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Product data is required'
            }, {
                status: 400
            });
        }
        // Merge images if provided
        const fullProduct = {
            ...product,
            images
        };
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$woocommerce$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createProduct"])(fullProduct);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            product: result
        });
    } catch (error) {
        console.error('Upload API Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal Server Error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d3b0a4b6._.js.map