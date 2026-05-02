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
        contentContainerStyle={{ gap: 10, paddingBottom: 16 }}>
        {templates.map(t => {
          const active = selected === t.id;
          return (
            <StyledPressable key={t.id} onPress={() => onSelect(t.id)}>
              <StyledCard
                padding={16} borderRadius={14}
                backgroundColor={active ? theme.colors.violet[50] : theme.colors.white}
                borderWidth={2}
                borderColor={active ? theme.colors.violet[500] : t.borderDefault}
                shadow={active ? 'light' : undefined}>
                <Stack horizontal alignItems="center" gap={14}>
                  {/* Emoji badge */}
                  <Stack width={48} height={48} borderRadius={14}
                    backgroundColor={active ? theme.colors.violet[100] : t.bgPage}
                    alignItems="center" justifyContent="center">
                    <Text variant="header">{t.emoji}</Text>
                  </Stack>

                  <Stack flex={1}>
                    <Text variant="label" color={t.textPrimary}>
                      {t.label}
                    </Text>
                    <Text variant="body" color={t.textSecondary}
                      marginTop={2}>
                      {t.description}
                    </Text>
                    {/* Item count pill */}
                    <Stack horizontal gap={8} marginTop={6}>
                      <Stack paddingHorizontal={8} paddingVertical={3} borderRadius={99}
                        backgroundColor={active ? theme.colors.violet[100] : t.bgPage}>
                        <Text variant="caption" color={active ? theme.colors.violet[700] : t.textSecondary}>
                          {t.categories.length} categories
                        </Text>
                      </Stack>
                      <Stack paddingHorizontal={8} paddingVertical={3} borderRadius={99}
                        backgroundColor={active ? theme.colors.violet[100] : t.bgPage}>
                        <Text variant="caption" color={active ? theme.colors.violet[700] : t.textSecondary}>
                          {t.items.length} items
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Radio dot */}
                  <Stack width={22} height={22} borderRadius={11}
                    borderWidth={2}
                    borderColor={active ? theme.colors.violet[500] : t.textMuted}
                    backgroundColor={active ? theme.colors.violet[500] : 'transparent'}
                    alignItems="center" justifyContent="center">
                    {active && (
                      <Stack width={8} height={8} borderRadius={4}
                        backgroundColor={theme.colors.white} />
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
