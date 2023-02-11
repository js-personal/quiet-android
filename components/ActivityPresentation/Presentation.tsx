import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import RootCSS from '../../assets/root';
import { useTheme } from '@react-navigation/native';
import BasePresentationSliders from '../BasePresentationSliders';
import BaseSlide, { TEntrySlideProps } from '../BaseSlide';
import Welcome from './Welcome';
import SecureInside from './SecureInside';
import SecureOutside from './SecureOutside';
import SecureAdvanced from './SecureAdvanced';
import AcceptCGU from './AcceptCGU';

const { width, height } = Dimensions.get('window');

type TSlide = {
    name: string,
    component: JSX.Element,
}

type TSlides = TSlide[]


const Slide = React.memo(({ children, index, active } : { children: JSX.Element, index: number, active?: number }) => {
    console.log('create slide',index,);
    console.log(index);
    console.log(active);
    console.log(active === index)
    return <BaseSlide
                width={width}
                height={height}
                active={active === index}
                index={index}
                children={children}
            />
}, (prev, next) => {
    return ((prev.active === prev.index) === (next.active === next.index));
})


export default function Presentation() {
    const Theme = useTheme();
    const [ viewPagination, setViewPagination ] = useState(true);
    // const [ slides, setSlides ]: [TSlides, Dispatch<SetStateAction<TSlides>>] = useState([] as TSlides);
    const [ activeSlide, setActiveSlide ] = useState(0);

    const enablePagination = () => {
        if (!viewPagination) setViewPagination(true);
    }

    const onChangeSlide = (index: number | undefined) => {
        if (index !== undefined && index !== activeSlide) setActiveSlide(index);
    }

    const slides = 
        [
            {
                name: 'welcome',
                component: <Slide index={0} active={activeSlide}><Welcome onFinishAnimation={enablePagination} /></Slide>,
            },
            {
                name: 'secure-from-inside',
                component: <Slide index={1} active={activeSlide}><Welcome/></Slide>,
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
    
    // useEffect(() => {
    //     setSlides(
    //     [
    //             {
    //                 name: 'welcome',
    //                 component: <Slide index={0}><Welcome onFinishAnimation={enablePagination} /></Slide>,
    //             },
    //             {
    //                 name: 'secure-from-inside',
    //                 component: <Slide index={1}><Welcome/></Slide>,
    //             },
    //             {
    //                 name: 'secure-from-outside',
    //                 component: <Slide index={2}><SecureOutside /></Slide>,
    //             },
    //             {
    //                 name: 'secure-advanced',
    //                 component: <Slide index={3}><SecureAdvanced /></Slide>,
    //             },
    //             {
    //                 name: 'continue-accept-cgu',
    //                 component: <Slide index={4}><AcceptCGU /></Slide>,
    //             },
    //         ]
    //     )
    // },[activeSlide])
    

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
