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

const REQUIRED_SINGLE_SELECT_GROUPS = ['Cooking Level','Spice Level','Size','Milk Type','Dressing'];
const OPTIONAL_SINGLE_SELECT_GROUPS = ['Sauce','Crust','Side'];
const MULTI_SELECT_GROUPS = ['Protein','Extras','Sides','Extra Toppings','Toppings','Sauces','Swallow'];

const getAddOnGroupName  = a => (a?.addOnName?.split(':') || [])[0]?.trim() || 'Other';
const getAddOnOptionName = a => (a?.addOnName?.split(':') || [])[1]?.trim() || a?.addOnName || '';

export default function AddOn({table_id, onClose, item, setItem}) {
  const {shop, addItem} = useAppContext();
  const {height, width} = useWindowDimensions();
  const [validationError, setValidationError] = useState('');

  // ── Grouping (unchanged) ─────────────────────────────────────
  const groupedAddOns = useMemo(() => {
    if (!item?.addOns || !Array.isArray(item.addOns)) return [];
    const groups = {};
    item.addOns.forEach(addOn => {
      const groupName  = getAddOnGroupName(addOn);
      const optionName = getAddOnOptionName(addOn);
      let type = 'multi';
      if (REQUIRED_SINGLE_SELECT_GROUPS.includes(groupName))      type = 'required-single';
      else if (OPTIONAL_SINGLE_SELECT_GROUPS.includes(groupName)) type = 'optional-single';
      if (!groups[groupName]) groups[groupName] = {name:groupName, type, options:[]};
      groups[groupName].options.push({
        ...addOn, optionName, displayName:`${groupName}: ${optionName}`, groupName, name:optionName,
      });
    });
    return Object.values(groups);
  }, [item?.addOns]);

  // ── Handlers (unchanged) ────────────────────────────────────
  const increaseAddOnQuantity = addOn => {
    setValidationError('');
    setItem(prev => ({...prev, addOns: prev?.addOns?.map(a =>
      a.addOn_id === addOn?.addOn_id ? {...a, quantity: parseInt(a.quantity||0,10)+1} : a) || []}));
  };

  const decreaseAddOnQuantity = addOn => {
    setValidationError('');
    setItem(prev => ({...prev, addOns: prev?.addOns?.map(a =>
      a.addOn_id === addOn?.addOn_id ? {...a, quantity: Math.max(0, parseInt(a.quantity||0,10)-1)} : a) || []}));
  };

  const toggleSingleSelect = (addOn, group) => {
    setValidationError('');
    setItem(prev => ({...prev, addOns: prev?.addOns?.map(a => {
      const isSameGroup  = getAddOnGroupName(a) === group.name;
      const isSameOption = a.addOn_id === addOn.addOn_id;
      const currentQty   = parseInt(a.quantity||0,10);
      if (!isSameGroup) return a;
      if (group.type === 'required-single') return {...a, quantity: isSameOption ? 1 : 0};
      if (group.type === 'optional-single') return {...a, quantity: isSameOption ? (currentQty>0?0:1) : 0};
      return a;
    }) || []}));
  };

  const clearOptionalSingleSelect = group => {
    setValidationError('');
    setItem(prev => ({...prev, addOns: prev?.addOns?.map(a =>
      getAddOnGroupName(a)===group.name ? {...a, quantity:0} : a) || []}));
  };

  const calculateTotalAddOnsPrice = () => {
    const sum = item?.addOns?.reduce((t,a) => t + parseFloat(a.price||0)*parseInt(a.quantity||0,10), 0) || 0;
    return sum + Number(item?.price||0);
  };

  const getSelectedCount  = gName => item?.addOns?.filter(a => getAddOnGroupName(a)===gName && parseInt(a.quantity||0,10)>0).length || 0;
  const getSelectedOption = group  => group.options.find(o => parseInt(o.quantity||0,10)>0);

  const validateRequiredGroups = () => {
    for (const g of groupedAddOns) {
      if (g.type==='required-single' && !g.options.some(o => parseInt(o.quantity||0,10)>0)) {
        setValidationError(`Select ${g.name}`);
        return false;
      }
    }
    setValidationError('');
    return true;
  };

  const onSubmit = () => {
    if (!validateRequiredGroups()) return;
    const index = `${Date.now()}${Math.random().toString(36).slice(2,8)}`;
    const selectedAddOns = groupedAddOns.flatMap(g =>
      g.options.filter(o => parseInt(o.quantity||0,10)>0).map(o => ({
        addOnName:o.name, quantity:parseInt(o.quantity||0,10), price:o.price,
        groupName:g.name, displayName:`${g.name}: ${o.name}`,
      }))
    );
    addItem(index, item.menu_id, item.name, item.price, 1, table_id, selectedAddOns).then(()=>{});
    onClose();
  };

  const firstMissing     = groupedAddOns.find(g => g.type==='required-single' && !g.options.some(o=>parseInt(o.quantity||0,10)>0));
  const addButtonDisabled = !!firstMissing;
  const addButtonText     = addButtonDisabled ? `Select ${firstMissing?.name}` : `Add ${formatCurrency(shop?.currency||'£', calculateTotalAddOnsPrice())}`;
  const cur               = shop?.currency || '£';
  const modalWidth        = width > 768 ? 660 : Math.round(width * 0.92);
  const modalMaxHeight    = Math.min(height * 0.82, 740);

  // ── POLISHED: single-select row ──────────────────────────────
  const renderSingleSelectRow = (option, group) => {
    const isSelected = parseInt(option.quantity||0,10) > 0;
    return (
      <StyledPressable
        key={option.addOn_id}
        onPress={() => toggleSingleSelect(option, group)}
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

        {/* Radio */}
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
            {option.optionName}
          </StyledText>
          {parseFloat(option.price) > 0 && (
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

  // ── POLISHED: multi-select row ───────────────────────────────
const renderMultiSelectRow = option => {
  const quantity = parseInt(option.quantity || 0, 10);
  const isSelected = quantity > 0;

  const handleAdd = () => {
    increaseAddOnQuantity(option);
  };

  const handleRemove = e => {
    e?.stopPropagation?.();
    decreaseAddOnQuantity(option);
  };

  return (
    <StyledPressable
      key={option.addOn_id}
      onPress={handleAdd}
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
          {option.optionName}
        </StyledText>

        {parseFloat(option.price || 0) > 0 && (
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
            paddingHorizontal={12}
            paddingVertical={6}
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
            paddingHorizontal={14}
            paddingVertical={8}
            borderRadius={30}
            backgroundColor={theme.colors.red[50]}
            borderWidth={1}
            borderColor={theme.colors.red[200]}
            onPress={handleRemove}>
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontSize={theme.fontSize.small}
              fontWeight={theme.fontWeight.normal}
              color={theme.colors.red[600]}>
              Remove
            </StyledText>
          </StyledPressable>
        </XStack>
      ) : (
        <YStack
          paddingHorizontal={18}
          paddingVertical={8}
          borderRadius={30}
          backgroundColor={theme.colors.yellow[500]}>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.small}
            fontWeight={theme.fontWeight.normal}
            color={theme.colors.gray[1]}>
            + Add
          </StyledText>
        </YStack>
      )}
    </StyledPressable>
  );
};

  const renderOptionRow = (option, group) => {
    if (group.type==='required-single' || group.type==='optional-single') {
      return renderSingleSelectRow(option, group);
    }
    return renderMultiSelectRow(option, group);
  };

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
        shadowOffset={{width:0, height:12}}
        shadowOpacity={0.22}
        shadowRadius={24}
        elevation={16}>

        {/* ── Header ─────────────────────────────── */}
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

        {/* ── CollapseGroup ───────────────────────── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          style={{maxHeight: modalMaxHeight - 152}}
          contentContainerStyle={{paddingHorizontal:12, paddingVertical:12, paddingBottom:16}}>

          {groupedAddOns.length > 0 ? (
            <CollapseGroup
              variant="bordered"
              defaultActiveKey={groupedAddOns[0]?.name}
              style={{gap:10}}>

              {groupedAddOns.map(group => {
                const selected = getSelectedOption(group);
                const count    = getSelectedCount(group.name);

                const subtitle =
                  group.type==='required-single' ? (selected ? selected.optionName : '⚠ Required')
                  : group.type==='optional-single' ? (selected ? selected.optionName : 'Optional')
                  : count > 0 ? `${count} selected` : 'Tap to add';

                return (
                  <CollapseItem
                    key={group.name}
                    itemKey={group.name}
                    title={group.name}
                    subtitle={subtitle}
                    activeHeader
                    trailing={
                      group.type==='optional-single' && selected ? (
                        <StyledPressable
                          paddingHorizontal={10} paddingVertical={4}
                          borderRadius={8}
                          backgroundColor={theme.colors.gray[100]}
                          onPress={e => { e?.stopPropagation?.(); clearOptionalSingleSelect(group); }}>
                          <StyledText
                            fontFamily={fontStyles.Roboto_Regular}
                            fontSize={theme.fontSize.small}
                            fontWeight={theme.fontWeight.semiBold}
                            color={theme.colors.blue[500]}>
                            Clear
                          </StyledText>
                        </StyledPressable>
                      ) : group.type==='required-single' && !selected ? (
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
                    {group.options.map(option => renderOptionRow(option, group))}
                  </CollapseItem>
                );
              })}
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

          {/* Validation error */}
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

        {/* ── Footer ─────────────────────────────── */}
        <XStack
          paddingHorizontal={16} paddingVertical={14}
          borderTopWidth={1} borderTopColor={theme.colors.gray[200]}
          backgroundColor={theme.colors.gray[50]}
          alignItems="center" gap={12}>

          {/* Running total */}
          <YStack>
            <StyledText
              fontSize={10} fontWeight="700"
              color={theme.colors.gray[400]}
              style={{letterSpacing:0.8}}>
              TOTAL
            </StyledText>
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              fontSize={theme.fontSize.large}
              fontWeight={theme.fontWeight.bold}
              color={theme.colors.gray[900]}>
              {formatCurrency(cur, calculateTotalAddOnsPrice())}
            </StyledText>
          </YStack>

          <XStack flex={1} gap={10}>
            {/* Close */}
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

            {/* Add */}
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