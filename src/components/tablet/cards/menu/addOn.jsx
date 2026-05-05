/* eslint-disable prettier/prettier */
import React, {useMemo, useState} from 'react';
import {useWindowDimensions, ScrollView} from 'react-native';
import {
  YStack, XStack, StyledPressable, CollapseGroup, CollapseItem,
} from 'fluent-styles';
import {formatCurrency} from '../../../../utils/help';
import {StyledMIcon} from '../../../../components/icon';
import {useAppTheme} from '../../../../theme';
import {useAppContext} from '../../../../hooks/appContext';
import Text from '../../../../components/text';

export default function AddOn({table_id, onClose, item, setItem, mode = 'add', onSubmit}) {
  const {shop, addItem} = useAppContext();
  const {t} = useAppTheme();
  const {height, width} = useWindowDimensions();
  const [validationError, setValidationError] = useState('');
  
  // Initialize selections from item.addOns if in edit mode
  const initializeSelections = () => {
    if (mode === 'edit' && item?.addOns) {
      const initial = {};
      (item.addOns || []).forEach(addon => {
        initial[addon.addOn_id] = addon.quantity || 0;
      });
      return initial;
    }
    return {};
  };
  
  const [selections, setSelections] = useState(initializeSelections());

  // ── Split addOns into two buckets by group_id ────────────────
  const {requiredAddOns, optionalAddOns} = useMemo(() => {
    const all = (item?.addOns ?? []).map(a => ({
      ...a,
      quantity: selections[a.addOn_id] ?? 0,
    }));
    
    const required = all.filter(a => a.group_id === 'required');
    const optional = all.filter(a => a.group_id === 'optional' || a.group_id === null);
        
    return {
      requiredAddOns: required,
      optionalAddOns: optional,
    };
  }, [item?.addOns, selections]);

  const hasRequired           = requiredAddOns.length > 0;
  const hasOptional           = optionalAddOns.length > 0;
  const anyRequiredSelected   = requiredAddOns.some(a => qty(a) > 0);
  const selectedOptionalCount = optionalAddOns.filter(a => qty(a) > 0).length;

  // ── Helpers ──────────────────────────────────────────────────
  function qty(addOn) {
    return parseInt(String(selections[addOn.addOn_id] ?? 0), 10);
  }

  // Required = single-select radio: selecting one clears the rest
  const toggleRequired = addOn => {
    setValidationError('');
    setSelections(prev => {
      const isCurrentlySelected = prev[addOn.addOn_id] ? 1 : 0;
      const newSelections = { ...prev }; // Preserve optional selections
      
      // Clear all required selections
      requiredAddOns.forEach(a => {
        newSelections[a.addOn_id] = 0;
      });
      
      // Toggle the selected one
      newSelections[addOn.addOn_id] = isCurrentlySelected ? 0 : 1;
      
      return newSelections;
    });
  };

  // Optional = multi-select with qty stepper
  const increaseOptional = addOn => {
    setValidationError('');
    setSelections(prev => ({
      ...prev,
      [addOn.addOn_id]: (prev[addOn.addOn_id] ?? 0) + 1,
    }));
  };

  const decreaseOptional = addOn => {
    setValidationError('');
    setSelections(prev => ({
      ...prev,
      [addOn.addOn_id]: Math.max(0, (prev[addOn.addOn_id] ?? 0) - 1),
    }));
  };

  // ── Pricing ──────────────────────────────────────────────────
  const calculateTotal = () => {
    const sum = (item?.addOns ?? []).reduce(
      (t, a) => t + parseFloat(String(a.price ?? 0)) * (selections[a.addOn_id] ?? 0), 0,
    );
    return sum + Number(item?.price ?? 0);
  };

  // ── Validation & submit ───────────────────────────────────────
  const handleSubmit = () => {
    if (hasRequired && !anyRequiredSelected) {
      setValidationError('Please select a required option');
      return;
    }
    
    const selectedAddOns = (item?.addOns ?? [])
      .filter(a => selections[a.addOn_id] > 0)
      .map(a => ({
        addOnName:   a.addOnName,
        quantity:    selections[a.addOn_id] ?? 0,
        price:       a.price,
        groupName:   a.group_id || 'optional',
        displayName: a.addOnName,
        addOn_id:    a.addOn_id,
      }));
    
    if (mode === 'edit') {
      // In edit mode, call the onSubmit callback with updated item
      const updatedItem = {
        ...item,
        addOns: selectedAddOns,
      };
      onSubmit?.(updatedItem);
    } else {
      // In add mode, create new cart item
      const index = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
      addItem(index, item.menu_id, item.name, item.price, 1, table_id, selectedAddOns).then(() => {});
      onClose();
    }
  };

  // ── Derived UI state ─────────────────────────────────────────
  const addButtonDisabled = hasRequired && !anyRequiredSelected;
  const cur               = shop?.currency || '£';
  const isEditMode        = mode === 'edit';
  const addButtonText     = addButtonDisabled
    ? 'Select a required option'
    : isEditMode
    ? `Update ${formatCurrency(cur, calculateTotal())}`
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
        paddingVertical={12}
        minHeight={56}
        borderBottomWidth={1}
        borderBottomColor={`${t.borderDefault}60`}
        backgroundColor={isSelected ? `${t.brandPrimary}10` : t.bgCard}
        borderLeftWidth={3}
        borderLeftColor={isSelected ? t.brandPrimary : 'transparent'}>

        {/* Radio dot */}
        <YStack
          width={22} height={22} borderRadius={11}
          borderWidth={2}
          borderColor={isSelected ? t.brandPrimary : t.textMuted}
          backgroundColor={isSelected ? t.brandPrimary : 'transparent'}
          alignItems="center" justifyContent="center"
          marginRight={14}>
          {isSelected && (
            <YStack width={8} height={8} borderRadius={4} backgroundColor={t.bgCard} />
          )}
        </YStack>

        <YStack flex={1}>
          <Text
            variant="body"
            fontWeight={isSelected ? "600" : "400"}
            color={t.textPrimary}>
            {option.addOnName}
          </Text>
          {parseFloat(String(option.price)) > 0 && (
            <Text
              variant="bodySmall"
              color={t.textSecondary}
              marginTop={2}>
              +{formatCurrency(cur, option.price)}
            </Text>
          )}
        </YStack>

        {isSelected && (
          <StyledMIcon name="check-circle" size={22} color={t.brandPrimary} />
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
        borderBottomColor={`${t.borderDefault}60`}
        backgroundColor={isSelected ? `${t.brandPrimary}10` : t.bgCard}
        borderLeftWidth={3}
        borderLeftColor={isSelected ? t.brandPrimary : 'transparent'}
        flexDirection="row"
        alignItems="center">

        <YStack flex={1}>
          <Text
            variant="body"
            fontWeight={isSelected ? "600" : "400"}
            color={t.textPrimary}>
            {option.addOnName}
          </Text>
          {parseFloat(String(option.price ?? 0)) > 0 && (
            <Text
              variant="bodySmall"
              color={t.textSecondary}
              marginTop={2}>
              +{formatCurrency(cur, option.price)}
            </Text>
          )}
        </YStack>

        {isSelected ? (
          <XStack gap={8} alignItems="center">
            <YStack
              paddingHorizontal={10} height={28}
              borderRadius={999}
              backgroundColor={`${t.brandPrimary}18`}
              justifyContent="center" alignItems="center">
              <Text
                variant="bodySmall"
                fontWeight="700"
                color={t.brandPrimary}>
                ×{quantity}
              </Text>
            </YStack>

            <StyledPressable
              paddingHorizontal={14} height={32}
              borderRadius={999}
              backgroundColor={`${t.dangerColor}12`}
              justifyContent="center" alignItems="center"
              onPress={e => { e?.stopPropagation?.(); decreaseOptional(option); }}>
              <Text
                variant="caption"
                fontWeight="600"
                color={t.dangerColor}>
                Remove
              </Text>
            </StyledPressable>
          </XStack>
        ) : (
          <YStack
            paddingHorizontal={16} height={36}
            borderRadius={999}
            backgroundColor={t.brandPrimary}
            justifyContent="center" alignItems="center">
            <Text
              variant="bodySmall"
              fontWeight="600"
              color={t.textInverse}>
              + Add
            </Text>
          </YStack>
        )}
      </StyledPressable>
    );
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <YStack
      backgroundColor="rgba(0, 0, 0, 0.55)"
      flex={1} justifyContent="center" alignItems="center">

      <YStack
        width={modalWidth}
        maxHeight={modalMaxHeight}
        backgroundColor={t.bgCard}
        borderRadius={18}
        borderWidth={1}
        borderColor={t.borderDefault}
        overflow="hidden"
        shadowColor="black"
        shadowOffset={{width: 0, height: 12}}
        shadowOpacity={0.22}
        shadowRadius={24}
        elevation={16}>

        {/* ── Header ───────────────────────────────────────────── */}
        <XStack
          paddingHorizontal={20} paddingVertical={16}
          borderBottomWidth={1} borderBottomColor={t.borderDefault}
          backgroundColor={t.bgCard}
          alignItems="center">
          <YStack flex={1}>
            <Text
              variant="title"
              fontWeight="700"
              color={t.textPrimary}>
              {item.name}
            </Text>
            <Text
              variant="body"
              color={t.textSecondary}
              marginTop={2}>
              Base price: {formatCurrency(cur, item.price)}
            </Text>
          </YStack>
          <StyledPressable
            width={36} height={36} borderRadius={18}
            backgroundColor={t.bgInput}
            alignItems="center" justifyContent="center"
            onPress={onClose}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <StyledMIcon name="close" size={20} color={t.textSecondary} />
          </StyledPressable>
        </XStack>

        {/* ── CollapseGroup ─────────────────────────────────────── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          style={{maxHeight: modalMaxHeight - 152, backgroundColor: t.bgCard}}
          contentContainerStyle={{paddingHorizontal: 12, paddingVertical: 12, paddingBottom: 16, backgroundColor: t.bgCard}}>

          {hasRequired || hasOptional ? (
            <CollapseGroup
              variant="bordered"
              defaultActiveKey={hasRequired ? 'required' : 'optional'}
              style={{gap: 10}}
              colors={{
                background: t.bgCard,
                border: t.borderDefault,
                titleColor: t.textPrimary,
                subtitleColor: t.textSecondary,
                iconColor: t.textSecondary,
                activeHeaderBg: t.bgInput,
              }}>

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
                        backgroundColor={t.brandPrimary}>
                        <Text variant="caption" fontWeight="700" color={t.onBrandPrimary || t.bgCard}>
                          Required
                        </Text>
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
              <StyledMIcon name="info-outline" size={32} color={t.textMuted} />
              <Text
                variant="body"
                color={t.textMuted}>
                No add-ons available
              </Text>
            </YStack>
          )}

          {validationError ? (
            <XStack
              marginTop={8} paddingHorizontal={14} paddingVertical={10}
              borderRadius={10}
              backgroundColor={t.dangerBg}
              borderWidth={1} borderColor={t.dangerBg}
              alignItems="center" gap={8}>
              <StyledMIcon name="error-outline" size={18} color={t.dangerColor} />
              <Text
                variant="bodySmall"
                color={t.dangerColor} flex={1}>
                {validationError}
              </Text>
            </XStack>
          ) : null}
        </ScrollView>

        {/* ── Footer ───────────────────────────────────────────── */}
        <XStack
          paddingHorizontal={16} paddingVertical={14}
          borderTopWidth={1} borderTopColor={`${t.borderDefault}80`}
          backgroundColor={t.bgCard}
          alignItems="center" gap={12}>

          <YStack>
            <Text
              variant="caption"
              fontWeight="700"
              color={t.textMuted}
              style={{letterSpacing: 0.8}}>
              TOTAL
            </Text>
            <Text
              variant="title"
              fontWeight="700"
              color={t.textPrimary}>
              {formatCurrency(cur, calculateTotal())}
            </Text>
          </YStack>

          <XStack flex={1} gap={10}>
            <StyledPressable
              flex={1} height={52} borderRadius={999}
              borderWidth={1} borderColor={t.borderDefault}
              backgroundColor={t.bgInput}
              justifyContent="center" alignItems="center"
              onPress={onClose}>
              <Text
                variant="button"
                color={t.textPrimary}>
                Cancel
              </Text>
            </StyledPressable>

            <StyledPressable
              flex={2} height={52} borderRadius={999}
              backgroundColor={addButtonDisabled ? t.borderDefault : isEditMode ? t.brandPrimary : t.successColor}
              justifyContent="center" alignItems="center"
              flexDirection="row" gap={8}
              onPress={addButtonDisabled ? undefined : handleSubmit}
              disabled={addButtonDisabled}>
              <StyledMIcon
                pointerEvents={'none'}
                name={isEditMode ? 'check' : 'add-shopping-cart'}
                size={20}
                color={addButtonDisabled ? t.textMuted : '#fff'}
              />
              <Text
                variant="button"
                fontWeight="700"
                color={addButtonDisabled ? t.textMuted : '#fff'}>
                {addButtonText}
              </Text>
            </StyledPressable>
          </XStack>
        </XStack>

      </YStack>
    </YStack>
  );
}