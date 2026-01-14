import React, { useState } from 'react';
import { ScrollView, Image } from 'react-native';
import {
    Box,
    Text,
    VStack,
    HStack,
    Pressable,
} from '@gluestack-ui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../utils/theme';

export default function HelpScreen({onClose}) {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleFAQ = (index) =>
    setExpandedFAQ(expandedFAQ === index ? null : index);

  const faqs = [
    {
      question: 'How do I switch between Restaurant and Retail modes?',
      answer:
        'To switch modes, open the Settings menu and navigate to Shop Settings. You\'ll find the mode toggle switch at the bottom of the form. Select either "Restaurant" mode for food service businesses or "Shop" mode for retail stores. The app will restart with your selected mode.',
    },
    {
      question: 'How do I switch between Restaurant and Retail modes?',
      answer:
        'To switch modes, open the Settings menu and navigate to Shop Settings. You\'ll find the mode toggle switch at the bottom of the form. Select either "Restaurant" mode for food service businesses or "Shop" mode for retail stores. The app will restart with your selected mode.',
    },
  ];

  const guides = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'book-open-page-variant',
      description: 'Learn the basics of setting up your POS',
      topics: [],
    },
    {
      id: 'products',
      title: 'Product Management',
      icon: 'package-variant-closed',
      description: 'Manage products and inventory',
      topics: [],
    },
    {
      id: 'sales',
      title: 'Sales & Checkout',
      icon: 'cart-outline',
      description: 'Process sales quickly',
      topics: [],
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: 'chart-line',
      description: 'Track performance',
      topics: [],
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'cog-outline',
      description: 'Configure your system',
      topics: [],
    },
  ];

  return (
     <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingTop:20, backgroundColor: theme.colors.gray[50] }}>
        {/* Header */}
        <HStack px="$6" py="$4" alignItems="center">
          <Pressable
            w={40}
            h={40}
            rounded="$full"
            bg="$muted"
            alignItems="center"
            justifyContent="center"
            onPress={() => onClose()}
          >
            <Icon name="arrow-left" size={20} />
          </Pressable>

          <VStack ml="$4">
            <Text fontSize="$2xl" fontWeight="$bold">
              Help Center
            </Text>
            <Text fontSize="$sm" color="$mutedForeground">
              Get support and learn more
            </Text>
          </VStack>
        </HStack>

        {/* Hero */}
        <VStack px="$6" py="$6" alignItems="center">
          <Box rounded="$3xl" overflow="hidden" mb="$6" width="100%">
            <Image
              source={{
                uri:
                  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
              }}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
          </Box>

          <Text fontSize="$xl" mb="$2">
            How can we help you today?
          </Text>
          <Text color="$mutedForeground" textAlign="center">
            Browse guides, FAQs, or contact support
          </Text>
        </VStack>

        {/* User Guides */}
        <Box px="$6" mb="$8">
          <Text fontSize="$lg" fontWeight="$semibold" mb="$4">
            User Guides
          </Text>

          <VStack space="md">
            {guides.map(guide => (
              <Box
                key={guide.id}
                bg="$card"
                rounded="$2xl"
                paddingHorizontal={16}
                paddingVertical={16}
                borderWidth={1}
                borderColor={theme.colors.gray[400]}
              >
                <HStack space="md" justifyContent="space-between"
                  alignItems="center">
                  <Box
                    w={48}
                    h={48}
                    rounded="$xl"
                    bg="$primary100"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon name={guide.icon} size={22} color="#3b82f6" />
                  </Box>
                  <VStack flex={1}>
                    <Text fontWeight="$semibold" mb="$1">
                      {guide.title}
                    </Text>
                    <Text fontSize="$sm" color={theme.colors.gray[500]} mb="$3">
                      {guide.description}
                    </Text>
                    
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* FAQ */}
        <Box px="$6" mb="$8">
          <Text fontSize="$lg" fontWeight="$semibold" mb="$4">
            Frequently Asked Questions
          </Text>

          <VStack space="md">
            {faqs.map((faq, index) => (
              <Box
                key={index}
                bg="$card"
                rounded="$2xl"
                borderWidth={1}
                borderColor={theme.colors.gray[300]}
                overflow="hidden"
              >
                <Pressable onPress={() => toggleFAQ(index)} p="$5">
                  <HStack justifyContent="space-between">
                    <Text flex={1} pr="$4">
                      {faq.question}
                    </Text>
                    <Icon
                      name={
                        expandedFAQ === index
                          ? 'chevron-up'
                          : 'chevron-down'
                      }
                      size={18}
                      color={expandedFAQ === index ? '#3b82f6' : '#6b7280'}
                    />
                  </HStack>
                </Pressable>

                {expandedFAQ === index && (
                  <Box
                    px="$5"
                    pb="$5"
                    pt="$3"
                    borderTopWidth={0.5}
                    borderColor={theme.colors.gray[300]}
                  >
                    <Text fontSize="$sm" color="$mutedForeground">
                      {faq.answer}
                    </Text>
                  </Box>
                )}
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Footer */}
        <VStack px="$6" alignItems="center">
          <Text fontSize="$xs" color="$mutedForeground">
            HybridPOS v1.0.0
          </Text>
          <Text fontSize="$xs" color="$mutedForeground">
            © 2024 All rights reserved
          </Text>
        </VStack>
      </ScrollView>
  );
}
