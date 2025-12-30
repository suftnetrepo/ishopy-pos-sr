import React, { useState, useCallback } from 'react';
import {
    StyledSafeAreaView,
    StyledHeader,
    StyledSpacer,
    StyledText
} from 'fluent-styles';
import { Stack } from '../../../components/package/stack';
import { theme } from '../../../utils/theme';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import Drawer from '../../../components/package/drawer';
import { StyledShape } from '../../../components/package/shape';
import { StyledImage } from '../../../components/package/image';
import Shop from './shop';
import { useNavigation } from '@react-navigation/native';
import { Backup } from '../../../components/backup/backup';
import { Restore } from '../../../components/backup/restore';
import Printer from './printer';

const SETTINGS_CONFIG = {
    rows: [
        [
            { id: 'category', icon: require('../../../../assets/img/category-1.png'), name: 'Category' },
            { id: 'item', icon: require('../../../../assets/img/box-1.png'), name: 'Item' },
            { id: 'tax', icon: require('../../../../assets/img/tax-1.png'), name: 'Tax' }
        ],
        [
            { id: 'discount', icon: require('../../../../assets/img/discount-1.png'), name: 'Discount' },
            { id: 'user', icon: require('../../../../assets/img/user-1.png'), name: 'User' },
            { id: 'shop', icon: require('../../../../assets/img/shop-1.png'), name: 'Shop' }

        ],
        [
            { id: 'back-up', icon: require('../../../../assets/img/back-1.png'), name: 'Back' },
            { id: 'restore', icon: require('../../../../assets/img/restore-1.png'), name: 'Restore' },
            { id: 'payment', icon: require('../../../../assets/img/report-1.png'), name: 'Payment' },
        ],
        [
            { id: 'printer', icon: require('../../../../assets/img/report-2.png'), name: 'Printer' }
        ]
    ]
};

const BigSettings = () => {
    const navigation = useNavigation()
    const [show, setShow] = useState({
        data: null,
        id: '',
        tag: ''
    });

    const handleCardPress = useCallback((itemId) => {
        console.log('Card pressed:', itemId);
        switch (itemId) {
            case 'shop':
                setShow(({ ...show, id: itemId, tag: 'shop' }))
                break;
            case 'category':
                navigation.navigate('big-category')
                break;
            case 'tax':
                navigation.navigate('big-tax')
                break;
            case 'discount':
                navigation.navigate('big-discount')
                break;
            case 'item':
                navigation.navigate('big-item')
                break;
            case 'user':
                navigation.navigate('big-user')
                break;
            case 'payment':
                navigation.navigate('big-payment')
                break;
            case 'back-up':
                setShow(({ ...show, id: 'back-up', tag: 'back-up' }))
                break;
            case 'restore':
                setShow(({ ...show, id: 'restore', tag: 'restore' }))
                break;
                 case 'printer':
                setShow(({ ...show, id: 'printer', tag: 'printer' }))
                break;
            default:
                break;
        }

    }, []);

    const RenderCard = ({ icon, name, onTouchStart }) => {
        return (
            <Stack
                horizonal
                flex={1}
                borderRadius={8}
                backgroundColor={theme.colors.gray[1]}
                borderColor={theme.colors.gray[100]}
                borderWidth={1}
            >
                <Stack
                    flex={1}
                    onTouchStart={onTouchStart}
                    vertical
                    borderRadius={8}
                    backgroundColor={theme.colors.gray[1]}
                    paddingHorizontal={18}
                    paddingVertical={18}
                    justifyContent="center"
                    alignItems="center"
                >
                    <StyledShape
                        cycle
                        height={60}
                        width={60}
                        borderColor={theme.colors.gray[1]}
                        backgroundColor={theme.colors.gray[1]}
                    >
                        <StyledImage
                            source={icon}
                            size={32}
                            cycle
                            resizeMode="contain"
                        />
                    </StyledShape>
                    <StyledSpacer marginVertical={2} />
                    <StyledText
                        color={theme.colors.gray[500]}
                        fontSize={16}
                        fontWeight={theme.fontWeight.medium}
                    >
                        {name}
                    </StyledText>
                </Stack>
            </Stack>
        );
    };

    return (
        <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
            <StyledHeader borderRadius={30} statusProps={{ translucent: true, hidden: false }}>
                <StyledHeader.Full>
                    <RenderHeader
                        showBackButton={true}
                        showLogo={false}
                        showTitle={true}
                        title='Settings'
                    />
                </StyledHeader.Full>
            </StyledHeader>

            <Stack flex={1.5} horizonal>
                <SideBarAdapter selectedMenu={5} showMenu={false} collapse={true} />
                <Stack flex={3} gap={8} marginHorizontal={16} vertical>
                    {SETTINGS_CONFIG.rows.map((row, rowIndex) => (
                        <Stack
                            key={`row-${rowIndex}`}
                            horizonal
                            gap={8}
                            {...(rowIndex === 2 && {
                                borderColor: theme.colors.gray[200],
                                borderWidth: 1
                            })}
                        >
                            {row.map((item) => (
                                <RenderCard
                                    key={item.id}
                                    icon={item.icon}
                                    name={item.name}
                                    onTouchStart={() => handleCardPress(item.id)}
                                />
                            ))}
                        </Stack>
                    ))}
                </Stack>
            </Stack>

            <Drawer
                direction="right"
                isOpen={['shop', 'restore', 'back-up', 'printer'].includes(show.tag)}
                onClose={() => setShow({ data: null, id: '', tag: '' })}
            >
                {show.tag === 'shop' && (
                    <Shop onClose={() => setShow({ data: null, id: '', tag: '' })} />
                )}
                {show.tag === 'back-up' && (
                    <Backup></Backup>
                )}
                {show.tag === 'restore' && (
                    <Restore></Restore>
                )}
                {show.tag === 'printer' && (
                    <Printer onClose={() => setShow({ data: null, id: '', tag: '' })} />
                )}
            </Drawer>
        </StyledSafeAreaView>
    );
};

export default BigSettings;