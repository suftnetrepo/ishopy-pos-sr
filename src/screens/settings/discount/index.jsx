import React, {useState, useEffect} from 'react';
import {
  StyledSafeAreaView,
  Drawer,
  StyleShape,
  Stack,
  theme,
  StyledPage,
} from 'fluent-styles';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import DiscountCard from '../discount/card';
import DiscountForm from '../discount/form/form';
import {useDeleteDiscount, useDiscounts} from '../../../hooks/useDiscount';
import {useLoaderAndError} from '../../../hooks/useLoaderAndError';
import {toastService, useDialogue} from 'fluent-styles';
import {useFocus} from '../../../hooks/useFocus';
import {StyledIcon} from '../../../components/package/icon';
import {Pressable} from 'react-native';
import {useAppTheme} from '../../../theme';

const BigDiscount = () => {
  const navigationFocus = useFocus();
  const dialogue = useDialogue();
  const {deleteDiscount} = useDeleteDiscount();
  const {data, error, loading, resetHandler, loadDiscount} =
    useDiscounts(true);
  const [state, setState] = useState({
    data: null,
    tag: '',
  });
  const {t} = useAppTheme();
  const [screenFocus, setScreenFocus] = useState(true);
  const shouldOpen = state.tag === 'Edit' || state.tag === 'Add';
  const isFocused = navigationFocus && screenFocus;

  useLoaderAndError(loading, error, resetHandler);

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

  const onDiscountDelete = async discount_id => {
    const id = dialogue.show({
      title: 'Delete Discount?',
      message: 'This action cannot be undone.',
      icon: '\u26a0\ufe0f',
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
          onPress: async () => {
            await deleteDiscount(discount_id);
            toastService.show({
              message: 'Discount deleted',
              description: 'The discount was deleted successfully.',
              variant: 'success',
              duration: 2500,
              theme: 'light',
            });
            await loadDiscount();
            dialogue.dismiss(id);
          },
        },
      ],
    });
  };

  return (
    <StyledPage backgroundColor={t.bgPage}>
      <StyledPage.Header.Full>
        <RenderHeader
          showBackButton={true}
          showLogo={false}
          showTitle={true}
          title="Discounts"
          CopyIcon={
            <Pressable onTouchStart={() => update('Add')}>
              <StyleShape
                cycle
                size={48}
                borderWidth={1}
                backgroundColor={t.brandPrimary}
                borderColor={t.brandPrimary}>
                <StyledIcon
                  pointerEvents="none"
                  size={24}
                  name="add"
                  color={t.textPrimary}
                />
              </StyleShape>
            </Pressable>
          }
        />
      </StyledPage.Header.Full>

      <Stack flex={1.5} horizontal>
        <SideBarAdapter selectedMenu={5} showMenu={false} collapse={true} />
        <Stack flex={3} gap={8} marginHorizontal={16} vertical>
          <DiscountCard
            data={data}
            flag={isFocused}
            onDiscountDelete={onDiscountDelete}
            onDiscountChange={j =>
              setState({...state, tag: j?.tag, data: j?.data})
            }
          />
        </Stack>
      </Stack>

      <Drawer
        visible={shouldOpen ? true : false}
        onClose={() => reset()}
        title={`${state.tag === 'Edit' ? 'Edit' : 'Add'} Category `}
        width={'30%'}
        colors={{
          background: t.bgPage,
        }}
        side="right">
        <DiscountForm discount={state?.data} onClose={() => reset()} />
      </Drawer>
    </StyledPage>
  );
};

export default BigDiscount;
