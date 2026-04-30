/* eslint-disable prettier/prettier */
import React, {useState, useCallback} from 'react';
import {
  StyledPage,
  StyledSpacer,
  StyledText,
  Stack,
  theme,
  Drawer,
} from 'fluent-styles';
import SideBarAdapter from '../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../components/tablet/header';
import {StyledShape} from '../../components/package/shape';
import {StyledImage} from '../../components/package/image';
import Shop from './shop';
import {useNavigation} from '@react-navigation/native';
import Printer from './printer';
import {capitalize} from '../../utils/help';

const SETTINGS_CONFIG = {
  rows: [
    [
      {id: 'category', icon: require('../../../assets/img/category-1.png'), name: 'Categories'},
      {id: 'item',     icon: require('../../../assets/img/box-1.png'),      name: 'Items'},
      {id: 'tax',      icon: require('../../../assets/img/tax-1.png'),      name: 'Taxes'},
    ],
    [
      {id: 'discount', icon: require('../../../assets/img/discount-1.png'), name: 'Discounts'},
      {id: 'user',     icon: require('../../../assets/img/user-1.png'),     name: 'Users'},
      {id: 'shop',     icon: require('../../../assets/img/shop-1.png'),     name: 'Shop'},
    ],
    [
      {id: 'table',   icon: require('../../../assets/img/back-1.png'),    name: 'Tables'},
      {id: 'backup',  icon: require('../../../assets/img/restore-1.png'), name: 'Backup'},
      {id: 'printer', icon: require('../../../assets/img/report-2.png'),  name: 'Printer'},
    ],
  ],
};

const BigSettings = () => {
  const navigation = useNavigation();
  const [show, setShow] = useState({data: null, id: '', tag: ''});

  const handleCardPress = useCallback(itemId => {
    switch (itemId) {
      case 'shop':
        setShow({...show, id: itemId, tag: 'shop'});
        break;
      case 'category':
        navigation.navigate('big-category');
        break;
      case 'tax':
        navigation.navigate('big-tax');
        break;
      case 'discount':
        navigation.navigate('big-discount');
        break;
      case 'item':
        navigation.navigate('big-item');
        break;
      case 'user':
        navigation.navigate('big-user');
        break;
      case 'table':
        navigation.navigate('table-settings');
        break;
      case 'backup':
        navigation.navigate('big-backup');
        break;
      case 'printer':
        setShow({...show, id: 'printer', tag: 'printer'});
        break;
      default:
        break;
    }
  }, []);

  const RenderCard = ({icon, name, onTouchStart}) => (
    <Stack horizontal flex={1} borderRadius={8}
      backgroundColor={theme.colors.gray[1]}
      borderColor={theme.colors.gray[100]} borderWidth={1}>
      <Stack flex={1} onTouchStart={onTouchStart} vertical borderRadius={8}
        backgroundColor={theme.colors.gray[1]}
        paddingHorizontal={18} paddingVertical={18}
        justifyContent="center" alignItems="center">
        <StyledShape cycle height={60} width={60}
          borderColor={theme.colors.gray[1]}
          backgroundColor={theme.colors.gray[1]}>
          <StyledImage source={icon} size={32} cycle resizeMode="contain" />
        </StyledShape>
        <StyledSpacer marginVertical={2} />
        <StyledText color={theme.colors.gray[500]} fontSize={16}
          fontWeight={theme.fontWeight.medium}>
          {name}
        </StyledText>
      </Stack>
    </Stack>
  );

  return (
    <StyledPage backgroundColor={theme.colors.gray[100]}>
      <StyledPage.Header.Full>
        <RenderHeader showBackButton showLogo={false} showTitle title="Settings" />
      </StyledPage.Header.Full>

      <Stack flex={1.5} horizontal>
        <SideBarAdapter selectedMenu={6} showMenu={false} collapse />
        <Stack flex={3} gap={8} marginHorizontal={16} vertical>
          {SETTINGS_CONFIG.rows.map((row, rowIndex) => (
            <Stack key={`row-${rowIndex}`} horizontal gap={8}>
              {row.map(item => (
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
        visible={['shop', 'printer'].includes(show.tag)}
        onClose={() => setShow({data: null, id: '', tag: ''})}
        title={capitalize(show.tag)}
        width="30%"
        colors={{background: theme.colors.gray[100]}}
        side="right">
        {show.tag === 'shop' && (
          <Shop onClose={() => setShow({data: null, id: '', tag: ''})} />
        )}
        {show.tag === 'printer' && (
          <Printer onClose={() => setShow({data: null, id: '', tag: ''})} />
        )}
      </Drawer>
    </StyledPage>
  );
};

export default BigSettings;