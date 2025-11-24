import { ProductStatus } from '../types';

interface ProductResultProps {
    result: any;
    downloadCSV: () => void;
    handleUpload: () => void;
    resetChat: () => void;
    uploading: boolean;
}

const statusLabels: Record<ProductStatus, string> = {
    publish: 'Publicado',
    draft: 'Borrador',
    pending: 'Pendiente',
    private: 'Privado',
};

export default function ProductResult({
    result,
    downloadCSV,
    handleUpload,
    resetChat,
    uploading,
}: ProductResultProps) {
    const productResult = result?.product;
    if (!productResult) return null;

    const normalizedTags = productResult?.tags ?? [];
    const normalizedCategories = productResult?.categories ?? [];
    const normalizedImages = productResult?.images ?? [];
    const statusLabel = productResult?.status ? statusLabels[productResult.status as ProductStatus] ?? productResult.status : null;
    const hasDimensions = Boolean(productResult?.dimensions && (productResult.dimensions.length || productResult.dimensions.width || productResult.dimensions.height));

    return (
        <div className="product-result">
            <div className="product-header">
                <svg className="icon-product" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3>Producto Generado</h3>
            </div>

            <div className="product-details">
                <div className="product-name">
                    <span className="label">Nombre</span>
                    <span className="value">{productResult.name}</span>
                </div>

                <div className="product-info-grid">
                    <div className="info-item">
                        <span className="label">Precio</span>
                        <div className="price">
                            <span className="value">{productResult.regular_price}</span>
                            <span className="currency">EUR</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <span className="label">Categorías</span>
                        <div className="categories">
                            {normalizedCategories.length > 0
                                ? normalizedCategories.map((cat: string, i: number) => (
                                    <span key={i} className="category-tag">{cat}</span>
                                ))
                                : <span className="value">Sin categorías</span>}
                        </div>
                    </div>

                    <div className="info-item">
                        <span className="label">Etiquetas</span>
                        <div className="categories">
                            {normalizedTags.length > 0
                                ? normalizedTags.map((tag: string, i: number) => (
                                    <span key={i} className="category-tag">{tag}</span>
                                ))
                                : <span className="value">Sin etiquetas</span>}
                        </div>
                    </div>

                    <div className="info-item">
                        <span className="label">Stock</span>
                        <span className="value">{productResult.stock_quantity ?? 'N/D'}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">SKU</span>
                        <span className="value">{productResult.sku || 'N/D'}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">Estado</span>
                        <span className="value">{statusLabel || 'N/D'}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">Tipo</span>
                        <span className="value">{productResult.type || 'simple'}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">Peso</span>
                        <span className="value">{productResult.weight || 'N/D'}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">Dimensiones</span>
                        <span className="value">
                            {hasDimensions
                                ? [
                                    productResult.dimensions?.length,
                                    productResult.dimensions?.width,
                                    productResult.dimensions?.height,
                                ]
                                    .filter((segment) => segment)
                                    .join(' x ')
                                : 'N/D'}
                        </span>
                    </div>
                </div>

                {productResult.attributes && productResult.attributes.length > 0 && (
                    <div className="info-item">
                        <span className="label">Atributos</span>
                        <div className="attributes">
                            {productResult.attributes.map((attr: any, i: number) => (
                                <div key={i} className="attribute-tag">
                                    <span className="attr-name">{attr.name}:</span>
                                    <span className="attr-value">{attr.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {normalizedImages.length > 0 && (
                    <div className="info-item">
                        <span className="label">Imágenes</span>
                        <div className="images-list">
                            {normalizedImages.map((img: string, index: number) => (
                                <a
                                    key={img}
                                    href={img}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="image-link"
                                >
                                    Imagen {index + 1}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="action-buttons">
                <button onClick={downloadCSV} className="btn btn-secondary">
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    <span>Descargar CSV</span>
                </button>

                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="btn btn-primary"
                >
                    {uploading ? (
                        <>
                            <svg className="btn-icon animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Subiendo...</span>
                        </>
                    ) : (
                        <>
                            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span>Subir a WooCommerce</span>
                        </>
                    )}
                </button>

                <button onClick={resetChat} className="btn btn-secondary">
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Nuevo Producto</span>
                </button>
            </div>
        </div>
    );
}
