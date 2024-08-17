/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */

import { useEffect, useState } from 'react';
import { requestPurchase, useIAP } from 'react-native-iap';
import { STORAGE_KEYS, store, getStore } from '../utils/asyncStorage';
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
            setPaymentStatus(false)
            if (!purchase_status) {                          
                await getPurchaseHistory()
            }        
         
            setData({
                status: false,
                error: null,
                loading: false,
            });

            setPurchaseStatus(false)
        }
        init()
    }, [])

    useEffect(() => {
        const processPurchase = async () => {   
             
            if (currentPurchase?.transactionReceipt) {               
                try {
                   
                    setPurchaseStatus(true)
                    setPaymentStatus(true)
                    await store(PURCHASED_STATUS, 1)    

                    await finishTransaction({ purchase: currentPurchase, isConsumable: false, developerPayloadAndroid: currentPurchase?.developerPayloadAndroid });
                             
                    setData({
                        status: true,
                        error: null,
                        loading: false,
                    });
                  
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
            const purchases = purchaseHistory?.filter((product) => product.productId === "irit_premium_upgrade")            
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
            await getProducts({
                skus: ['irit_premium_upgrade'] })
            if (products?.length > 0) {
                await requestPurchase({
                    skus: ['irit_premium_upgrade'] });
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
