import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, Platform, Alert } from 'react-native';
import { useInAppPurchase } from '../../hooks/useInAppPurchase';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
    Box,
    Text,
    VStack,
    HStack,
    Button,
    ButtonText,
    Pressable,
    Center,
    Badge,
    Spinner,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';


const PurchaseScreen = ({ navigation }) => {
    const {
        isLoading,
        isActive,
        error,
        product,
        purchase_status,
        payment_status,
        purchaseHandler,
        restorePurchases,
    } = useInAppPurchase();
    const nav = useNavigation();

    console.log({ isLoading, isActive, error, product, purchase_status, payment_status });

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => { });
        return unsubscribe;
    }, [navigation]);

    if (isLoading && !isActive) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Center flex={1}>
                    <Spinner size="large" />
                    <Text mt="$4">Processing purchase…</Text>
                </Center>
            </SafeAreaView>
        );
    }

    useEffect(() => {
        if (isActive) {
         // nav.goBack();
        }
    }, [isActive]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <VStack space="lg" pb="$10">

                    {/* Header */}
                    <HStack
                        px="$5"
                        py="$4"
                        alignItems="center"
                        justifyContent="space-between"
                        bg="$white"
                    >
                        <Pressable onPress={() => navigation.goBack()}>
                            <Icon name="arrow-back" size={24} />
                        </Pressable>

                        <Text fontSize="$lg" fontWeight="$bold">
                            Go Premium
                        </Text>

                        <Box w={24} />
                    </HStack>

                    {/* Hero */}
                    <Center mt="$8">
                        <Box
                            bg="$white"
                            w={100}
                            h={100}
                            borderRadius={50}
                            justifyContent="center"
                            alignItems="center"
                            shadowColor="$black"
                        >
                            <Icon name="star" size={60} color="#FFD700" />
                        </Box>

                        <Text mt="$5" fontSize="$2xl" fontWeight="$bold">
                            Unlock Premium Features
                        </Text>

                        <Text
                            mt="$2"
                            px="$6"
                            textAlign="center"
                            color="$coolGray500"
                        >
                            Get access to all premium content and features
                        </Text>
                    </Center>

                    {/* Features */}
                    <Box mx="$5" p="$6" bg="$white" borderRadius="$xl">
                        <Text mb="$4" fontSize="$lg" fontWeight="$semibold">
                            What You Get:
                        </Text>

                        {[
                            { icon: 'block', text: 'Ad-free experience', color: '#FF3B30' },
                            { icon: 'insights', text: 'Advanced analytics', color: '#5856D6' },
                            { icon: 'support-agent', text: 'Priority support', color: '#34C759' },
                            { icon: 'inventory', text: 'Unlimited projects', color: '#FF9500' },
                            { icon: 'palette', text: 'Custom themes', color: '#AF52DE' },
                            { icon: 'download', text: 'Export capabilities', color: '#007AFF' },
                        ].map((item, idx) => (
                            <HStack key={idx} space="md" alignItems="center" mb="$3">
                                <Center
                                    w={40}
                                    h={40}
                                    borderRadius={20}
                                    bg={`${item.color}20`}
                                >
                                    <Icon name={item.icon} size={20} color={item.color} />
                                </Center>
                                <Text flex={1}>{item.text}</Text>
                            </HStack>
                        ))}
                    </Box>

                    {/* Pricing */}
                    {product && !isActive && (
                        <Box
                            mx="$5"
                            p="$6"
                            borderWidth={2}
                            borderColor="$primary500"
                            borderRadius="$xl"
                            bg="$white"
                        >
                            <HStack justifyContent="space-between" alignItems="center">
                                <Text fontSize="$xl" fontWeight="$bold">
                                    Premium Plan
                                </Text>

                                <Badge bg="$red500">
                                    <Text color="$white" fontSize="$xs">
                                        POPULAR
                                    </Text>
                                </Badge>
                            </HStack>

                            <Text mt="$2" color="$coolGray500">
                                One-time payment, lifetime access
                            </Text>

                            <Center my="$6">
                                <Text fontSize="$4xl" fontWeight="$bold">
                                    {product.localizedPrice || '$0.00'}
                                </Text>
                                <Text fontSize="$xs" color="$coolGray500">
                                    + applicable taxes
                                </Text>
                            </Center>

                            <Button
                                onPress={purchaseHandler}
                                isDisabled={isLoading}
                                bg="$primary500"
                            >
                                <ButtonText>
                                    {isLoading ? 'Processing...' : 'Get Premium Now'}
                                </ButtonText>
                            </Button>

                            <Text
                                mt="$3"
                                fontSize="$xs"
                                textAlign="center"
                                color="$coolGray500"
                            >
                                🔒 Secure payment via {Platform.OS === 'ios' ? 'Apple' : 'Google'} Store
                            </Text>
                        </Box>
                    )}

                    {/* Success */}
                    {isActive && (
                        <Center mx="$5" p="$6" bg="$green50" borderRadius="$xl">
                            <Icon name="check-circle" size={50} color="#34C759" />

                            <Text mt="$4" fontSize="$xl" fontWeight="$bold">
                                Premium Activated!
                            </Text>

                            <Text mt="$2" textAlign="center" color="$coolGray500">
                                Thank you for your purchase. All premium features are now unlocked.
                            </Text>

                            <Button mt="$4" bg="$green600" onPress={() => navigation.navigate('Home')}>
                                <ButtonText>Continue to App</ButtonText>
                            </Button>
                        </Center>
                    )}

                    {/* Restore */}
                    {!isActive && (
                        <Center mx="$5">
                            <Text fontWeight="$semibold">Already purchased?</Text>
                            <Text mt="$1" textAlign="center" color="$coolGray500">
                                Restore your purchase on another device
                            </Text>

                            <Pressable onPress={restorePurchases}>
                                <HStack mt="$4" alignItems="center" space="sm">
                                    <Icon name="refresh" size={20} color="#007AFF" />
                                    <Text color="$primary500">Restore Purchases</Text>
                                </HStack>
                            </Pressable>
                        </Center>
                    )}

                    {/* Footer */}
                    <Center px="$6" mt="$8">
                        <Text fontSize="$xs" textAlign="center" color="$coolGray500">
                            By purchasing, you agree to our{' '}
                            <Text color="$primary500">Terms of Service</Text> and{' '}
                            <Text color="$primary500">Privacy Policy</Text>
                        </Text>

                        <Pressable
                            mt="$4"
                            onPress={() =>
                                Alert.alert('Support', 'Email: support@example.com')
                            }
                        >
                            <HStack alignItems="center" space="sm">
                                <Icon name="help-outline" size={20} color="#8E8E93" />
                                <Text color="$coolGray500">Need Help? Contact Support</Text>
                            </HStack>
                        </Pressable>
                    </Center>

                    {/* Debug */}
                    {__DEV__ && (
                        <Box mx="$5" p="$4" borderWidth={1} borderColor="$coolGray300">
                            <Text fontSize="$sm" fontWeight="$bold">
                                Debug Info
                            </Text>

                            <Text>Loading: {isLoading ? 'Yes' : 'No'}</Text>
                            <Text>Purchase Status: {purchase_status ? 'True' : 'False'}</Text>
                            <Text>Payment Status: {payment_status ? 'True' : 'False'}</Text>
                            <Text>Product Loaded: {product ? 'Yes' : 'No'}</Text>

                            {error && <Text color="$red500">Error: {error}</Text>}
                        </Box>
                    )}
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PurchaseScreen;
