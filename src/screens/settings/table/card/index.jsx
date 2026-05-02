/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {FlatList, Animated} from 'react-native';
import {StyledSpacer, StyledPressable, Stack} from 'fluent-styles';
import Text from '../../../../components/text';
import {theme} from '../../../../configs/theme';
import {StyledIcon} from '../../../../components/package/icon';
import {toWordCase} from '../../../../utils/help';
import {useAppTheme} from '../../../../theme';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// ─── Location pill config with theme-aware tokens ────────────────
const getLocationStyle = (loc, t) => {
  const styles = {
    'Bar':      { bg: t.colors?.purple[50] || '#faf5ff',  color: t.colors?.purple[600] || '#9333ea' },
    'Takeaway': { bg: t.colors?.amber[50] || '#fffbeb',   color: t.colors?.amber[700] || '#b45309' },
    'Dine In':  { bg: t.bgInput, color: t.textSecondary },
  };
  return styles[loc] || styles['Dine In'];
};

// ─── Table card ───────────────────────────────────────────────────────────────
const TableCard = ({onTableChange, onTableDelete, data}) => {
  const {t} = useAppTheme();
  const RenderCard = ({item, t}) => {
    const isActive = item.status === 1;
    const location = item.location || 'Dine In';
    const locStyle = getLocationStyle(location, t);
    const [cardScale] = useState(new Animated.Value(1));
    const [deletePressed, setDeletePressed] = useState(false);

    const handleCardPressIn = () => {
      Animated.timing(cardScale, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };

    const handleCardPressOut = () => {
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={{
          flex: 1,
          transform: [{ scale: cardScale }],
        }}>
        <StyledPressable
          onPress={() => onTableChange({data: item, tag: 'Edit'})}
          onPressIn={handleCardPressIn}
          onPressOut={handleCardPressOut}
          style={{flex: 1}}
          activeOpacity={0.7}>
          <Stack
            flex={1}
            horizontal
            borderRadius={18}
            backgroundColor={t.bgCard}
            borderWidth={1}
            borderColor="rgba(255,255,255,0.05)"
            marginHorizontal={4}
            marginBottom={16}
            paddingHorizontal={20}
            paddingVertical={18}
            shadowColor={t.textPrimary}
            shadowOffset={{width: 0, height: 1}}
            shadowOpacity={0.06}
            shadowRadius={6}
            elevation={2}
            gap={12}>

            {/* Left Content: Title + Metadata */}
            <Stack flex={1} vertical gap={5}>
              {/* Title */}
              <Text
                variant="label"
                fontWeight="700"
                color={t.textPrimary}
                numberOfLines={1}
                letterSpacing={0.2}>
                {toWordCase(item.tableName)}
              </Text>

              {/* Metadata Row: Size • Status • Location (if not Dine In) */}
              <Stack horizontal alignItems="center" gap={10}>
                {/* Size */}
                <Text variant="bodySmall" color={t.textMuted} style={{opacity: 0.75}}>
                  Size {item.size}
                </Text>

                {/* Separator dot */}
                <Stack width={3} height={3} borderRadius={1.5} backgroundColor={t.borderSubtle} />

                {/* Status Badge */}
                <Stack
                  paddingHorizontal={8}
                  paddingVertical={3}
                  borderRadius={999}
                  backgroundColor={isActive ? `${t.successColor}14` : `${t.dangerColor}14`}
                  shadowColor={isActive ? t.successColor : t.dangerColor}
                  shadowOffset={{width: 0, height: 1}}
                  shadowOpacity={0.15}
                  shadowRadius={3}
                  elevation={1}>
                  <Text
                    variant="caption"
                    fontWeight="600"
                    color={isActive ? t.successColor : t.dangerColor}>
                    {isActive ? 'Active' : 'Inactive'}
                  </Text>
                </Stack>

                {/* Location Badge (if not Dine In) */}
                {location !== 'Dine In' && (
                  <>
                    <Stack width={3} height={3} borderRadius={1.5} backgroundColor={t.borderSubtle} />
                    <Stack
                      paddingHorizontal={8}
                      paddingVertical={3}
                      borderRadius={999}
                      backgroundColor={locStyle.bg}>
                      <Text variant="caption" fontWeight="600" color={locStyle.color}>
                        {location}
                      </Text>
                    </Stack>
                  </>
                )}
              </Stack>
            </Stack>

            {/* Right Content: Action Icons */}
            <Stack horizontal alignItems="flex-start" gap={8} paddingRight={4} marginTop={4}>
              {/* Edit Icon Button */}
              <StyledPressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  onTableChange({data: item, tag: 'Edit'});
                }}
                width={36}
                height={36}
                borderRadius={18}
                alignItems="center"
                justifyContent="center"
                backgroundColor="transparent"
                activeOpacity={0.6}>
                <MIcon
                  pointerEvents="none"
                  size={18}
                  name="pencil"
                  color={t.textMuted}
                />
              </StyledPressable>

              {/* Delete Icon Button */}
              <StyledPressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  onTableDelete(item?.table_id);
                }}
                onPressIn={() => setDeletePressed(true)}
                onPressOut={() => setDeletePressed(false)}
                width={36}
                height={36}
                borderRadius={18}
                alignItems="center"
                justifyContent="center"
                backgroundColor={deletePressed ? `${t.dangerColor}10` : "transparent"}
                activeOpacity={0.6}>
                <MIcon
                  pointerEvents="none"
                  size={18}
                  name="trash-can-outline"
                  color={deletePressed ? t.dangerColor : t.textMuted}
                />
              </StyledPressable>
            </Stack>
          </Stack>
        </StyledPressable>
      </Animated.View>
    );
  };

  return (
    <FlatList
      data={data}
      initialNumToRender={100}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.table_id}
      numColumns={3}
      columnWrapperStyle={{gap: 4}}
      renderItem={({item, index}) => <RenderCard item={item} key={index} 
                        t={t}/>}
    />
  );
};

export default TableCard;