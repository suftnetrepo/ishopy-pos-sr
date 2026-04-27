/* eslint-disable prettier/prettier */
import React, {useMemo, useState} from 'react';
import {useWindowDimensions, ScrollView} from 'react-native';
import {
  YStack, XStack, StyledText, StyledPressable, CollapseGroup, CollapseItem,
} from 'fluent-styles';
import {fontStyles, theme} from '../../../../utils/theme';
import {useAppContext} from '../../../../hooks/appContext';
import {formatCurrency} from '../../../../utils/help';
import {StyledMIcon} from '../../../../components/icon';

export default function AddOn({table_id, onClose, item, setItem}) {
  const {shop, addItem} = useAppContext();
  const {height, width} = useWindowDimensions();
  const [validationError, setValidationError] = useState('');

  // ── Split addOns into two buckets by group_id ────────────────
  const {requiredAddOns, optionalAddOns} = useMemo(() => {
    const all = item?.addOns ?? [];
    return {
      requiredAddOns: all.filter(a => a.group_id === 'required'),
      optionalAddOns: all.filter(a => a.group_id === 'optional'),
    };
  }, [item?.addOns]);

  const hasRequired           = requiredAddOns.length > 0;
  const hasOptional           = optionalAddOns.length > 0;
  const anyRequiredSelected   = requiredAddOns.some(a => qty(a) > 0);
  const selectedOptionalCount = optionalAddOns.filter(a => qty(a) > 0).length;

  // ── Helpers ──────────────────────────────────────────────────
  function qty(addOn) {
    return parseInt(String(addOn.quantity ?? 0), 10);
  }

  const patchAddOns = fn =>
    setItem(prev => ({...prev, addOns: prev?.addOns?.map(fn) ?? []}));

  // Required = single-select radio: selecting one clears the rest
  const toggleRequired = addOn => {
    setValidationError('');
    patchAddOns(a =>
      a.group_id === 'required'
        ? {...a, quantity: a.addOn_id === addOn.addOn_id ? 1 : 0}
        : a,
    );
  };

  // Optional = multi-select with qty stepper
  const increaseOptional = addOn => {
    setValidationError('');
    patchAddOns(a => a.addOn_id === addOn.addOn_id ? {...a, quantity: qty(a) + 1} : a);
  };

  const decreaseOptional = addOn => {
    setValidationError('');
    patchAddOns(a => a.addOn_id === addOn.addOn_id ? {...a, quantity: Math.max(0, qty(a) - 1)} : a);
  };

  // ── Pricing ──────────────────────────────────────────────────
  const calculateTotal = () => {
    const sum = (item?.addOns ?? []).reduce(
      (t, a) => t + parseFloat(String(a.price ?? 0)) * qty(a), 0,
    );
    return sum + Number(item?.price ?? 0);
  };

  // ── Validation & submit ───────────────────────────────────────
  const onSubmit = () => {
    if (hasRequired && !anyRequiredSelected) {
      setValidationError('Please select a required option');
      return;
    }
    const index = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
    const selectedAddOns = (item?.addOns ?? [])
      .filter(a => qty(a) > 0)
      .map(a => ({
        addOnName:   a.addOnName,
        quantity:    qty(a),
        price:       a.price,
        groupName:   a.group_id,
        displayName: a.addOnName,
      }));
    addItem(index, item.menu_id, item.name, item.price, 1, table_id, selectedAddOns).then(() => {});
    onClose();
  };

  // ── Derived UI state ─────────────────────────────────────────
  const addButtonDisabled = hasRequired && !anyRequiredSelected;
  const cur               = shop?.currency || '£';
  const addButtonText     = addButtonDisabled
    ? 'Select a required option'
    : `Add ${formatCurrency(cur, calculateTotal())}`;
  const modalWidth        = width > 768 ? 660 : Math.round(width * 0.92);
  const modalMaxHeight    = Math.min(height * 0.82, 740);

  // ── Row renderers ─────────────────────────────────────────────

  const renderRequiredRow = option => {
    const isSelected = qty(option) > 0;
    return (
      <StyledPressable
        key={option.addOn_id}
        onPress={() => toggleRequired(option)}
        flexDirection="row"
        alignItems="center"
        paddingHorizontal={16}
        paddingVertical={14}
        minHeight={56}
        borderBottomWidth={1}
        borderBottomColor={theme.colors.gray[100]}
        backgroundColor={isSelected ? theme.colors.blue[50] : theme.colors.gray[1]}
        borderLeftWidth={4}
        borderLeftColor={isSelected ? theme.colors.blue[500] : 'transparent'}>

        {/* Radio dot */}
        <YStack
          width={22} height={22} borderRadius={11}
          borderWidth={2}
          borderColor={isSelected ? theme.colors.blue[500] : theme.colors.gray[300]}
          backgroundColor={isSelected ? theme.colors.blue[500] : 'transparent'}
          alignItems="center" justifyContent="center"
          marginRight={14}>
          {isSelected && (
            <YStack width={8} height={8} borderRadius={4} backgroundColor={theme.colors.gray[1]} />
          )}
        </YStack>

        <YStack flex={1}>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.normal}
            fontWeight={isSelected ? theme.fontWeight.semiBold : theme.fontWeight.normal}
            color={isSelected ? theme.colors.blue[700] : theme.colors.gray[800]}>
            {option.addOnName}
          </StyledText>
          {parseFloat(String(option.price)) > 0 && (
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontSize={theme.fontSize.small}
              color={theme.colors.gray[500]}
              marginTop={2}>
              +{formatCurrency(cur, option.price)}
            </StyledText>
          )}
        </YStack>

        {isSelected && (
          <StyledMIcon name="check-circle" size={22} color={theme.colors.blue[500]} />
        )}
      </StyledPressable>
    );
  };

  const renderOptionalRow = option => {
    const quantity   = qty(option);
    const isSelected = quantity > 0;

    return (
      <StyledPressable
        key={option.addOn_id}
        onPress={() => increaseOptional(option)}
        paddingHorizontal={16}
        paddingVertical={12}
        minHeight={64}
        borderBottomWidth={1}
        borderBottomColor={theme.colors.gray[100]}
        backgroundColor={isSelected ? theme.colors.green[50] : theme.colors.gray[1]}
        borderLeftWidth={4}
        borderLeftColor={isSelected ? theme.colors.green[500] : 'transparent'}
        flexDirection="row"
        alignItems="center">

        <YStack flex={1}>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.normal}
            fontWeight={isSelected ? theme.fontWeight.semiBold : theme.fontWeight.normal}
            color={isSelected ? theme.colors.green[800] : theme.colors.gray[800]}>
            {option.addOnName}
          </StyledText>
          {parseFloat(String(option.price ?? 0)) > 0 && (
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontSize={theme.fontSize.small}
              color={theme.colors.gray[500]}
              marginTop={2}>
              +{formatCurrency(cur, option.price)}
            </StyledText>
          )}
        </YStack>

        {isSelected ? (
          <XStack gap={8} alignItems="center">
            <YStack
              paddingHorizontal={12} paddingVertical={6}
              borderRadius={20}
              backgroundColor={theme.colors.green[100]}>
              <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                fontSize={theme.fontSize.small}
                fontWeight={theme.fontWeight.bold}
                color={theme.colors.green[700]}>
                ×{quantity}
              </StyledText>
            </YStack>

            <StyledPressable
              paddingHorizontal={14} paddingVertical={8}
              borderRadius={30}
              backgroundColor={theme.colors.red[50]}
              borderWidth={1} borderColor={theme.colors.red[200]}
              onPress={e => { e?.stopPropagation?.(); decreaseOptional(option); }}>
              <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                fontSize={theme.fontSize.small}
                color={theme.colors.red[600]}>
                Remove
              </StyledText>
            </StyledPressable>
          </XStack>
        ) : (
          <YStack
            paddingHorizontal={18} paddingVertical={8}
            borderRadius={30}
            backgroundColor={theme.colors.yellow[500]}>
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontSize={theme.fontSize.small}
              color={theme.colors.gray[1]}>
              + Add
            </StyledText>
          </YStack>
        )}
      </StyledPressable>
    );
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <YStack
      backgroundColor={theme.colors.transparent05}
      flex={1} justifyContent="center" alignItems="center">

      <YStack
        width={modalWidth}
        maxHeight={modalMaxHeight}
        backgroundColor={theme.colors.gray[1]}
        borderRadius={20}
        overflow="hidden"
        shadowColor="black"
        shadowOffset={{width: 0, height: 12}}
        shadowOpacity={0.22}
        shadowRadius={24}
        elevation={16}>

        {/* ── Header ───────────────────────────────────────────── */}
        <XStack
          paddingHorizontal={20} paddingVertical={16}
          borderBottomWidth={1} borderBottomColor={theme.colors.gray[200]}
          backgroundColor={theme.colors.gray[50]}
          alignItems="center">
          <YStack flex={1}>
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontSize={theme.fontSize.large}
              fontWeight={theme.fontWeight.bold}
              color={theme.colors.gray[900]}>
              {item.name}
            </StyledText>
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontSize={theme.fontSize.normal}
              color={theme.colors.gray[500]}
              marginTop={2}>
              Base price: {formatCurrency(cur, item.price)}
            </StyledText>
          </YStack>
          <StyledPressable
            width={36} height={36} borderRadius={18}
            backgroundColor={theme.colors.gray[200]}
            alignItems="center" justifyContent="center"
            onPress={onClose}>
            <StyledMIcon name="close" size={20} color={theme.colors.gray[600]} />
          </StyledPressable>
        </XStack>

        {/* ── CollapseGroup ─────────────────────────────────────── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          style={{maxHeight: modalMaxHeight - 152}}
          contentContainerStyle={{paddingHorizontal: 12, paddingVertical: 12, paddingBottom: 16}}>

          {hasRequired || hasOptional ? (
            <CollapseGroup
              variant="bordered"
              defaultActiveKey={hasRequired ? 'required' : 'optional'}
              style={{gap: 10}}>

              {hasRequired && (
                <CollapseItem
                  itemKey="required"
                  title="Required"
                  subtitle={anyRequiredSelected
                    ? requiredAddOns.find(a => qty(a) > 0)?.addOnName
                    : '⚠ Choose one'}
                  activeHeader
                  trailing={
                    !anyRequiredSelected ? (
                      <YStack
                        paddingHorizontal={8} paddingVertical={3}
                        borderRadius={6}
                        backgroundColor={theme.colors.orange[100]}>
                        <StyledText fontSize={10} fontWeight="700" color={theme.colors.orange[700]}>
                          Required
                        </StyledText>
                      </YStack>
                    ) : null
                  }>
                  {requiredAddOns.map(option => renderRequiredRow(option))}
                </CollapseItem>
              )}

              {hasOptional && (
                <CollapseItem
                  itemKey="optional"
                  title="Optional"
                  subtitle={selectedOptionalCount > 0 ? `${selectedOptionalCount} selected` : 'Tap to add'}
                  activeHeader>
                  {optionalAddOns.map(option => renderOptionalRow(option))}
                </CollapseItem>
              )}

            </CollapseGroup>
          ) : (
            <YStack padding={32} alignItems="center" gap={8}>
              <StyledMIcon name="info-outline" size={32} color={theme.colors.gray[300]} />
              <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                fontSize={theme.fontSize.normal}
                color={theme.colors.gray[400]}>
                No add-ons available
              </StyledText>
            </YStack>
          )}

          {validationError ? (
            <XStack
              marginTop={8} paddingHorizontal={14} paddingVertical={10}
              borderRadius={10}
              backgroundColor={theme.colors.red[50]}
              borderWidth={1} borderColor={theme.colors.red[200]}
              alignItems="center" gap={8}>
              <StyledMIcon name="error-outline" size={18} color={theme.colors.red[600]} />
              <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                fontSize={theme.fontSize.small}
                color={theme.colors.red[600]} flex={1}>
                {validationError}
              </StyledText>
            </XStack>
          ) : null}
        </ScrollView>

        {/* ── Footer ───────────────────────────────────────────── */}
        <XStack
          paddingHorizontal={16} paddingVertical={14}
          borderTopWidth={1} borderTopColor={theme.colors.gray[200]}
          backgroundColor={theme.colors.gray[50]}
          alignItems="center" gap={12}>

          <YStack>
            <StyledText
              fontSize={10} fontWeight="700"
              color={theme.colors.gray[400]}
              style={{letterSpacing: 0.8}}>
              TOTAL
            </StyledText>
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontSize={theme.fontSize.large}
              fontWeight={theme.fontWeight.bold}
              color={theme.colors.gray[900]}>
              {formatCurrency(cur, calculateTotal())}
            </StyledText>
          </YStack>

          <XStack flex={1} gap={10}>
            <StyledPressable
              flex={1} height={52} borderRadius={30}
              borderWidth={1} borderColor={theme.colors.gray[300]}
              backgroundColor={theme.colors.gray[100]}
              justifyContent="center" alignItems="center"
              onPress={onClose}>
              <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                fontSize={theme.fontSize.normal}
                fontWeight={theme.fontWeight.semiBold}
                color={theme.colors.gray[700]}>
                Cancel
              </StyledText>
            </StyledPressable>

            <StyledPressable
              flex={2} height={52} borderRadius={30}
              backgroundColor={addButtonDisabled ? theme.colors.gray[200] : theme.colors.green[500]}
              justifyContent="center" alignItems="center"
              flexDirection="row" gap={8}
              onPress={addButtonDisabled ? undefined : onSubmit}
              disabled={addButtonDisabled}>
              <StyledMIcon
                name="add-shopping-cart"
                size={20}
                color={addButtonDisabled ? theme.colors.gray[400] : theme.colors.gray[1]}
              />
              <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                fontSize={theme.fontSize.normal}
                fontWeight={theme.fontWeight.bold}
                color={addButtonDisabled ? theme.colors.gray[400] : theme.colors.gray[1]}>
                {addButtonText}
              </StyledText>
            </StyledPressable>
          </XStack>
        </XStack>

      </YStack>
    </YStack>
  );
}