import React from 'react';
import { useState, useMemo, memo, cloneElement } from 'react';
import { Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import BasePresentationSliders from '@components/BasePresentationSliders';
import BaseSlide from '@components/BaseSlide';
import Welcome from './slides/Welcome';
import SecureInside from './slides/SecureInside';
import SecureOutside from './slides/SecureOutside';
import SecureAdvanced from './slides/SecureAdvanced';
import AcceptCGU from './slides/AcceptCGU';

const { width, height } = Dimensions.get('window');

type TSlide = {
    name: string,
    component: JSX.Element,
}

type TSlides = TSlide[]


const Slide = memo(({ children, index, active } : { children: JSX.Element, index: number, active?: number }) => {
    const child = cloneElement(children, {enable: active === index}, null);
    // console.log('Re-render slide : '+ index);
    // console.log('> active: '+ (active === index ? 'true': 'false'))
    return <BaseSlide
                width={width}
                height={height}
                active={false}
                index={index}
                children={child}
            />
}, (prev, next) => {
    return ((prev.active === prev.index) === (next.active === next.index));
})


export default function Presentation() {
    const Theme = useTheme();
    const [ viewPagination, setViewPagination ] = useState(false);
    const [ activeSlide, setActiveSlide ] = useState(0);

    const enablePagination = () => {
        if (!viewPagination) setViewPagination(true);
    }

    const onChangeSlide = (index: number | undefined) => {
        if (index !== undefined && index !== activeSlide) setActiveSlide(index);
    }

    console.log('RERENDER Présentation');
    const slides =
     useMemo(() => ( 
        [
            {
                name: 'welcome',
                component: <Slide index={0} active={activeSlide}><Welcome onFinishAnimation={enablePagination} /></Slide>,
            },
            {
                name: 'secure-from-inside',
                component: <Slide index={1} active={activeSlide}><SecureInside /></Slide>,
            },
            {
                name: 'secure-from-outside',
                component: <Slide index={2} active={activeSlide}><SecureOutside /></Slide>,
            },
            {
                name: 'secure-advanced',
                component: <Slide index={3} active={activeSlide}><SecureAdvanced /></Slide>,
            },
            {
                name: 'continue-accept-cgu',
                component: <Slide index={4} active={activeSlide}><AcceptCGU /></Slide>,
            },
    ]
    ), [activeSlide]);
    

    return <BasePresentationSliders
        slides={slides}
        slideWidth={width}
        slideHeight={height}
        paginationEnabled={viewPagination}
        paginationAppearSequences={[
            {
                sequences: [
                    {
                        type: 'slide',
                        from: [0, 200],
                        duration: 1000,
                    }
                ]
            }
        ]}
        dotActive={{
            backgroundColor: Theme.colors.primary,
            height: 10,
            width: 10,
        }}
        dotInactive={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            height: 5,
            width: 5,
            marginTop: 2
        }}
        onChangeSlide={onChangeSlide}
    />;
}
