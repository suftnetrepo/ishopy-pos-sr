import React, {useState, useEffect} from 'react';
import {
  Drawer,
  StyledCycle,
  Stack,
  theme,
  StyledPage,
  toastService,
  useDialogue
} from 'fluent-styles';
import SideBarAdapter from '../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../components/tablet/header';
import UserCard from '../user/card';
import UserForm from '../user/form/form';
import {useFocus} from '../../../hooks/useFocus';
import {StyledIcon} from '../../../components/package/icon';
import {Pressable} from 'react-native';
import {useAppContext} from '../../../hooks/appContext';
import {useDeleteUser, useUsers} from '../../../hooks/useUser';
import {useLoaderAndError} from '../../../hooks/useLoaderAndError';
import usePremium from '../../../hooks/usePremium';
import {useAppTheme} from '../../../theme';

const BigUser = () => {
  const dialogue = useDialogue();
  const {user} = useAppContext();
  const {t} = useAppTheme();
  const navigationFocus = useFocus();
  const [state, setState] = useState({
    data: null,
    tag: '',
  });
  const [screenFocus, setScreenFocus] = useState(true);
  const shouldOpen = state.tag === 'Edit' || state.tag === 'Add';
  const isFocused = navigationFocus && screenFocus;

  const {checkLimit} = usePremium();
  const {data, error, loading, resetHandler, loadUsers} = useUsers(isFocused);
  const {deleteUser} = useDeleteUser();

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

  const onUserDelete = async user_id => {
    const id = dialogue.show({
      title: 'Delete User?',
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
            await deleteUser(user_id);
            toastService.show({
              message: 'User deleted',
              description: 'The user was deleted successfully.',
              variant: 'success',
              duration: 2500,
              theme: 'light',
            });
            await loadUsers();
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
          title="Users"
          CopyIcon={
            <Pressable onTouchStart={() => { if (checkLimit('users', data?.length || 0)) update('Add'); }}>
              <StyledCycle
                width={48}
                height={48}
                borderWidth={1}
                backgroundColor={t.brandPrimary}
                borderColor={t.brandPrimary}>
                <StyledIcon
                  size={24}
                  name="add"
                  color={t.textPrimary}
                />
              </StyledCycle>
            </Pressable>
          }
        />
      </StyledPage.Header.Full>

      <Stack flex={1.5} horizontal>
        <SideBarAdapter selectedMenu={5} showMenu={false} collapse={true} />
        <Stack flex={3} gap={8} marginLeft={8} marginRight={16} vertical>
          <UserCard
            data={data}
            user_id={user?.user_id}
            flag={isFocused}
            onUserDelete={j => onUserDelete(j)}
            onUserChange={j => setState({...state, tag: j?.tag, data: j?.data})}
          />
        </Stack>
      </Stack>

      <Drawer
        visible={shouldOpen ? true : false}
        onClose={() => reset()}
        title={`${state.tag === 'Edit' ? 'Edit' : 'Add'} User `}
        width={'30%'}
        colors={{
          background: t.bgPage,
        }}
        side="right">
        <UserForm user={state?.data} onClose={() => reset()} />
      </Drawer>
    </StyledPage>
  );
};

export default BigUser;