import React, {useMemo, useState} from 'react';
import {useWindowDimensions, ScrollView} from 'react-native';
import {
  YStack,
  XStack,
  StyledText,
  StyledPressable,
  CollapseGroup,
  CollapseItem,
} from 'fluent-styles';
import {fontStyles, theme} from '../../../../utils/theme';
import {useAppContext} from '../../../../hooks/appContext';
import {formatCurrency} from '../../../../utils/help';
import {StyledMIcon} from '../../../../components/icon';

const REQUIRED_SINGLE_SELECT_GROUPS = [
  'Cooking Level',
  'Spice Level',
  'Size',
  'Milk Type',
  'Dressing',
];

const OPTIONAL_SINGLE_SELECT_GROUPS = ['Sauce', 'Crust', 'Side'];

const MULTI_SELECT_GROUPS = [
  'Protein',
  'Extras',
  'Sides',
  'Extra Toppings',
  'Toppings',
  'Sauces',
  'Swallow',
];

const getAddOnGroupName = addOn => {
  const parts = addOn?.addOnName?.split(':') || [];
  return parts[0]?.trim() || 'Other';
};

const getAddOnOptionName = addOn => {
  const parts = addOn?.addOnName?.split(':') || [];
  return parts[1]?.trim() || addOn?.addOnName || '';
};

export default function AddOn({table_id, onClose, item, setItem}) {
  const {shop, addItem} = useAppContext();
  const {height, width} = useWindowDimensions();
  const [validationError, setValidationError] = useState('');

  const groupedAddOns = useMemo(() => {
    if (!item?.addOns || !Array.isArray(item.addOns)) return [];

    const groups = {};

    item.addOns.forEach(addOn => {
      const groupName = getAddOnGroupName(addOn);
      const optionName = getAddOnOptionName(addOn);

      let type = 'multi';

      if (REQUIRED_SINGLE_SELECT_GROUPS.includes(groupName)) {
        type = 'required-single';
      } else if (OPTIONAL_SINGLE_SELECT_GROUPS.includes(groupName)) {
        type = 'optional-single';
      } else if (MULTI_SELECT_GROUPS.includes(groupName)) {
        type = 'multi';
      }

      if (!groups[groupName]) {
        groups[groupName] = {
          name: groupName,
          type,
          options: [],
        };
      }

      groups[groupName].options.push({
        ...addOn,
        optionName,
        displayName: `${groupName}: ${optionName}`,
        groupName,
        name: optionName,
      });
    });

    return Object.values(groups);
  }, [item?.addOns]);

  const increaseAddOnQuantity = addOn => {
    setValidationError('');

    setItem(prev => ({
      ...prev,
      addOns:
        prev?.addOns?.map(a =>
          a.addOn_id === addOn?.addOn_id
            ? {
                ...a,
                quantity: parseInt(a.quantity || 0, 10) + 1,
              }
            : a
        ) || [],
    }));
  };

  const decreaseAddOnQuantity = addOn => {
    setValidationError('');

    setItem(prev => ({
      ...prev,
      addOns:
        prev?.addOns?.map(a =>
          a.addOn_id === addOn?.addOn_id
            ? {
                ...a,
                quantity: Math.max(0, parseInt(a.quantity || 0, 10) - 1),
              }
            : a
        ) || [],
    }));
  };

  const toggleSingleSelect = (addOn, group) => {
    setValidationError('');

    setItem(prev => ({
      ...prev,
      addOns:
        prev?.addOns?.map(a => {
          const currentGroupName = getAddOnGroupName(a);
          const isSameGroup = currentGroupName === group.name;
          const isSameOption = a.addOn_id === addOn.addOn_id;
          const currentQty = parseInt(a.quantity || 0, 10);

          if (!isSameGroup) return a;

          if (group.type === 'required-single') {
            return {
              ...a,
              quantity: isSameOption ? 1 : 0,
            };
          }

          if (group.type === 'optional-single') {
            return {
              ...a,
              quantity: isSameOption ? (currentQty > 0 ? 0 : 1) : 0,
            };
          }

          return a;
        }) || [],
    }));
  };

  const clearOptionalSingleSelect = group => {
    setValidationError('');

    setItem(prev => ({
      ...prev,
      addOns:
        prev?.addOns?.map(a =>
          getAddOnGroupName(a) === group.name ? {...a, quantity: 0} : a
        ) || [],
    }));
  };

  const calculateTotalAddOnsPrice = () => {
    const addOnsTotal =
      item?.addOns?.reduce((total, addOn) => {
        const price = parseFloat(addOn.price || 0);
        const quantity = parseInt(addOn.quantity || 0, 10);

        return total + price * quantity;
      }, 0) || 0;

    return addOnsTotal + Number(item?.price || 0);
  };

  const getSelectedCount = groupName => {
    return (
      item?.addOns?.filter(
        a => getAddOnGroupName(a) === groupName && parseInt(a.quantity || 0, 10) > 0
      ).length || 0
    );
  };

  const getSelectedOption = group => {
    return group.options.find(opt => parseInt(opt.quantity || 0, 10) > 0);
  };

  const validateRequiredGroups = () => {
    for (const group of groupedAddOns) {
      if (group.type === 'required-single') {
        const hasSelectedOption = group.options.some(
          opt => parseInt(opt.quantity || 0, 10) > 0
        );

        if (!hasSelectedOption) {
          setValidationError(`Select ${group.name}`);
          return false;
        }
      }
    }

    setValidationError('');
    return true;
  };

  const onSubmit = () => {
    if (!validateRequiredGroups()) return;

    const index = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

    const selectedAddOns = groupedAddOns.flatMap(group =>
      group.options
        .filter(opt => parseInt(opt.quantity || 0, 10) > 0)
        .map(opt => ({
          addOnName: opt.name,
          quantity: parseInt(opt.quantity || 0, 10),
          price: opt.price,
          groupName: group.name,
          displayName: `${group.name}: ${opt.name}`,
        }))
    );

    addItem(
      index,
      item.menu_id,
      item.name,
      item.price,
      1,
      table_id,
      selectedAddOns
    ).then(() => {});

    onClose();
  };

  const renderSingleSelectRow = (option, group) => {
    const quantity = parseInt(option.quantity || 0, 10);
    const isSelected = quantity > 0;

    return (
      <StyledPressable
        key={option.addOn_id}
        onPress={() => toggleSingleSelect(option, group)}
        paddingHorizontal={14}
        paddingVertical={12}
        minHeight={58}
        borderBottomWidth={1}
        borderBottomColor={theme.colors.gray[200]}
        backgroundColor={isSelected ? theme.colors.blue[50] : theme.colors.gray[1]}
        borderLeftWidth={isSelected ? 4 : 0}
        borderLeftColor={isSelected ? theme.colors.blue[500] : 'transparent'}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <YStack flex={1}>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.normal}
            fontWeight={isSelected ? theme.fontWeight.bold : theme.fontWeight.normal}
            color={theme.colors.gray[800]}>
            {option.optionName}
          </StyledText>

          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.small}
            color={theme.colors.gray[600]}>
            {formatCurrency(shop?.currency || '£', option.price)}
          </StyledText>
        </YStack>

        {isSelected ? (
          <StyledMIcon name="check-circle" size={22} color={theme.colors.blue[500]} />
        ) : (
          <YStack
            width={22}
            height={22}
            borderRadius={11}
            borderWidth={1}
            borderColor={theme.colors.gray[300]}
          />
        )}
      </StyledPressable>
    );
  };

  const renderMultiSelectRow = (option, group) => {
    const quantity = parseInt(option.quantity || 0, 10);
    const isSelected = quantity > 0;

    return (
      <StyledPressable
        key={option.addOn_id}
        onPress={() => increaseAddOnQuantity(option)}
        paddingHorizontal={14}
        paddingVertical={12}
        minHeight={64}
        borderBottomWidth={1}
        borderBottomColor={theme.colors.gray[200]}
        backgroundColor={isSelected ? theme.colors.blue[50] : theme.colors.gray[1]}
        borderLeftWidth={isSelected ? 4 : 0}
        borderLeftColor={isSelected ? theme.colors.blue[500] : 'transparent'}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <YStack flex={1}>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.normal}
            fontWeight={isSelected ? theme.fontWeight.bold : theme.fontWeight.normal}
            color={theme.colors.gray[800]}>
            {option.optionName}
          </StyledText>

          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.small}
            color={theme.colors.gray[600]}>
            {formatCurrency(shop?.currency || '£', option.price)}
          </StyledText>
        </YStack>

        {isSelected ? (
          <XStack gap={8} alignItems="center">
            <YStack
              minWidth={62}
              height={36}
              paddingHorizontal={10}
              borderRadius={8}
              backgroundColor={theme.colors.blue[100]}
              justifyContent="center"
              alignItems="center">
              <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                color={theme.colors.blue[700]}
                fontWeight={theme.fontWeight.bold}
                fontSize={theme.fontSize.small}>
                Qty {quantity}
              </StyledText>
            </YStack>

            <StyledPressable
              width={82}
              height={36}
              borderRadius={8}
              backgroundColor={theme.colors.red[50]}
              justifyContent="center"
              alignItems="center"
              onPress={e => {
                e?.stopPropagation?.();
                decreaseAddOnQuantity(option);
              }}>
              <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                color={theme.colors.red[600]}
                fontWeight={theme.fontWeight.medium}
                fontSize={theme.fontSize.small}>
                Remove
              </StyledText>
            </StyledPressable>
          </XStack>
        ) : (
          <YStack
            width={72}
            height={36}
            borderRadius={8}
            backgroundColor={theme.colors.blue[500]}
            justifyContent="center"
            alignItems="center">
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              color={theme.colors.gray[1]}
              fontWeight={theme.fontWeight.bold}
              fontSize={theme.fontSize.small}>
              Add
            </StyledText>
          </YStack>
        )}
      </StyledPressable>
    );
  };

  const renderOptionRow = (option, group) => {
    if (group.type === 'required-single' || group.type === 'optional-single') {
      return renderSingleSelectRow(option, group);
    }

    return renderMultiSelectRow(option, group);
  };

  const modalWidth = width > 768 ? 660 : Math.round(width * 0.92);
  const modalMaxHeight = Math.min(height * 0.78, 720);

  const firstMissingRequired = groupedAddOns.find(
    group =>
      group.type === 'required-single' &&
      !group.options.some(opt => parseInt(opt.quantity || 0, 10) > 0)
  );

  const addButtonDisabled = !!firstMissingRequired;

  const addButtonText = addButtonDisabled
    ? `Select ${firstMissingRequired?.name}`
    : `Add ${formatCurrency(shop?.currency || '£', calculateTotalAddOnsPrice())}`;

  const defaultActiveKey = groupedAddOns[0]?.name;

  return (
    <YStack
      backgroundColor={theme.colors.transparent05}
      flex={1}
      justifyContent="center"
      alignItems="center">
      <YStack
        width={modalWidth}
        maxHeight={modalMaxHeight}
        backgroundColor={theme.colors.gray[1]}
        borderRadius={16}
        overflow="hidden">
        <YStack
          paddingHorizontal={16}
          paddingVertical={14}
          borderBottomWidth={1}
          borderBottomColor={theme.colors.gray[200]}
          backgroundColor={theme.colors.gray[50]}>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.large}
            fontWeight={theme.fontWeight.bold}
            color={theme.colors.gray[800]}>
            {item.name}
          </StyledText>

          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.normal}
            color={theme.colors.gray[600]}>
            Base: {formatCurrency(shop?.currency || '£', item.price)}
          </StyledText>
        </YStack>

        <ScrollView
          showsVerticalScrollIndicator
          nestedScrollEnabled
          style={{maxHeight: modalMaxHeight - 144}}
          contentContainerStyle={{paddingBottom: 120, paddingTop: 8}}>
          {groupedAddOns.length > 0 ? (
            <CollapseGroup
              variant="bordered"
              defaultActiveKey={defaultActiveKey}
              style={{gap: 8, paddingHorizontal: 8}}>
              {groupedAddOns.map(group => {
                const selected = getSelectedOption(group);

                let subtitle = '';

                if (group.type === 'required-single') {
                  subtitle = selected ? selected.optionName : 'Required';
                } else if (group.type === 'optional-single') {
                  subtitle = selected ? selected.optionName : 'Optional';
                } else {
                  subtitle = `${getSelectedCount(group.name)} selected`;
                }

                return (
                  <CollapseItem
                    key={group.name}
                    itemKey={group.name}
                    title={group.name}
                    subtitle={subtitle}
                    activeHeader
                    trailing={
                      group.type === 'optional-single' && selected ? (
                        <StyledPressable
                          onPress={e => {
                            e?.stopPropagation?.();
                            clearOptionalSingleSelect(group);
                          }}>
                          <StyledText
                            fontFamily={fontStyles.Roboto_Regular}
                            fontSize={theme.fontSize.small}
                            color={theme.colors.blue[500]}
                            paddingHorizontal={8}>
                            Clear
                          </StyledText>
                        </StyledPressable>
                      ) : null
                    }>
                    {group.options.map(option => renderOptionRow(option, group))}
                  </CollapseItem>
                );
              })}
            </CollapseGroup>
          ) : (
            <YStack padding={16} alignItems="center">
              <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                fontSize={theme.fontSize.normal}
                color={theme.colors.gray[600]}>
                No add-ons available
              </StyledText>
            </YStack>
          )}

          {validationError ? (
            <YStack paddingHorizontal={12} paddingVertical={8}>
              <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                fontSize={theme.fontSize.small}
                color={theme.colors.red[600]}>
                {validationError}
              </StyledText>
            </YStack>
          ) : null}
        </ScrollView>

        <XStack
          paddingHorizontal={16}
          paddingVertical={12}
          borderTopWidth={1}
          borderTopColor={theme.colors.gray[200]}
          backgroundColor={theme.colors.gray[50]}
          gap={12}>
          <StyledPressable
            flex={1}
            borderRadius={8}
            paddingHorizontal={16}
            paddingVertical={12}
            backgroundColor={theme.colors.gray[200]}
            justifyContent="center"
            alignItems="center"
            onPress={onClose}>
            <StyledText
              fontFamily={fontStyles.Roboto_Regular}
              color={theme.colors.gray[800]}
              fontWeight={theme.fontWeight.medium}
              fontSize={theme.fontSize.normal}>
              Close
            </StyledText>
          </StyledPressable>

          <StyledPressable
            flex={1}
            borderRadius={8}
            paddingHorizontal={16}
            paddingVertical={12}
            backgroundColor={
              addButtonDisabled ? theme.colors.gray[300] : theme.colors.green[500]
            }
            justifyContent="center"
            alignItems="center"
            onPress={addButtonDisabled ? undefined : onSubmit}
            disabled={addButtonDisabled}>
            <StyledText
              color={addButtonDisabled ? theme.colors.gray[500] : theme.colors.gray[1]}
              fontWeight={theme.fontWeight.bold}
              fontSize={theme.fontSize.normal}>
              {addButtonText}
            </StyledText>
          </StyledPressable>
        </XStack>
      </YStack>
    </YStack>
  );
}