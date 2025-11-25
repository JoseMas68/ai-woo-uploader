import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { Product } from "./schema";
import { WooSettings } from "../types/user";

const getApi = (settings?: WooSettings) => {
    return new WooCommerceRestApi({
        url: settings?.storeUrl || process.env.WOOCOMMERCE_URL || "",
        consumerKey: settings?.consumerKey || process.env.WOOCOMMERCE_CONSUMER_KEY || "",
        consumerSecret: settings?.consumerSecret || process.env.WOOCOMMERCE_CONSUMER_SECRET || "",
        version: (settings?.apiVersion || "wc/v3") as any,
    });
};

/**
 * Helper to split a string (comma‑separated or hierarchical using '>') into an array of trimmed strings.
 */
const parseStringArray = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === "string") {
        return value
            .split(",")
            .flatMap((part) => part.split(">"))
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    }
    return [];
};

const toSlug = (input: string): string => {
    const normalized = input
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-+/g, "-");
    return normalized || input.trim().toLowerCase().replace(/\s+/g, "-");
};

const ensureTerms = async (api: any, endpoint: "products/categories" | "products/tags", names: string[]): Promise<number[]> => {
    const ids: number[] = [];
    const seen = new Set<string>();

    for (const originalName of names) {
        const name = originalName.trim();
        if (!name || seen.has(name.toLowerCase())) {
            continue;
        }
        seen.add(name.toLowerCase());

        const slug = toSlug(name);

        const findExisting = async () => {
            try {
                const { data } = await api.get(endpoint, { per_page: 50, search: name });
                const match = Array.isArray(data)
                    ? data.find((item: any) => item?.slug === slug || item?.name?.toLowerCase() === name.toLowerCase())
                    : undefined;
                if (match?.id) {
                    return Number(match.id);
                }
            } catch (error) {
                console.error(`WooCommerce API Error fetching ${endpoint}:`, (error as any).response?.data || (error as Error).message);
            }
            return undefined;
        };

        let termId = await findExisting();

        if (!termId) {
            try {
                const { data } = await api.post(endpoint, { name, slug });
                if (data?.id) {
                    termId = Number(data.id);
                }
            } catch (error: any) {
                const responseData = error.response?.data;
                const maybeExistingId = responseData?.data?.resource_id;
                if (maybeExistingId) {
                    termId = Number(maybeExistingId);
                } else {
                    // term_exists error when slug already present but search didn't return; try fetching by slug explicitly
                    try {
                        const { data } = await api.get(endpoint, { per_page: 50, slug });
                        if (Array.isArray(data) && data[0]?.id) {
                            termId = Number(data[0].id);
                        }
                    } catch (secondaryError) {
                        console.error(`WooCommerce API Error resolving existing ${endpoint}:`, (secondaryError as any).response?.data || (secondaryError as Error).message);
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
 */
const isImageReachable = async (url: string): Promise<boolean> => {
    try {
        const response = await fetch(url, { method: "HEAD" });
        return response.ok;
    } catch {
        return false;
    }
};

export async function createProduct(product: Product, settings?: WooSettings) {
    const api = getApi(settings);

    const categoriesArray = Array.from(new Set(parseStringArray(product.categories)));
    const tagsArray = Array.from(new Set(parseStringArray(product.tags)));
    const imagesRawArray = parseStringArray(product.images);

    const [categoryIds, tagIds] = await Promise.all([
        ensureTerms(api, "products/categories", categoriesArray),
        ensureTerms(api, "products/tags", tagsArray),
    ]);

    // Filter out unreachable images – keep only those that respond with OK.
    const reachableImages = await Promise.all(
        imagesRawArray.map(async (img) => (await isImageReachable(img) ? img : null))
    );
    const imagesArray = reachableImages.filter((i): i is string => i !== null);

    const manageStock = typeof product.stock_quantity === "number";
    const hasDimensions = Boolean(
        product.dimensions &&
        (product.dimensions.length || product.dimensions.width || product.dimensions.height)
    );

    const data = {
        name: product.name,
        type: product.type || "simple",
        status: product.status,
        sku: product.sku,
        regular_price: product.regular_price,
        sale_price: product.sale_price,
        description: product.description,
        short_description: product.short_description,
        categories: categoryIds.length
            ? categoryIds.map((id) => ({ id }))
            : categoriesArray.map((cat) => ({ name: cat })),
        tags: tagIds.length
            ? tagIds.map((id) => ({ id }))
            : tagsArray.map((tag) => ({ name: tag })),
        images: imagesArray.map((img) => ({ src: img })),
        manage_stock: manageStock,
        stock_quantity: manageStock ? product.stock_quantity : undefined,
        weight: product.weight,
        dimensions: hasDimensions
            ? {
                length: product.dimensions?.length,
                width: product.dimensions?.width,
                height: product.dimensions?.height,
            }
            : undefined,
        attributes: product.attributes?.map((attr) => ({
            name: attr.name,
            options: [attr.value],
            visible: attr.visible,
            variation: attr.variation,
        })),
    };

    try {
        const response = await api.post("products", data);
        return response.data;
    } catch (error: any) {
        console.error("WooCommerce API Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create product in WooCommerce");
    }
}
