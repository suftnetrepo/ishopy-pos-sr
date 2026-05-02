/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {ScrollView, Image} from 'react-native';
import {StyledSpacer, StyledButton, StyledPressable, Stack} from 'fluent-styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../../utils/theme';
import {Text} from '../text';
import {usePin} from '../../hooks/useUser';
import {ShowToast} from '../../components/toast';
import {useAppTheme} from '../../theme';

export default function HelpScreen({onClose}) {
  const {recoveryHandler} = usePin();
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const {t} = useAppTheme();

  const toggleFAQ = index => setExpandedFAQ(expandedFAQ === index ? null : index);

  const faqs = [
    {
      question: 'How do I switch between Restaurant and Retail modes?',
      answer: 'Open Settings → Shop. The mode selector is at the top of the form. Choose Restaurant for food service or Shop for retail.',
      options: [],
      isReset: false,
    },
    {
      question: 'How do I reset my pin?',
      answer: 'To reset your PIN:',
      options: [
        'Click the "Reset" button below — creates a default user with PIN 1234.',
        'Log in using PIN 1234.',
        'Navigate to Settings → Users.',
        'Create a new user with a secure PIN.',
        'Delete the "Default" user.',
      ],
      isReset: true,
    },
  ];

  const guides = [
    {id: 'getting-started', title: 'Getting Started',     icon: 'book-open-page-variant',  description: 'Learn the basics of setting up your POS'},
    {id: 'products',        title: 'Product Management',  icon: 'package-variant-closed',  description: 'Manage products and inventory'},
    {id: 'sales',           title: 'Sales & Checkout',    icon: 'cart-outline',            description: 'Process sales quickly'},
    {id: 'reports',         title: 'Reports & Analytics', icon: 'chart-line',              description: 'Track performance'},
    {id: 'settings',        title: 'Settings',            icon: 'cog-outline',             description: 'Configure your system'},
  ];

  const handleReset = () => {
    recoveryHandler().then(() => {
      ShowToast('Success', 'Pin has been reset to default user with PIN 1234');
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40, paddingTop: 20, backgroundColor: t.bgPage}}>

      {/* Header */}
      <Stack horizontal paddingHorizontal={24} paddingVertical={16} alignItems="center">
        <StyledPressable
          width={40} height={40} borderRadius={20}
          backgroundColor={t.bgPage}
          alignItems="center" justifyContent="center"
          onPress={() => onClose()}>
          <Icon name="arrow-left" size={20} color={t.textPrimary} />
        </StyledPressable>
        <Stack vertical marginLeft={16}>
          <Text variant="hero">
            Help Center
          </Text>
          <Text variant="caption" color={t.textSecondary}>
            Get support and learn more
          </Text>
        </Stack>
      </Stack>

      {/* Hero image */}
      <Stack paddingHorizontal={24} paddingVertical={8} alignItems="center">
        <Stack borderRadius={24} overflow="hidden" marginBottom={24} width="100%">
          <Image
            source={{uri: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b'}}
            style={{width: '100%', height: 200}}
            resizeMode="cover"
          />
        </Stack>
        <Text variant="title" marginBottom={8}>
          How can we help you today?
        </Text>
        <Text variant="caption" color={t.textSecondary} textAlign="center">
          Browse our guides or search for specific topics
        </Text>
      </Stack>

      {/* Quick guides */}
      <Stack paddingHorizontal={24} marginBottom={16} vertical>
        <Text variant="title" marginBottom={12}>
          Quick Guides
        </Text>
        {guides.map(g => (
          <Stack
            key={g.id}
            horizontal alignItems="center" gap={12}
            backgroundColor={t.bgCard}
            borderRadius={12} padding={16} marginBottom={8}
            borderWidth={0.5} borderColor={t.borderDefault}>
            <Stack
              width={40} height={40} borderRadius={20}
              backgroundColor={t.brandPrimaryBg}
              alignItems="center" justifyContent="center">
              <Icon name={g.icon} size={20} color={t.brandPrimaryDark} />
            </Stack>
            <Stack vertical flex={1}>
              <Text variant="label">
                {g.title}
              </Text>
              <Text variant="caption" color={t.textSecondary}>
                {g.description}
              </Text>
            </Stack>
            <Icon name="chevron-right" size={20} color={t.textMuted} />
          </Stack>
        ))}
      </Stack>

      {/* FAQs */}
      <Stack paddingHorizontal={24} marginBottom={16} vertical>
        <Text variant="title" marginBottom={12}>
          Frequently Asked Questions
        </Text>
        {faqs.map((faq, index) => (
          <Stack
            key={index}
            backgroundColor={t.bgCard}
            borderRadius={12} marginBottom={8}
            borderWidth={0.5} borderColor={t.borderDefault}
            overflow="hidden">
            <StyledPressable
              horizontal justifyContent="space-between" alignItems="center"
              paddingHorizontal={20} paddingVertical={16}
              onPress={() => toggleFAQ(index)}>
              <Text
                flex={1}
                variant="label"
                color={t.textPrimary}>
                {faq.question}
              </Text>
              <Icon
                name={expandedFAQ === index ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={expandedFAQ === index ? theme.colors.blue[500] : t.textSecondary}
              />
            </StyledPressable>
            {expandedFAQ === index && (
              <Stack
                paddingHorizontal={20} paddingBottom={20} paddingTop={12}
                borderTopWidth={0.5} borderColor={t.borderDefault} vertical>
                <Text variant="body" color={t.textSecondary}>
                  {faq.answer}
                </Text>
                <StyledSpacer marginVertical={4} />
                {faq.options.map((opt, i) => (
                  <Text key={i} variant="body" color={t.textSecondary}>
                    • {opt}
                  </Text>
                ))}
                {faq.isReset && (
                  <>
                    <StyledSpacer marginVertical={8} />
                    <StyledButton backgroundColor={t.borderDefault} onPress={handleReset}>
                      <Text
                        variant="button"
                        paddingHorizontal={8} paddingVertical={4}
                        color={t.textPrimary}>
                        Reset
                      </Text>
                    </StyledButton>
                  </>
                )}
              </Stack>
            )}
          </Stack>
        ))}
      </Stack>

      {/* Support */}
      <Stack paddingHorizontal={24} marginBottom={32}>
        <Stack
          backgroundColor={t.brandPrimaryBg}
          borderRadius={24} padding={24}
          borderWidth={1} borderColor={theme.colors.amber[200]} vertical>
          <Text variant="title" marginBottom={8}>
            Still need help?
          </Text>
          <Text variant="body" color={t.textSecondary} marginBottom={24}>
            Our support team is here to assist you.
          </Text>
          <StyledPressable
            horizontal
            backgroundColor={t.bgCard}
            borderRadius={12} padding={16}
            alignItems="center" justifyContent="center" gap={8}
            borderWidth={1} borderColor={t.borderDefault}>
            <Icon name="email-outline" size={20} color={t.textPrimary} />
            <Text variant="label" color={t.textPrimary}>
              support@kursa.app
            </Text>
          </StyledPressable>
        </Stack>
      </Stack>

      {/* Footer */}
      <Stack paddingHorizontal={24} alignItems="center" vertical>
        <Text variant="caption" color={t.textMuted}>
          Kursa v1.0.0
        </Text>
        <Text variant="caption" color={t.textMuted}>
          © 2025 All rights reserved
        </Text>
      </Stack>
    </ScrollView>
  );
}
