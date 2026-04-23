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
import TaxCard from '../tax/card';
import TaxForm from '../tax/form/form';
import { useFocus } from '../../../../hooks/useFocus';
import { StyledIcon } from '../../../../components/package/icon';
import { Pressable } from 'react-native';

const BigTax = () => {
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
                        title='Tax'
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
                <Stack flex={3} gap={8} marginHorizontal={16} vertical>
                    <TaxCard flag={isFocused} onTaxDeleting={() => update('Deleting')} onTaxDeleted={() => reset()} onTaxChange={(j) => setState({ ...state, tag: j?.tag, data: j?.data })} />
                </Stack>
            </Stack>
            <Drawer
                direction="right"
                isOpen={shouldOpen}
                onClose={() => reset()}
            >
                {
                    shouldOpen && <TaxForm tax={state?.data} onClose={() => reset()} />
                }
            </Drawer>
        </StyledSafeAreaView>
    );
};

export default BigTax;