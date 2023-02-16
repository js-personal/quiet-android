/************************************
 *
 * 2023 Jérémy Sarteur
 *
 */

import type { SetStateAction, MemoExoticComponent } from 'react';
import React, { Dispatch, memo, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Text, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { ISequencer, TEntryFrameProps, TDynamicStyles } from './rn-sequencer.types';
import SequencerCore from './rn-sequencer';


type TEntryBaseSequencerProps = {
    children?: React.ReactNode;
    frames: TEntryFrameProps[];
    infinite?: boolean;
    play?: boolean;
    restartAfterDisable?: boolean;
    style?: StyleProp<ViewStyle | TextStyle> & TDynamicStyles;
}

const defaultProps = {
    children: undefined,
    infinite: false,
    frames: [],
    play: true,
    restartAfterDisable: false,
    style: {} as StyleProp<ViewStyle | TextStyle> & TDynamicStyles
};

export function useDefaultProps(props: TEntryBaseSequencerProps ): TEntryBaseSequencerProps{
    return {
        ...defaultProps,
        ...props
    };
}

type SequencerComponent = MemoExoticComponent<React.ForwardRefExoticComponent<TEntryBaseSequencerProps>>

type TAnimatedWrapper = Animated.AnimatedComponent<TDynamicStyles & React.PropsWithChildren<TSubWrapper>>;
type TSubWrapper = React.ComponentType<any>;

const SequencerComponentFactory = (AnimatedWrapper: TAnimatedWrapper, SubWrapper: TSubWrapper): SequencerComponent =>  {

    const SequencerComponent = memo(React.forwardRef((props: TEntryBaseSequencerProps, ref) => {
        const { children, frames, infinite, play, restartAfterDisable } = useDefaultProps(props);
        const opacityValue = useRef(new Animated.Value(0)).current;
        const movementValue = useRef(new Animated.Value(0)).current;

        const [animatedStyles, setAnimatedStyles]: [TDynamicStyles, Dispatch<SetStateAction<TDynamicStyles>>] = useState({
            opacity: opacityValue,
        } as TDynamicStyles);

        const sequencer: ISequencer = useMemo(
            () => new SequencerCore(frames, animatedStyles, setAnimatedStyles, { infinite, restartAfterDisable }, { opacityValue, movementValue }),
            []
        );

        useEffect(() => {
            if (play) {
                sequencer.run();
            }
            else {
                sequencer.stop();
            }
        }, [play]);

        return <AnimatedWrapper style={[animatedStyles]} ref={ref}><SubWrapper style={props.style}>{children}</SubWrapper></AnimatedWrapper>;
    }), (prevProps: TEntryBaseSequencerProps, nextProps: TEntryBaseSequencerProps) => prevProps.play === nextProps.play);

    return SequencerComponent;
};


/**
 * New Sequencer Component
 * Sequencer.Text | Sequencer.View 
 * @params play = boolean (dynamic)
 * @params children = JSX.Element
 * @params frames = TEntryFrameProps[]
 * @params infinite = boolean
 * @params restartAfterDisable = boolean
 */

type TSequencerTypes = {
    View: SequencerComponent,
    Text: SequencerComponent,
}

export const SequencerTypes: TSequencerTypes = {
    View: SequencerComponentFactory(Animated.View, View),
    Text: SequencerComponentFactory(Animated.Text, Text),
}

export default SequencerTypes;