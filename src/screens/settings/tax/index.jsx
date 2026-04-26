import React, {useState, useEffect} from 'react';
import {Drawer, StyledPage, StyledCycle} from 'fluent-styles';
import {Stack} from '../../../components/package/stack';
import {theme} from '../../../utils/theme';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';

import TaxCard from '../tax/card';
import TaxForm from '../tax/form/form';
import { useDeleteTax, useTaxes } from '../../../hooks/useTax';
import { useLoaderAndError } from '../../../hooks/useLoaderAndError';
import { toastService, useDialogue } from 'fluent-styles';
import {useFocus} from '../../../hooks/useFocus';
import {StyledIcon} from '../../../components/package/icon';
import {Pressable} from 'react-native';

const BigTax = () => {
  const navigationFocus = useFocus();
  const dialogue = useDialogue();
  const { deleteTax } = useDeleteTax();
  const { data, error, loading, resetHandler, loadTaxes } = useTaxes(isFocused);
    useLoaderAndError(loading, error, resetHandler);
  const [state, setState] = useState({
    data: null,
    tag: '',
  });
  const [screenFocus, setScreenFocus] = useState(true);
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

  const onTaxDelete = async (tax_id) => {
    const id = dialogue.show({
      title: 'Delete Tax?',
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
            await deleteTax(tax_id);
            toastService.show({
              message: 'Tax deleted',
              description: 'The tax was deleted successfully.',
              variant: 'success',
              duration: 2500,
              theme: 'light',
            });
            await loadTaxes();
            dialogue.dismiss(id);
          },
        },
      ],
    });
  };

  return (
    <StyledPage backgroundColor={theme.colors.gray[100]}>
      <StyledPage.Header.Full>
        <RenderHeader
          showBackButton={true}
          showLogo={false}
          showTitle={true}
          title="Taxes"
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
          }
        />
      </StyledPage.Header.Full>

      <Stack flex={1.5} horizontal>
        <SideBarAdapter selectedMenu={5} showMenu={false} collapse={true} />
        <Stack flex={3} gap={8} marginHorizontal={16} vertical>
          <TaxCard
            data={data}
            flag={isFocused}
            onTaxDelete={onTaxDelete}
            onTaxChange={j => setState({...state, tag: j?.tag, data: j?.data})}
          />
        </Stack>
      </Stack>
    
       <Drawer
        visible={shouldOpen ? true : false}
        onClose={() => reset()}
        title={`${state.tag === 'Edit' ? 'Edit' : 'Add'} Category `}
        width={'30%'}
        colors={{
          background: theme.colors.gray[100],
        }}
        side="right">
       <TaxForm tax={state?.data} onClose={() => reset()} />
      </Drawer>
    </StyledPage>
  );
};

export default BigTax;
