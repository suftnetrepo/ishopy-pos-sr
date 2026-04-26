import React, {useState, useEffect} from 'react';
import {
  StyledCycle,
  Stack,
  theme,
  StyledPage,
  Drawer as StyledDrawer,
  useDialogue,
  toastService
} from 'fluent-styles';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import {StyledSearchBar} from '../../../components/searchBar';
import ItemCard from '../item/card';
import ItemForm from '../item/form/form';
import {useFocus} from '../../../hooks/useFocus';
import {StyledIcon} from '../../../components/package/icon';
import {Pressable} from 'react-native';
import {useAppContext} from '../../../hooks/appContext';
import ItemAddOn from './addOn';
import {useDeleteAddOn} from '../../../hooks/useAddon';
import { useDeleteMenu } from '../../../hooks/useMenu';

const BigItem = () => {
  const dialogue = useDialogue();
  const {shop, updateMenuQuery} = useAppContext();
  const {deleteAddOn} = useDeleteAddOn();
  const {deleteMenu} = useDeleteMenu();
  const navigationFocus = useFocus();
  const [state, setState] = useState({
    data: null,
    tag: '',
  });
  const [screenFocus, setScreenFocus] = useState(true);
  const [showAddOn, setShowAddOn] = useState(null);
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

  const onDeleteAddon = async addOn_id => {
    const id = dialogue.show({
      title: 'Delete addon?',
      message: 'This action cannot be undone.',
      icon: '⚠️',
      theme: 'light',
      actions: [
        {
          label: 'Delete',
          variant: 'destructive',
          onPress: () => {
            deleteAddOn(addOn_id).then(async result => {
              onNotify({status: 'deleted'});
            });
          },
        },
        {
          label: 'Keep it',
          variant: 'secondary',
          onPress: () => {
            dialogue.dismiss(id);
          },
        },
      ],
    });
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

   const onNotify = ({status}) => {
    toastService.show({
      message: `Item ${status}`,
      description: `Your item was deleted successfully.`,
      variant: 'success',
      duration: 2500,
      theme: 'light',
    });
  };

  return (
    <StyledPage backgroundColor={theme.colors.gray[100]}>
      <StyledPage.Header.Full>
        <RenderHeader
          showBackButton={true}
          showLogo={false}
          showTitle={true}
          title="Items"
          CopyIcon={
            <Pressable onTouchStart={() => update('Add')}>
              <StyledCycle
                width={48}
                height={48}
                borderWidth={1}
                backgroundColor={theme.colors.yellow[500]}
                borderColor={theme.colors.yellow[500]}>
                <StyledIcon
                  size={24}
                  name="add"
                  color={theme.colors.gray[800]}
                />
              </StyledCycle>
            </Pressable>
          }>
          <StyledSearchBar
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
          background: theme.colors.gray[100],
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
