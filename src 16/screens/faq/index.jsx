/* eslint-disable prettier/prettier */
import React, { useState, useMemo } from 'react'
import { ScrollView } from 'react-native'
import { StyledPage, StyledTextInput, Stack, Collapse } from 'fluent-styles'
import Text from '../../components/text'
import SideBarAdapter from '../../components/tablet/sideBar/sideBarAdapter'
import RenderHeader from '../../components/tablet/header'
import { StyledIcon } from '../../components/package/icon'
import { useAppTheme } from '../../theme'
import { useNavigation } from '@react-navigation/native'
import { FAQ_SECTIONS } from '../../data/faq'

// ──────────────────────────────────────────────────────────────────────────────
// FAQ Item Card
// ──────────────────────────────────────────────────────────────────────────────
const FAQItem = ({ item, t }) => {
  return (
    <Collapse
      variant="card"
      size="md"
      title={item.q}
      defaultCollapse={false}
      colors={{
        background: t.bgCard,
        border: t.borderDefault,
        titleColor: t.textPrimary,
        iconColor: t.brandPrimary,
      }}>
      <Text
        variant="body"
        color={t.textSecondary}
        marginBottom={6}
        marginTop={4}>
        {item.a}
      </Text>
    </Collapse>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// Main FAQ Screen Component
// ──────────────────────────────────────────────────────────────────────────────
const FAQScreen = () => {
  const navigation = useNavigation()
  const { t } = useAppTheme()
  const [searchText, setSearchText] = useState('')

  // Filter sections and items based on search
  const filteredSections = useMemo(() => {
    if (!searchText.trim()) return FAQ_SECTIONS

    const lowerSearch = searchText.toLowerCase()
    return FAQ_SECTIONS.map(section => ({
      ...section,
      items: section.items.filter(
        item =>
          item.q.toLowerCase().includes(lowerSearch) ||
          item.a.toLowerCase().includes(lowerSearch)
      ),
    })).filter(section => section.items.length > 0)
  }, [searchText])

  // Empty state when search returns no results
  const hasResults = filteredSections.length > 0 && 
    filteredSections.some(s => s.items.length > 0)

  return (
    <StyledPage backgroundColor={t.bgPage} flex={1}>
      {/* Header */}
      <StyledPage.Header.Full>
        <RenderHeader
          showBackButton
          showLogo={false}
          showTitle
          title="FAQ"
        />
      </StyledPage.Header.Full>

      {/* Main Content */}
      <Stack flex={1} horizontal>
        {/* Sidebar */}
        <SideBarAdapter selectedMenu={8} showMenu={false} collapse />

        {/* Content Area */}
        <Stack
          flex={3}
          vertical
          paddingHorizontal={16}
          paddingVertical={12}
          gap={0}>
          {/* Search Input */}
          <StyledTextInput
            variant="outline"
            placeholder="Search help..."
            value={searchText}
            onChangeText={setSearchText}
            clearable
            leftIcon={<StyledIcon name="magnify" size={18} color={t.textMuted} />}
            marginBottom={16}
          />

          {/* FAQ Sections with ScrollView */}
          {hasResults ? (
            <ScrollView 
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 24 }}>
              <Stack
                vertical
                gap={20}>
                {filteredSections.map(section => (
                  <Stack key={section.id} vertical gap={12}>
                    {/* Section Title */}
                    <Text
                      variant="title"
                      color={t.textPrimary}
                      marginLeft={4}
                      marginBottom={4}>
                      {section.title}
                    </Text>

                    {/* FAQ Items as Accordions */}
                    <Stack vertical gap={10}>
                      {section.items.map((item, idx) => (
                        <FAQItem key={`${section.id}-${idx}`} item={item} t={t} />
                      ))}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </ScrollView>
          ) : (
            /* Empty State */
            <Stack
              flex={1}
              alignItems="center"
              justifyContent="center"
              gap={12}>
              <StyledIcon name="help-circle-outline" size={48} color={t.textMuted} />
              <Text variant="subtitle" color={t.textMuted} textAlign="center">
                No results found
              </Text>
              <Text
                variant="body"
                color={t.textMuted}
                textAlign="center">
                Try different keywords
              </Text>
            </Stack>
          )}
        </Stack>
      </Stack>
    </StyledPage>
  )
}

export default FAQScreen
