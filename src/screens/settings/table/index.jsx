import React, {useState, useEffect} from 'react';
import {
  StyledCycle,
  Stack,
  theme,
  StyledPage,
  Drawer,
  toastService,
  useDialogue,
} from 'fluent-styles';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import TableCard from './card';
import TableForm from './form';
import {useFocus} from '../../../hooks/useFocus';
import {StyledIcon} from '../../../components/package/icon';
import {Pressable} from 'react-native';
import {useTables, useDeleteTable} from '../../../hooks/useTable';
import {useLoaderAndError} from '../../../hooks/useLoaderAndError';

const BigTableScreen = () => {
  const dialogue = useDialogue();
  const {deleteTable} = useDeleteTable();
  const navigationFocus = useFocus();
  const [state, setState] = useState({
    data: null,
    tag: '',
  });
  const [screenFocus, setScreenFocus] = useState(true);
  const shouldOpen = state.tag === 'Edit' || state.tag === 'Add';
  const isFocused = navigationFocus && screenFocus;
  const {data, error, loading,  resetHandler, loadTables} = useTables(isFocused);

  useLoaderAndError(loading, error, resetHandler);

  useEffect(() => {
    if (state.tag) {
      setScreenFocus(false);
    } else {
      setScreenFocus(true);
    }
  }, [state.tag]);

  const onDelete = async table_id => {
    const id = dialogue.show({
      title: 'Delete Table?',
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
          onPress: async () => {
            deleteTable(table_id).then(async result => {
              onNotify({status: 'deleted'});
              await loadTables();
            });
          },
        },
      ],
    });
  };

  const onNotify = ({status}) => {
    toastService.show({
      message: `Table ${status}`,
      description: `Your table was ${status} successfully.`,
      variant: 'success',
      duration: 2500,
      theme: 'light',
    });
  };

  const reset = async () => {
    console.log('Resetting state and reloading tables');
    setState({...state, tag: '', data: null});
    resetHandler();
      await loadTables();
  };

  const update = tag => {
    setState({...state, tag, data: null});
  };

  return (
    <StyledPage backgroundColor={theme.colors.gray[100]}>
      <StyledPage.Header.Full>
        <RenderHeader
          showBackButton={true}
          showLogo={false}
          showTitle={true}
          title="Tables"
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
          <TableCard
            data={data}
            onTableDelete={async j => await onDelete(j)}
            onTableChange={j =>
              setState({...state, tag: j?.tag, data: j?.data})
            }
          />
        </Stack>
      </Stack>
      <Drawer
        visible={shouldOpen ? true : false}
        onClose={() => reset()}
        title={`${state.tag === 'Edit' ? 'Edit' : 'Add'} Table `}
        width={'30%'}
        colors={{
          background: theme.colors.gray[100],
        }}
        side="right">
        <TableForm table={state?.data} onClose={() => reset()} />
      </Drawer>
    </StyledPage>
  );
};

export default BigTableScreen;
