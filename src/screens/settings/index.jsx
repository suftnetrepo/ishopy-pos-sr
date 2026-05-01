/* eslint-disable prettier/prettier */
import React, {useState, useCallback} from 'react';
import {
  StyledPage,
  StyledText,
  StyledPressable,
  Stack,
  theme,
  Drawer,
} from 'fluent-styles';
import SideBarAdapter from '../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../components/tablet/header';
import {StyledIcon} from '../../components/package/icon';
import Shop from './shop';
import {useNavigation} from '@react-navigation/native';
import Printer from './printer';
import {capitalize} from '../../utils/help';
import {useAppTheme} from '../../theme';

const SETTINGS = [
  {
    section: 'Menu & Products',
    items: [
      {id: 'category', icon: 'add-shopping-cart', iconBg: '#ede9fe', iconColor: '#7c3aed', name: 'Categories', sub: 'Manage menu groups'},
      {id: 'item',     icon: 'edit',              iconBg: '#dbeafe', iconColor: '#1d4ed8', name: 'Items',       sub: 'Products & pricing'},
      {id: 'tax',      icon: 'attach-money',      iconBg: '#fef3c7', iconColor: '#b45309', name: 'Taxes',       sub: 'Tax rates'},
      {id: 'discount', icon: 'money',             iconBg: '#dcfce7', iconColor: '#15803d', name: 'Discounts',   sub: 'Discount rules'},
    ],
  },
  {
    section: 'Business',
    items: [
      {id: 'shop',  icon: 'email',      iconBg: '#fef3c7', iconColor: '#b45309', name: 'Shop',   sub: 'Name, currency, mode'},
      {id: 'user',  icon: 'person',     iconBg: '#dbeafe', iconColor: '#1d4ed8', name: 'Users',  sub: 'Staff & access'},
      {id: 'table', icon: 'date-range', iconBg: '#ede9fe', iconColor: '#7c3aed', name: 'Tables', sub: 'Dine in, bar, takeaway'},
    ],
  },
  {
    section: 'System',
    items: [
      {id: 'backup',  icon: 'cloud-upload', iconBg: '#dcfce7', iconColor: '#15803d', name: 'Backup',  sub: 'Google Drive sync'},
      {id: 'printer', icon: 'print',        iconBg: '#f3e8ff', iconColor: '#7c3aed', name: 'Printer', sub: 'Receipt printer setup'},
    ],
  },
];

// ─── Card — receives t as prop so it works outside the main component ─────────
const SettingsCard = ({icon, iconBg, iconColor, name, sub, onPress, t}) => (
  <StyledPressable
    onPress={onPress}
    flexDirection="row"
    alignItems="center"
    gap={14}
    backgroundColor={t.bgCard}
    borderRadius={12}
    borderWidth={0.5}
    borderColor={t.borderDefault}
    paddingHorizontal={16}
    paddingVertical={14}
    flex={1}>
    <Stack
      width={44} height={44} borderRadius={22}
      backgroundColor={iconBg}
      alignItems="center" justifyContent="center"
      flexShrink={0}>
      <StyledIcon name={icon} size={22} color={iconColor} />
    </Stack>
    <Stack vertical gap={2} flex={1}>
      <StyledText
        fontSize={theme.fontSize.normal}
        fontWeight={theme.fontWeight.medium}
        color={t.textPrimary}>
        {name}
      </StyledText>
      <StyledText fontSize={theme.fontSize.small} color={t.textMuted}>
        {sub}
      </StyledText>
    </Stack>
    <StyledIcon name="chevron-right" size={20} color={t.textMuted} />
  </StyledPressable>
);

const BigSettings = () => {
  const navigation = useNavigation();
  const {t} = useAppTheme();
  const [show, setShow] = useState({data: null, id: '', tag: ''});

  const handlePress = useCallback((id) => {
    switch (id) {
      case 'shop':     setShow({data: null, id, tag: 'shop'}); break;
      case 'printer':  setShow({data: null, id, tag: 'printer'}); break;
      case 'category': navigation.navigate('big-category'); break;
      case 'tax':      navigation.navigate('big-tax'); break;
      case 'discount': navigation.navigate('big-discount'); break;
      case 'item':     navigation.navigate('big-item'); break;
      case 'user':     navigation.navigate('big-user'); break;
      case 'table':    navigation.navigate('table-settings'); break;
      case 'backup':   navigation.navigate('big-backup'); break;
    }
  }, []);

  const close = () => setShow({data: null, id: '', tag: ''});

  return (
    <StyledPage backgroundColor={t.bgPage}>
      <StyledPage.Header.Full>
        <RenderHeader showBackButton showLogo={false} showTitle title="Settings" />
      </StyledPage.Header.Full>

      <Stack flex={1.5} horizontal>
        <SideBarAdapter selectedMenu={6} showMenu={false} collapse />
        <Stack flex={3} paddingHorizontal={16} vertical paddingTop={8}>

          {SETTINGS.map(section => (
            <Stack key={section.section} vertical marginBottom={16}>
              <StyledText
                fontSize={10}
                fontWeight={theme.fontWeight.semiBold}
                color={t.textMuted}
                letterSpacing={0.8}
                marginBottom={8}
                marginLeft={4}>
                {section.section.toUpperCase()}
              </StyledText>
              <Stack vertical gap={8}>
                {Array.from({length: Math.ceil(section.items.length / 2)}, (_, i) => (
                  <Stack key={i} horizontal gap={8}>
                    {section.items.slice(i * 2, i * 2 + 2).map(item => (
                      <SettingsCard
                        key={item.id}
                        t={t}
                        icon={item.icon}
                        iconBg={item.iconBg}
                        iconColor={item.iconColor}
                        name={item.name}
                        sub={item.sub}
                        onPress={() => handlePress(item.id)}
                      />
                    ))}
                    {section.items.slice(i * 2, i * 2 + 2).length === 1 && (
                      <Stack marginHorizontal={16} horizontal flex={1} />
                    )}
                  </Stack>
                ))}
              </Stack>
            </Stack>
          ))}

        </Stack>
      </Stack>

      <Drawer
        visible={['shop', 'printer'].includes(show.tag)}
        onClose={close}
        title={capitalize(show.tag)}
        width="30%"
        colors={{background: t.bgPage}}
        side="right">
        {show.tag === 'shop'    && <Shop onClose={close} />}
        {show.tag === 'printer' && <Printer onClose={close} />}
      </Drawer>
    </StyledPage>
  );
};

export default BigSettings;
