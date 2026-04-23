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
import CategoryCard from './card';
import CategoryForm from './form/form';
import { useFocus } from '../../../../hooks/useFocus';
import { StyledIcon } from '../../../../components/package/icon';
import { Pressable } from 'react-native';

const BigCategory = () => {
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
                        title='Category'
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
                    <CategoryCard flag={isFocused} onCategoryDeleting={() => update('Deleting')} onCategoryDeleted={() => reset()} onCategoryChange={(j) => setState({ ...state, tag: j?.tag, data: j?.data })} />
                </Stack>
            </Stack>
            <Drawer
                direction="right"
                isOpen={shouldOpen}
                onClose={() => reset()}
            >
                {
                    shouldOpen && <CategoryForm category={state?.data} onClose={() => reset()} />
                }
            </Drawer>
        </StyledSafeAreaView>
    );
};

export default BigCategory;