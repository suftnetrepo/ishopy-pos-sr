import React, {useState, useEffect} from 'react';
import {
  StyledCycle,
  Stack,
  StyleShape,
  StyledPage,
  Drawer,
  toastService,
  useDialogue,
} from 'fluent-styles';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import CategoryCard from './card';
import CategoryForm from './form/form';
import {useFocus} from '../../../hooks/useFocus';
import {StyledIcon} from '../../../components/package/icon';
import {Pressable} from 'react-native';
import {useCategory, useDeleteCategory} from '../../../hooks/useCategory';
import {useLoaderAndError} from '../../../hooks/useLoaderAndError';
import {useAppTheme} from '../../../theme';

const BigCategory = () => {
  const dialogue = useDialogue();
  const {deleteCategory} = useDeleteCategory();
  const navigationFocus = useFocus();
  const [state, setState] = useState({
    data: null,
    tag: '',
  });
  const {t} = useAppTheme();
  const [screenFocus, setScreenFocus] = useState(true);
  const shouldOpen = state.tag === 'Edit' || state.tag === 'Add';
  const isFocused = navigationFocus && screenFocus;
  const {data, error, loading,  resetHandler, loadCategories} = useCategory(isFocused);

  useLoaderAndError(loading, error, resetHandler);

  useEffect(() => {
    if (state.tag) {
      setScreenFocus(false);
    } else {
      setScreenFocus(true);
    }
  }, [state.tag]);

  const onDelete = async category_id => {
    const id = dialogue.show({
      title: 'Delete Category?',
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
            deleteCategory(category_id).then(async result => {
              onNotify({status: 'deleted'});
              await loadCategories();
            });
          },
        },
      ],
    });
  };

  const onNotify = ({status, t}) => {
    toastService.show({
      message: `Category ${status}`,
      description: `Your category was ${status} successfully.`,
      variant: 'success',
      duration: 2500,
      theme: 'light',
    });
  };

  const reset = () => {
    setState({...state, tag: '', data: null});
  };

  const update = tag => {
    setState({...state, tag, data: null});
  };

  return (
    <StyledPage backgroundColor={t.bgPage}>
      <StyledPage.Header.Full>
        <RenderHeader
          showBackButton={true}
          showLogo={false}
          showTitle={true}
          title="Categories"
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
          <CategoryCard
            data={data}
            onCategoryDelete={async j => await onDelete(j)}
            onCategoryChange={j =>
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
        <CategoryForm category={state?.data} onClose={() => reset()} />
      </Drawer>
    </StyledPage>
  );
};

export default BigCategory;
