/* eslint-disable prettier/prettier */
import { useEffect, useState, useRef, useCallback, useMemo, Dispatch, SetStateAction } from 'react';
import {
    useIAP,
    acknowledgePurchaseAndroid,
    Product,
    PurchaseError,
    finishTransaction
} from 'react-native-iap';
import { Platform } from 'react-native';
import { STORAGE_KEYS, store, getStore } from '../utils/asyncStorage';
import { useUtil, state } from '../store';
import { useSelector } from '@legendapp/state/react';

const { PURCHASED_STATUS } = STORAGE_KEYS;
const PRODUCT_SKU = 'irit_premium_upgrade';

// Custom hooks for specific concerns
const usePurchaseInitialization = () => {
    const { setPaymentStatus, setPurchaseStatus } = useUtil();
    const [isInitialized, setIsInitialized] = useState(false);

    const initializePurchaseStatus = useCallback(async () => {
        try {
            const storedStatus = await getStore(PURCHASED_STATUS);
            const hasPurchased = storedStatus === 1;

            setPaymentStatus(false);

            // Only update purchase status if we have a stored value
            if (hasPurchased) {
                setPurchaseStatus(true);
            }

            setIsInitialized(true);
        } catch (error) {
            console.error('Purchase initialization error:', error);
        }
    }, [setPaymentStatus, setPurchaseStatus]);

    return { isInitialized, initializePurchaseStatus };
};

const useProductManager = () => {
    const { connected, products, getProducts } = useIAP();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (connected) {
            // Delay is REQUIRED on iOS
            timeout = setTimeout(() => {
                console.log('Fetching IAP products...');
                getProducts({ skus: [PRODUCT_SKU] });
            }, 800);
        }

        return () => timeout && clearTimeout(timeout);
    }, [connected]);

    useEffect(() => {
        console.log('IAP products update:', products);
        if (products.length > 0) {
            setProduct(products[0]);
        }
    }, [products]);

    return { product };
};

interface PurchaseData {
    error: string | null;
    loading: boolean;
    status: boolean;
    restoring: boolean;
}

const usePurchaseProcessor = (
    setData: Dispatch<SetStateAction<PurchaseData>>,
    setPaymentStatus: (status: boolean) => void,
    setPurchaseStatus: (status: boolean) => void
) => {
    const { currentPurchase, finishTransaction } = useIAP();
    const processedRef = useRef<string | null>(null);


    const processPurchase = useCallback(async (purchase: any) => {
        if (!purchase?.transactionReceipt) return;

        // ✅ Prevent double processing
        if (processedRef.current === purchase.transactionId) {
            return;
        }

        processedRef.current = purchase.transactionId;

        try {
            // Platform-specific acknowledgement
            if (Platform.OS === 'android') {
                await acknowledgePurchaseAndroid({
                    token: purchase.purchaseToken,
                    developerPayload: purchase?.developerPayloadAndroid,
                });
            }

            // Store purchase status
            await store(PURCHASED_STATUS, 1);

            // Finish transaction
            await finishTransaction({
                purchase,
                isConsumable: false,
                developerPayloadAndroid: purchase?.developerPayloadAndroid,
            });

            // Update states
            setPurchaseStatus(true);
            setPaymentStatus(true);

            setData({
                status: true,
                error: null,
                loading: false,
                restoring: false,
            });

        } catch (error) {
            setData(prev => ({
                ...prev,
                error: (error as any).message || 'Purchase processing failed',
                loading: false,
            }));
        }
    }, [finishTransaction, setPaymentStatus, setPurchaseStatus]);

    // Process when currentPurchase changes
    useEffect(() => {
        if (currentPurchase) {
            processPurchase(currentPurchase);
        }
    }, [currentPurchase, processPurchase]);

    return { processPurchase };
};

const usePurchaseErrorHandler = (setData: Dispatch<SetStateAction<PurchaseData>>) => {
    const { currentPurchaseError } = useIAP();

    const handlePurchaseError = useCallback((error: PurchaseError | null) => {
        if (!error) return;

        let errorMessage = error.message || 'Unknown error';
        let purchaseStatus = false;

        switch (error.code) {
            case 'E_ALREADY_OWNED':
                purchaseStatus = true;
                errorMessage = 'You already own this product';
                break;
            case 'E_USER_CANCELLED':
                errorMessage = 'Purchase was cancelled';
                break;
            case 'E_NETWORK_ERROR':
                errorMessage = 'Network error. Please check your internet connection';
                break;
            case 'E_ITEM_UNAVAILABLE':
                errorMessage = 'This product is currently unavailable';
                break;
            case 'E_DEFERRED_PAYMENT':
                errorMessage = 'Purchase pending approval';
                break;
            default:
                errorMessage = `Purchase failed: ${errorMessage}`;
        }

        setData(prev => ({
            ...prev,
            status: purchaseStatus,
            error: errorMessage,
            loading: false,
        }));
    }, []);

    useEffect(() => {
        if (currentPurchaseError) {
            handlePurchaseError(currentPurchaseError);
        }
    }, [currentPurchaseError, handlePurchaseError]);

    return { handlePurchaseError };
};

const usePurchaseRestoration = (
    setData: Dispatch<SetStateAction<PurchaseData>>,
    setPurchaseStatus: (status: boolean) => void
) => {
    const { purchaseHistory, getPurchaseHistory } = useIAP();

    const restorePurchases = useCallback(async () => {
        setData(prev => ({ ...prev, restoring: true, error: null }));

        try {
            await getPurchaseHistory();
        } catch (error) {
            setData(prev => ({
                ...prev,
                error: 'Failed to restore purchases',
                restoring: false,
            }));
        }
    }, [getPurchaseHistory]);

    const checkPurchaseHistory = useCallback(async () => {
        if (!purchaseHistory || purchaseHistory.length === 0) return;

        const userPurchases = purchaseHistory.filter(
            (purchase: any) => purchase.productId === PRODUCT_SKU
        );

        if (userPurchases.length > 0) {
            try {
                await store(PURCHASED_STATUS, 1);
                setPurchaseStatus(true);

                setData(prev => ({
                    ...prev,
                    status: true,
                    restoring: false,
                }));

                for (const purchase of userPurchases) {
                    await finishTransaction({
                        purchase,
                        isConsumable: false,
                    });
                }
            } catch (error) {
                console.error('Failed to restore from history:', error);
            }
        }
    }, [purchaseHistory, setPurchaseStatus]);

    // Check history when it changes
    useEffect(() => {
        if (purchaseHistory) {
            checkPurchaseHistory();
        }
    }, [purchaseHistory, checkPurchaseHistory]);

    return { restorePurchases, checkPurchaseHistory };
};

// Main hook with separated concerns
const useInAppPurchase = () => {
    const { purchase_status, payment_status } = useSelector(() => state.get());
    const { setPaymentStatus, setPurchaseStatus } = useUtil();

    const [data, setData] = useState<PurchaseData>({
        error: null,
        loading: false,
        status: false,
        restoring: false,
    });

    const { connected, products, requestPurchase } = useIAP();

    // Initialize hooks for different concerns
    const { isInitialized, initializePurchaseStatus } = usePurchaseInitialization();
    const { product } = useProductManager();
    usePurchaseProcessor(setData, setPaymentStatus, setPurchaseStatus);
    usePurchaseErrorHandler(setData);
    const { restorePurchases } = usePurchaseRestoration(setData, setPurchaseStatus);

    // Main initialization effect
    useEffect(() => {
        if (!isInitialized) {
            initializePurchaseStatus();
        }
    }, [isInitialized, initializePurchaseStatus]);

    // Purchase handler
    const purchaseHandler = useCallback(async () => {
        if (!connected) {
            setData({
                status: false,
                error: 'Please check your internet connection',
                loading: false,
                restoring: false,
            });
            return;
        }

       // setData(prev => ({ ...prev, loading: true, error: null }));

        try {
            if (products && products.length > 0) {
                await requestPurchase({ sku: PRODUCT_SKU });
            } else {
                throw new Error('Product not available. Please try again.');
            }
        } catch (error) {
            setData(prev => ({
                ...prev,
                error: (error as any).message || 'Purchase failed',
                loading: false,
            }));
        }

        console.log('Attempting purchase', {
            connected,
            products,
            sku: PRODUCT_SKU,
        });

    }, [connected, products, requestPurchase]);

    // Derived state using useMemo
    const isLoading = useMemo(() => data.loading || data.restoring, [data]);
    const isActive = useMemo(() => data.status || purchase_status, [data.status, purchase_status]);

    return {
        ...data,
        isLoading,
        isActive,
        purchaseHandler,
        restorePurchases,
        purchase_status,
        payment_status,
        product,
    };
};

export { useInAppPurchase };