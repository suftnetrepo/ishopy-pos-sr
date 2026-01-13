import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import {
    Box,
    Text,
    VStack,
    HStack,
    Pressable,
    SafeAreaView,
} from '@gluestack-ui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../utils/theme';
import { clearSeedData, seedData  } from '../model/seed';
import { store } from '../utils/asyncStorage';


export default function WelcomeScreen({ onChange }) {
    const [state, setState] = useState({
        mode: 'retail',
    });

    const handleGetStarted = async () => {
        await clearSeedData();
        seedData(state.mode).then(() => {
            store('hasOnboarded', 'true');
            onChange(true)
        });
    };

    const FeatureCard = ({ icon, title, value, description, isActive = false, setState }) => (
        <Pressable onPress={() => setState(prev => ({ ...prev, mode: value }))}>
            <Box
                bg="$card"
                borderWidth={1}
                borderColor={isActive ? "$primary500" : theme.colors.gray[300]}
                rounded="$2xl"
                p="$6"
                minWidth={280}
                maxWidth={360}
            >
                <Box
                    w={64}
                    h={64}
                    rounded="$xl"
                    bg="$primary100"
                    alignItems="center"
                    justifyContent="center"
                    mb="$4"
                >
                    <Icon name={icon} size={32} color="#3b82f6" />
                </Box>

                <Text fontSize="$xl" fontWeight="$semibold" mb="$2">
                    {title}
                </Text>

                <Text fontSize="$md" color="$mutedForeground" lineHeight="$lg">
                    {description}
                </Text>
            </Box>
        </Pressable>
    );

    const features = [
        {
            icon: 'storefront-outline',
            title: 'Retail',
            value: 'retail',
            description: 'Perfect for shops, boutiques, and retail stores',
        },
        {
            icon: 'silverware-fork-knife',
            title: 'Restaurant',
            value: 'restaurant',
            description: 'Optimized for cafes, restaurants, and food service',
        },

    ];

    return (
        <SafeAreaView flex={1} bg="$background">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 48,
                    paddingBottom: 48,
                    alignItems: 'center',
                }}
            >

                <VStack alignItems="center" mt="$1" mb="$12">
                    <Box
                        w={112}
                        h={112}
                        rounded="$3xl"
                        bg="$primary"
                        alignItems="center"
                        justifyContent="center"
                        mb="$3"
                    >
                        <Icon name="storefront" size={70} color={theme.colors.gray[800]} />
                    </Box>

                    <Text fontSize="$5xl" fontWeight="$bold" textAlign="center" mb="$4">
                        Welcome to iShopy
                    </Text>

                    <Text
                        fontSize="$xl"
                        color="$mutedForeground"
                        textAlign="center"
                        maxWidth={640}
                        lineHeight="$xl"
                    >
                        Your all-in-one point-of-sale solution for restaurants and retail
                        businesses
                    </Text>
                </VStack>

                <Box width="100%" maxWidth={1024} mb="$6">
                    <HStack flexWrap="wrap" justifyContent="center" gap="$6">
                        {features.map((f, i) => (
                            <FeatureCard
                                isActive={state.mode === f.value}
                                key={i}
                                icon={f.icon}
                                title={f.title}
                                value={f.value}
                                description={f.description}
                                setState={setState}
                            />
                        ))}
                    </HStack>
                </Box>

                <HStack justifyContent='flex-start' alignItems="center" mt="$1" >

                    <Text
                        fontSize={theme.fontSize.normal}
                        color={theme.colors.gray[700]}
                        textAlign="center"
                        lineHeight="$xl"
                    >
                        Start with sample pre-loaded products, categories and
                        transactions to explore all features immediately.
                    </Text>

                </HStack>
                <HStack alignItems="center" mb="$5">
                    <Text ml="$2" fontSize="$sm" color={theme.colors.gray[600]}>
                        Perfect for first-time users and testing
                    </Text>
                </HStack>
                <Pressable onPress={handleGetStarted} width="100%" maxWidth={420}>
                    <Box
                        rounded="$xl"
                        px="$6"
                        py="$4"
                        bg="$primary"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        elevation={6}
                        backgroundColor={theme.colors.violet[600]}
                    >
                        <Text
                            color={theme.colors.gray[100]}
                            fontSize="$2xl"
                            fontWeight="$bold"
                            mr="$3"
                        >
                            Get Started
                        </Text>
                        <Icon name="arrow-right" size={26} color="#fff" />
                    </Box>
                </Pressable>

                {/* Footer */}
                <Text
                    textAlign="center"
                    color="$mutedForeground"
                    mt="$8"
                    fontSize="$md"
                    maxWidth={560}
                >
                    Designed for tablets • Works offline • Cloud sync available
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
