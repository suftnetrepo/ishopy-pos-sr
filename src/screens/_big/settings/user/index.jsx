import React, { useState, useEffect } from 'react';
import {
    StyledSafeAreaView,
    StyledHeader,
    StyledCycle
} from 'fluent-styles';
import { Stack } from '../../../../components/package/stack';
import { theme } from '../../../../utils/theme';
import SideBarAdapter from '../../../../components/tablet/sideBar/sideBarAdapter';
import RenderHeader from '../../../../components/tablet/header';
import Drawer from '../../../../components/package/drawer';
import UserCard from '../user/card';
import UserForm from '../user/form/form';
import { useFocus } from '../../../../hooks/useFocus';
import { StyledIcon } from '../../../../components/package/icon';
import { Pressable } from 'react-native';
import { useAppContext } from '../../../../hooks/appContext';

const BigUser = () => {
    const { user } = useAppContext();
    const navigationFocus = useFocus()
    const [state, setState] = useState({
        data: null,
        tag: ''
    });
    const [screenFocus, setScreenFocus] = useState(true);
    const shouldOpen = (state.tag === 'Edit' || state.tag === 'Add')
    const isFocused = navigationFocus && screenFocus;

    useEffect(() => {
        if (state.tag) {
            setScreenFocus(false);
        } else {
            setScreenFocus(true);
        }
    }, [state.tag]);

    const reset = () => {
        setState({ ...state, tag: '', data: null })
    }

    const update =(tag)=> {
         setState({ ...state, tag, data: null })
    }

    return (
        <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
            <StyledHeader borderRadius={30} statusProps={{ translucent: true, hidden: false }}>
                <StyledHeader.Full>
                    <RenderHeader
                        showBackButton={true}
                        showLogo={false}
                        showTitle={true}
                        title='User'
                        CopyIcon={
                            <Pressable onTouchStart={() => update('Add')}>
                                <StyledCycle width={48} height={48} borderWidth={1} backgroundColor={theme.colors.yellow[500]} borderColor={theme.colors.yellow[500]}>
                                    <StyledIcon size={24} name='add' color={theme.colors.gray[800]} />
                                </StyledCycle>
                            </Pressable>
                        }
                    />
                </StyledHeader.Full>
            </StyledHeader>
            <Stack flex={1.5} horizonal>
                <SideBarAdapter selectedMenu={5} showMenu={false} collapse={true} />
                <Stack flex={3} gap={8} marginLeft={8} marginRight={16} vertical>
                    <UserCard user_id={user?.user_id} flag={isFocused} onUserDeleting={() => update('Deleting')} onUserDeleted={() => reset()} onUserChange={(j) => setState({ ...state, tag: j?.tag, data: j?.data })} />
                </Stack>
            </Stack>
            <Drawer
                direction="right"
                isOpen={shouldOpen}
                onClose={() => reset()}
            >
                {
                    shouldOpen && <UserForm user={state?.data} onClose={() => reset()} />
                }
            </Drawer>
        </StyledSafeAreaView>
    );
};

export default BigUser;