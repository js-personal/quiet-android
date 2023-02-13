
import { useState, useMemo, memo, cloneElement } from 'react';
import { Dimensions, Easing } from 'react-native';
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


const Slide = memo(({ children, index, activeSlide } : { children: JSX.Element, index: number, activeSlide?: number }) => {
    const child = cloneElement(children, {enable: activeSlide === index}, null);
    // console.log('Re-render slide : '+ index);
    // console.log('> active: '+ (active === index ? 'true': 'false'))
    return <BaseSlide
                width={width}
                height={height}
                active={activeSlide === index}
                index={index}
                children={child}
            />
}, (prev, next) => {
    return ((prev.activeSlide === prev.index) === (next.activeSlide === next.index));
})


export default function Presentation() {
    const Theme = useTheme();
    const [ viewPagination, setViewPagination ] = useState(false);
    const [ activeSlide, setActiveSlide ] = useState(0);
    // console.log('Render: Presentation ###############################');

    const enablePagination = () => {
        if (!viewPagination) setViewPagination(true);
    }

    const onChangeSlide = (index: number | undefined) => {
        if (index !== undefined && index !== activeSlide) setActiveSlide(index);
    }

    const slides =
     useMemo(() => ( 
        [
            {
                name: 'welcome',
                component: <Slide index={0} activeSlide={activeSlide}><Welcome onFinishAnimation={enablePagination} /></Slide>,
            },
            {
                name: 'secure-from-inside',
                component: <Slide index={1} activeSlide={activeSlide}><Welcome /></Slide>,
            },
            {
                name: 'secure-from-outside',
                component: <Slide index={2} activeSlide={activeSlide}><SecureOutside /></Slide>,
            },
            {
                name: 'secure-advanced',
                component: <Slide index={3} activeSlide={activeSlide}><SecureAdvanced /></Slide>,
            },
            {
                name: 'continue-accept-cgu',
                component: <Slide index={4} activeSlide={activeSlide}><AcceptCGU /></Slide>,
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
                        duration: 2000,
                        easing: Easing.out(Easing.exp)
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
