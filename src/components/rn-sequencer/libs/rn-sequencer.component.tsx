/************************************
 * 
 * 2023 Jérémy Sarteur
 *  *
 */

import type { SetStateAction, MemoExoticComponent } from 'react';
import React, { Dispatch, memo, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import type { ISequencer, TEntryFrameProps,TDynamicStyles } from './rn-sequencer.types';
import SequencerCore from './rn-sequencer';
import { ReactElement } from 'react';


type TEntryBaseSequencerProps = {
    children: JSX.Element  | undefined;
    frames: TEntryFrameProps[];
    infinite?: boolean;
    play?: boolean;
    restartAfterDisable?: boolean;
    style?: React.CSSProperties;
}

const defaultProps: TEntryBaseSequencerProps = {
    children: undefined,
    infinite: false,
    frames: [] as TEntryFrameProps[],
    play: true,
    restartAfterDisable: false,
    style: {} as React.CSSProperties,
};



export function useDefaultProps<P extends object>(
    props: P,
  ): P & TEntryBaseSequencerProps {
    return {
      ...defaultProps,
      ...props
    };
  }


type SequencerComponent<T> = MemoExoticComponent<Animated.AnimatedComponent<T>>

 type TSequencerComponentFactory<A, S> = (AnimatedWrapped: A, SubWrapper: S) => SequencerComponent<S>


const  SequencerComponentFactory = <A extends React.ComponentType<{}>,S extends React.ComponentType<{}>>(AnimatedWrapper: A, SubWrapper: S): TSequencerComponentFactory<A, S> => {


   return React.memo(React.forwardRef((props: TEntryBaseSequencerProps, ref) => {
        const { children, frames, infinite, play, restartAfterDisable } = useDefaultProps(props);
        const opacityValue = useRef(new Animated.Value(0)).current
        const movementValue = useRef(new Animated.Value(0)).current
    
        const [ styles, setStyles ]: [TDynamicStyles, Dispatch<SetStateAction<TDynamicStyles>>] = useState({
            opacity: opacityValue,
        } as TDynamicStyles);
    
        const sequencer : ISequencer = useMemo(
            () => new SequencerCore(frames, styles, setStyles, { infinite, restartAfterDisable }, {opacityValue, movementValue}), 
            []
        );
    
        useEffect(() => {
            if (play) {
                sequencer.run();
            }
            else {
                sequencer.stop();
            }
        }, [play])

        return <AnimatedWrapper style={styles} ref={ref}><SubWrapper style={props.style}>{props.children}</SubWrapper></AnimatedWrapper>
     }), (prevProps: TEntryBaseSequencerProps, nextProps: TEntryBaseSequencerProps) => prevProps.play === nextProps.play)
    
    }
    

 /**
   * New Sequencer Component
   * View | Text
   * @params play = boolean (dynamic)
   * @params children = JSX.Element
   * @params frames = TEntryFrameProps[]
   * @params infinite = boolean
   * @params restartAfterDisable = boolean
   */
type TSequencerTypes = {
    View: SequencerComponent<View>,
    Text: SequencerComponent<Text>,
}

export const SequencerTypes: TSequencerTypes = {
    View: SequencerComponentFactory(Animated.View, View),
    Text: SequencerComponentFactory(Animated.View, Text),
}

export default SequencerTypes;
