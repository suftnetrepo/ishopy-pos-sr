/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */

import { useEffect, useState } from 'react';
import { requestPurchase, useIAP } from 'react-native-iap';
import { STORAGE_KEYS, store, getStore } from '../utils/asyncStorage';import { clearSeedData } from '../model/seed';
import { useUtil, state } from '../store';
import { useSelector } from '@legendapp/state/react';

const { PURCHASED_STATUS } = STORAGE_KEYS;

const useInAppPurchase = () => { 
    const { setPaymentStatus, setPurchaseStatus } = useUtil()
    const { purchase_status, payment_status } = useSelector(()=> state.get())
    const [data, setData] = useState({
        error: null,
        loading: false,
        status: false
    })

    const {
        connected,
        products,
        getProducts,
        finishTransaction,
        currentPurchase,
        currentPurchaseError,
        purchaseHistory,
        getPurchaseHistory
    } = useIAP();

    useEffect(() => {
        async function init() {
            const status = await getStore(PURCHASED_STATUS)
            const purchase_status = status === 0 || status === null ? false : true

            if (!purchase_status) {                          
                await getPurchaseHistory()
            }        
         
            setData({
                status: purchase_status,
                error: null,
                loading: false,
            });

            setPurchaseStatus(purchase_status)
        }
        init()
    }, [])

    useEffect(() => {
        const processPurchase = async () => {
            if (currentPurchase?.transactionReceipt) {               
                try {
                    await finishTransaction(currentPurchase);
                    store(PURCHASED_STATUS, 1)
                 
                    setPurchaseStatus(true)
                    setPaymentStatus(true)
                    setData({
                        status: true,
                        error: null,
                        loading: false,
                    });

                    await clearSeedData()
                } catch (error) {
                    setData({
                        status: false,
                        error,
                        loading: false,
                    });
                }
            }
        };

        processPurchase();
    }, [currentPurchase])

    useEffect(() => {
        setData({
            status: currentPurchaseError?.code === "E_ALREADY_OWNED" ? true : false,
            error: currentPurchaseError,
            loading: false,
        });
    }, [currentPurchaseError]);

    useEffect(() => {       
        async function load() {           
            const purchases = purchaseHistory?.filter((product) => product.productId === "ishopy_sa_premium_upgrade")            
            if (purchases.length > 0 ) {
                await store(PURCHASED_STATUS, 1)  
                setPurchaseStatus(true)               
            } 
        }
        !data.status && load()          
    }, [purchaseHistory, data]);

    const purchaseHandler = async () => {
        if (!connected) {
            setData({
                status: false,
                error: 'Please check your internet connection',
                loading: false,
            });
            return;
        }

        try {
            await getProducts({ skus: ['ishopy_sa_premium_upgrade'] })
            if (products?.length > 0) {
                await requestPurchase({ skus: ['ishopy_sa_premium_upgrade'] });
            }
        } catch (error) {
            setData({
                status: false,
                error,
                loading: false,
            });
        }
    };

    return {
        ...data,
        purchaseHandler,
        purchase_status,
        payment_status
    };
};

export { useInAppPurchase };
