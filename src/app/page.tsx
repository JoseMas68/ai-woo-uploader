'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import ChatInterface from '../components/ChatInterface';
import ProductResult from '../components/ProductResult';
import SettingsModal from '../components/settings/SettingsModal';
import SettingsOnboarding from '../components/settings/SettingsOnboarding';
import { ConversationStep, ProductData } from '../types';
import {
    splitInputList,
    parseStockQuantity,
    mapStatusAnswer,
    parseShippingDetails,
    parseAttributesInput,
    normalizeProductResult
} from '../lib/helpers';

const stepSequence: ConversationStep[] = [
    'name',
    'price',
    'shortDescription',
    'longDescription',
    'category',
    'tags',
    'images',
    'stock',
    'sku',
    'status',
    'productType',
    'shipping',
    'attributes',
    'complete',
];

const questions: Record<Exclude<ConversationStep, 'complete'>, string> = {
    name: '¿Cuál es el título del producto?',
    price: '¿Cuál es el precio?',
    shortDescription: 'Dame una descripción corta.',
    longDescription: 'Ahora una descripción más completa.',
    category: '¿En qué categoría lo metemos?',
    tags: '¿Quieres añadir etiquetas?',
    images: '¿Qué imágenes quieres usar? (URL o generar con IA)',
    stock: '¿Cuánto stock tiene?',
    sku: '¿Cuál es el SKU?',
    status: '¿Publicamos el producto o lo dejamos como borrador?',
    productType: '¿Qué tipo de producto es? (simple por defecto)',
    shipping: 'Dame detalles de envío: peso y dimensiones',
    attributes: '¿Tiene atributos como color, talla o material?',
};

const initialProductData: ProductData = {
    name: '',
    price: '',
    shortDescription: '',
    longDescription: '',
    category: '',
    tags: '',
    images: '',
    stock: '',
    sku: '',
    status: '',
    productType: '',
    shippingDetails: '',
    attributes: '',
};

const initialMessage = 'Voy a ayudarte a crear un producto nuevo. Empecemos por lo básico. ¿Cuál es el título del producto?';

export default function Home() {
    const { user, isLoading, logout } = useAuth();
    const { settings } = useSettings();
    const router = useRouter();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [skipConfig, setSkipConfig] = useState(false);

    // Determine if WooCommerce settings are complete
    const settingsComplete = !!(settings?.woo?.storeUrl && settings?.woo?.consumerKey && settings?.woo?.consumerSecret);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    const [input, setInput] = useState('');
    const [currentStep, setCurrentStep] = useState<ConversationStep>('name');
    const [currentMessage, setCurrentMessage] = useState(initialMessage);
    const [productData, setProductData] = useState<ProductData>(initialProductData);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState('');

    const getNextStep = (current: ConversationStep): ConversationStep => {
        const index = stepSequence.indexOf(current);
        return stepSequence[index + 1] || 'complete';
    };

    const proceedToStep = async (nextStep: ConversationStep, dataSnapshot: ProductData) => {
        if (nextStep === 'complete') {
            setCurrentMessage('¡Perfecto! Estoy generando tu producto con toda la información...');
            setLoading(true);
            await generateProduct(dataSnapshot);
        } else {
            setCurrentStep(nextStep);
            setCurrentMessage(questions[nextStep]);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        const userMessage = input.trim();
        if (!userMessage) return;
        setInput('');

        const newProductData = { ...productData };
        switch (currentStep) {
            case 'name':
                newProductData.name = userMessage;
                break;
            case 'price':
                newProductData.price = userMessage;
                break;
            case 'shortDescription':
                newProductData.shortDescription = userMessage;
                break;
            case 'longDescription':
                newProductData.longDescription = userMessage;
                break;
            case 'category':
                newProductData.category = userMessage;
                break;
            case 'tags':
                newProductData.tags = userMessage;
                break;
            case 'images':
                newProductData.images = userMessage;
                break;
            case 'stock':
                newProductData.stock = userMessage;
                break;
            case 'sku':
                newProductData.sku = userMessage;
                break;
            case 'status':
                newProductData.status = userMessage;
                break;
            case 'productType':
                newProductData.productType = userMessage;
                break;
            case 'shipping':
                newProductData.shippingDetails = userMessage;
                break;
            case 'attributes':
                newProductData.attributes = userMessage;
                break;
        }
        setProductData(newProductData);

        const nextStep = getNextStep(currentStep);
        await proceedToStep(nextStep, newProductData);
    };

    const handleSkip = async () => {
        if (loading || currentStep === 'complete') return;
        const nextStep = getNextStep(currentStep);
        setInput('');
        await proceedToStep(nextStep, productData);
    };

    const generateProduct = async (data: ProductData) => {
        setError('');
        setResult(null);
        setUploadSuccess('');

        try {
            const categoriesList = splitInputList(data.category, { allowHierarchy: true });
            const tagsList = splitInputList(data.tags);
            let imagesList = splitInputList(data.images);
            const stockQuantity = parseStockQuantity(data.stock);
            const normalizedStatus = mapStatusAnswer(data.status);
            const normalizedType = data.productType.trim().toLowerCase() || 'simple';
            const shipping = parseShippingDetails(data.shippingDetails);
            const attributesList = parseAttributesInput(data.attributes);
            const wantsAiImages = data.images.toLowerCase().includes('generar');

            if (wantsAiImages) {
                imagesList = [];
            }

            const promptLines = [
                `Título sugerido: ${data.name || 'N/D'}`,
                `Precio indicado: ${data.price || 'N/D'}`,
                `Descripción corta: ${data.shortDescription || 'N/D'}`,
                `Descripción completa: ${data.longDescription || 'N/D'}`,
                `Categorías propuestas: ${categoriesList.length ? categoriesList.join(' | ') : data.category || 'N/D'}`,
                `Etiquetas sugeridas: ${tagsList.length ? tagsList.join(', ') : data.tags || 'N/D'}`,
                `Imágenes proporcionadas: ${wantsAiImages ? 'El usuario prefiere generarlas con IA.' : imagesList.length ? imagesList.join(', ') : data.images || 'N/D'}`,
                `Stock indicado: ${data.stock || 'N/D'}`,
                `SKU indicado: ${data.sku || 'N/D'}`,
                `Estado deseado: ${normalizedStatus || data.status || 'N/D'}`,
                `Tipo de producto: ${data.productType || 'simple'}`,
                `Detalles de envío: ${data.shippingDetails || 'N/D'}`,
                `Atributos sugeridos: ${data.attributes || 'N/D'}`,
            ];

            const prompt = promptLines.join('\n');

            const overridesPayload: Record<string, unknown> = {};

            if (data.name.trim()) overridesPayload.name = data.name.trim();
            if (data.shortDescription.trim()) overridesPayload.short_description = data.shortDescription.trim();
            if (data.longDescription.trim()) overridesPayload.description = data.longDescription.trim();
            if (data.price.trim()) overridesPayload.regular_price = data.price.trim();
            if (categoriesList.length) overridesPayload.categories = categoriesList;
            if (tagsList.length) overridesPayload.tags = tagsList;
            if (imagesList.length) overridesPayload.images = imagesList;
            if (typeof stockQuantity === 'number') overridesPayload.stock_quantity = stockQuantity;
            if (data.sku.trim()) overridesPayload.sku = data.sku.trim();
            if (normalizedStatus) overridesPayload.status = normalizedStatus;
            if (normalizedType) overridesPayload.type = normalizedType;
            if (shipping.weight) overridesPayload.weight = shipping.weight;
            if (shipping.dimensions) overridesPayload.dimensions = shipping.dimensions;
            if (attributesList.length) overridesPayload.attributes = attributesList;

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: prompt,
                    overrides: overridesPayload,
                    aiSettings: settings?.ai
                }),
            });

            if (!response.ok) throw new Error('Failed to generate product');

            const resultData = await response.json();
            const normalizedResult = normalizeProductResult(resultData);

            setResult(normalizedResult);
            setCurrentMessage(`✅ ¡Producto generado exitosamente! "${normalizedResult.product.name}" está listo.`);
            setCurrentStep('complete');
        } catch (err) {
            setError('Ocurrió un error al generar el producto. Por favor, inténtalo de nuevo.');
            setCurrentMessage('❌ Lo siento, hubo un error al generar el producto. Recarga la página para intentarlo de nuevo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        if (!result?.csv) return;
        const blob = new Blob([result.csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products.csv';
        a.click();
    };

    const handleUpload = async () => {
        if (!result?.product) return;
        if (!settings?.woo?.storeUrl || !settings?.woo?.consumerKey || !settings?.woo?.consumerSecret) {
            setError('Por favor configura tus credenciales de WooCommerce en Settings antes de subir el producto.');
            return;
        }
        setUploading(true);
        setUploadSuccess('');
        setError('');

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: result.product, wooSettings: settings.woo }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload product');
            }

            setUploadSuccess('¡Producto subido a WooCommerce con éxito!');
        } catch (err: any) {
            setError(err.message || 'Error al subir el producto');
        } finally {
            setUploading(false);
        }
    };

    const resetChat = () => {
        setCurrentMessage(initialMessage);
        setCurrentStep('name');
        setProductData(initialProductData);
        setResult(null);
        setError('');
        setUploadSuccess('');
        setInput('');
    };

    if (isLoading || !user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    // If WooCommerce settings are incomplete and the user hasn't chosen to skip, show onboarding flow
    if (!settingsComplete && !skipConfig) {
        return (
            <SettingsOnboarding onClose={() => setSkipConfig(true)} />
        );
    }

    return (
        <main className="chat-container">
            <div className="chat-wrapper">
                <Header />
                {/* User Controls */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#718096' }}>
                        Welcome, <strong style={{ color: '#2d3748' }}>{user.name}</strong>
                    </span>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                    </button>
                    <button
                        onClick={logout}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 0.875rem', fontSize: '0.875rem', color: '#e53e3e' }}
                    >
                        Logout
                    </button>
                </div>

                <div className="chat-content">
                    <ChatInterface
                        loading={loading}
                        currentMessage={currentMessage}
                        currentStep={currentStep}
                        input={input}
                        setInput={setInput}
                        handleSendMessage={handleSendMessage}
                        handleSkip={handleSkip}
                        error={error}
                        uploadSuccess={uploadSuccess}
                    />

                    {result && currentStep === 'complete' && (
                        <ProductResult
                            result={result}
                            downloadCSV={downloadCSV}
                            handleUpload={handleUpload}
                            resetChat={resetChat}
                            uploading={uploading}
                        />
                    )}
                </div>
            </div>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </main>
    );
}
