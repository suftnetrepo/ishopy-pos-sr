import React, {useState, useEffect, useRef} from 'react';
import {
  StyledCycle,
  Stack,
  theme,
  StyledPage,
  Drawer as StyledDrawer,
  useDialogue,
  toastService, StyleShape
} from 'fluent-styles';
import {Animated, Pressable} from 'react-native';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import {StyledSearchBar} from '../../../components/searchBar';
import ItemCard from '../item/card';
import ItemForm from '../item/form/form';
import {useFocus} from '../../../hooks/useFocus';
import {StyledIcon} from '../../../components/package/icon';
import {useAppContext} from '../../../hooks/appContext';
import ItemAddOn from './addOn';
import { useDeleteMenu } from '../../../hooks/useMenu';
import {useAppTheme} from '../../../theme';

const BigItem = () => {
  const dialogue = useDialogue();
  const {shop, updateMenuQuery} = useAppContext();
  const {t} = useAppTheme();
  const {deleteMenu} = useDeleteMenu();
  const navigationFocus = useFocus();
  const itemCardRef = useRef(null);
  const [state, setState] = useState({
    data: null,
    tag: '',
  });
  const [screenFocus, setScreenFocus] = useState(true);
  const [showAddOn, setShowAddOn] = useState(null);
  const [addButtonScale] = useState(new Animated.Value(1));
  const shouldOpen = state.tag === 'Edit' || state.tag === 'Add';
  const isFocused = navigationFocus && screenFocus;

  useEffect(() => {
    if (state.tag) {
      setScreenFocus(false);
    } else {
      setScreenFocus(true);
    }
  }, [state.tag]);

  const reset = () => {
    setState({...state, tag: '', data: null});
  };

  const update = tag => {
    setState({...state, tag, data: null});
  };

  const handleAddButtonPressIn = () => {
    Animated.spring(addButtonScale, {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 6,
      tension: 40,
    }).start();
  };

  const handleAddButtonPressOut = () => {
    Animated.spring(addButtonScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 40,
    }).start();
  };

   const onDeleteItem = async item_id => {
    const id = dialogue.show({
      title: 'Delete item?',
      message: 'This action cannot be undone.',
      icon: '⚠️',
      theme: 'light',
      actions: [
         {
          label: 'Keep it',
          variant: 'secondary',
          onPress: () => {
            dialogue.dismiss(id);
          },
        },
        {
          label: 'Delete',
          variant: 'destructive',
          onPress: () => {
            deleteMenu(item_id).then(async result => {
              onNotify({status: 'deleted'});
            });
          },
        },
      ],
    });
  };

   const onNotify = ({status, t}) => {
    toastService.show({
      message: `Item ${status}`,
      description: `Your item was deleted successfully.`,
      variant: 'success',
      duration: 2500,
      theme: 'light',
    });
  };

  return (
    <StyledPage backgroundColor={t.bgPage}>
      <StyledPage.Header.Full>
        <RenderHeader
          showBackButton={true}
          showLogo={false}
          showTitle={true}
          title="Items"
          CopyIcon={
            <Animated.View style={{transform: [{scale: addButtonScale}]}}>
              <Pressable 
                onTouchStart={() => itemCardRef.current?.requestAdd()}
                onPressIn={handleAddButtonPressIn}
                onPressOut={handleAddButtonPressOut}>
                <StyleShape
                  cycle
                  size={48}
                  borderWidth={0}
                  backgroundColor={t.brandPrimary}
                  borderColor={t.brandPrimary}
                  shadowColor={t.brandPrimary}
                  shadowOffset={{width: 0, height: 3}}
                  shadowOpacity={0.25}
                  shadowRadius={8}
                  elevation={4}>
                  <StyledIcon
                    pointerEvents="none"
                    size={24}
                    name="add"
                    color="#ffffff"
                  />
                </StyleShape>
              </Pressable>
            </Animated.View>
          }>
          <StyledSearchBar
            marginRight={12}
            placeholder="Search items..."
            flex={1}
            onTextChange={query => updateMenuQuery(query)}
          />
        </RenderHeader>
      </StyledPage.Header.Full>

      <Stack flex={1.5} horizontal>
        <SideBarAdapter selectedMenu={5} showMenu={false} collapse={true} />
        <Stack flex={3} gap={8} marginLeft={8} marginRight={12} vertical>
          <ItemCard
            ref={itemCardRef}
            onRequestAdd={() => update('Add')}
            shop={shop}
            flag={isFocused}
            onItemDelete={(item_id) => onDeleteItem(item_id)}
            onItemChange={j => setState({...state, tag: j?.tag, data: j?.data})}
            onAddonChange={j => setShowAddOn(j)}
          />
        </Stack>
      </Stack>
      <StyledDrawer
        visible={shouldOpen ? true : false}
        onClose={() => reset()}
        title={`${state.tag === 'Edit' ? 'Edit' : 'Add'} Item `}
        width={'30%'}
         colors={{
          background: t.bgCard,
        }}
        side="right">
        <ItemForm item={state?.data} onClose={() => reset()} />
      </StyledDrawer>
      <StyledDrawer
        visible={showAddOn ? true : false}
        onClose={() => setShowAddOn(false)}
        title={`${showAddOn?.name} `}
        subtitle={'AddOns'}
        width={'30%'}
        side="right"
        colors={{
          background: t.bgCard,
        }}>
        <ItemAddOn
          menu_id={showAddOn?.menu_id}
          onClose={() => setShowAddOn(false)}
        />
      </StyledDrawer>
    </StyledPage>
  );
};

export default BigItem;