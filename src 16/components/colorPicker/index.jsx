
import React, { useState, useEffect, useMemo } from 'react';
import { FlatList } from 'react-native';
import { palettes, theme } from '../../configs/theme';
import { YStack, XStack, StyledSpacer, StyledButton } from 'fluent-styles';
import {Text} from '../text';
import {useAppTheme} from '../../theme';

const ColorPicker = React.memo(({ color, onPress }) => {
    const [selectedColor, setSelectedColor] = useState(color);
  const {t} = useAppTheme();

    useEffect(() => {
        setSelectedColor(color);
    }, [color]);

    const handleClick = (color) => {
        setSelectedColor(color);
        if (onPress) onPress(color);
    };

    const colorData = useMemo(() => {
        return Object.keys(palettes).reduce((acc, colorFamily) => {
            const shades = Object.keys(palettes[colorFamily])
                .filter((key) => parseInt(key) >= 600 && parseInt(key) <= 900)
                .map((shade) => ({
                    color: palettes[colorFamily][shade],
                    shade
                }));
            return [...acc, ...shades];
        }, []);
    }, [palettes]);

    const renderItem = ({item}) => (
        <StyledButton
            height={48}
            width={48}
            borderRadius={5}
            marginVertical={10}
            marginHorizontal={5}
            backgroundColor={item.color}
            borderColor={item.color === selectedColor ? t.brandPrimary : t.borderDefault}
            borderWidth={item.color === selectedColor ? 3 : 1}
            onPress={() => handleClick(item.color)}
        />
    );

    return (
        <YStack padding={10} backgroundColor={t?.bgCard} borderRadius={12} justifyContent='center' alignItems='center'>
            {selectedColor && (
                <XStack flex={1} justifyContent='center' alignItems='center' height={100} width={100} marginTop={20} borderRadius={10} backgroundColor={selectedColor} borderColor={t?.borderDefault} borderWidth={1}>
                    <Text variant="caption" color={selectedColor === '#ffffff' || selectedColor === '#fff' ? t?.textPrimary : '#ffffff'}>
                        {selectedColor}
                    </Text>
                </XStack>
            )}
            <StyledSpacer marginVertical={8} />
            <FlatList
                data={colorData}
                renderItem={renderItem}
                keyExtractor={(item) => item.color}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
            <StyledSpacer marginVertical={4} />
        </YStack>
    );
});

export default ColorPicker;
