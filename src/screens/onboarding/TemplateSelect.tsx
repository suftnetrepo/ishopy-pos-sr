/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Stack, StyledPressable, StyledCard, StyledScrollView, theme,
} from 'fluent-styles';
import Text from '../../components/text';
import { restaurantTemplates } from '../../data/seeds/restaurant';
import { retailTemplates } from '../../data/seeds/retail';
import {useAppTheme} from '../../theme';

interface Props {
  mode: string;
  selected: string;
  onSelect: (id: string) => void;
}

const TemplateSelect: React.FC<Props> = ({ mode, selected, onSelect }) => {
  const {t} = useAppTheme();
  const templates = mode === 'restaurant' ? restaurantTemplates : retailTemplates;

  return (
    <Stack gap={16} flex={1}>
      <Stack gap={4} marginBottom={8}>
        <Text variant="title" color={t.textPrimary}>
          Choose your template
        </Text>
        <Text variant="body" color={t.textSecondary}>
          Pre-loaded with real menu items and categories. You can edit everything after.
        </Text>
      </Stack>

      <StyledScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 14, paddingBottom: 16 }}>
        {templates.map(template => {
          const active = selected === template.id;
          const bgColor = active ? `${t.brandPrimary}12` : t.bgCard;
          return (
            <StyledPressable key={template.id} onPress={() => onSelect(template.id)}>
              <StyledCard
                padding={20}
                borderRadius={16}
                backgroundColor={bgColor}
                borderWidth={2}
                borderColor={active ? t.brandPrimary : t.borderDefault}
                shadow="light">
                <Stack horizontal alignItems="center" gap={16}>
                  {/* Emoji badge */}
                  <Stack
                    width={56}
                    height={56}
                    borderRadius={16}
                    backgroundColor={active ? t.brandPrimary : t.bgInput}
                    alignItems="center"
                    justifyContent="center">
                    <Text variant="header" fontSize={28}>
                      {template.emoji}
                    </Text>
                  </Stack>

                  <Stack flex={1}>
                    {/* Title */}
                    <Text
                      variant="subtitle"
                      color={t.textPrimary}
                      fontWeight="600"
                      marginBottom={4}>
                      {template.label}
                    </Text>
                    
                    {/* Description */}
                    <Text
                      variant="body"
                      color={t.textSecondary}
                      marginBottom={8}
                      numberOfLines={2}>
                      {template.description}
                    </Text>
                    
                    {/* Item count chips */}
                    <Stack horizontal gap={8}>
                      <Stack
                        paddingHorizontal={11}
                        paddingVertical={5}
                        borderRadius={999}
                        backgroundColor={active ? `${t.brandPrimary}15` : `${t.textMuted}12`}>
                        <Text
                          variant="caption"
                          color={t.textSecondary}
                          fontWeight="500">
                          {template.categories.length} categories
                        </Text>
                      </Stack>
                      <Stack
                        paddingHorizontal={11}
                        paddingVertical={5}
                        borderRadius={999}
                        backgroundColor={active ? `${t.brandPrimary}15` : `${t.textMuted}12`}>
                        <Text
                          variant="caption"
                          color={t.textSecondary}
                          fontWeight="500">
                          {template.items.length} items
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Selection Radio */}
                  <Stack
                    width={24}
                    height={24}
                    borderRadius={12}
                    borderWidth={2}
                    borderColor={active ? t.brandPrimary : t.textMuted}
                    backgroundColor={active ? t.brandPrimary : 'transparent'}
                    alignItems="center"
                    justifyContent="center">
                    {active && (
                      <Stack
                        width={10}
                        height={10}
                        borderRadius={5}
                        backgroundColor="#ffffff"
                      />
                    )}
                  </Stack>
                </Stack>
              </StyledCard>
            </StyledPressable>
          );
        })}
      </StyledScrollView>
    </Stack>
  );
};

export default TemplateSelect;
