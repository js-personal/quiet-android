import type { SetStateAction, MemoExoticComponent } from 'react';
import type { ISequencer, TEntryFrameProps,TDynamicStyles } from './types';
import { Dispatch, memo, useEffect, useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';

import CoreSequencer from './class';

console.log(CoreSequencer);
type TEntryBaseSequencerProps = {
    children: JSX.Element | undefined;
    frames: TEntryFrameProps[];
    infinite?: boolean;
    play?: boolean;
    restartAfterDisable?: boolean;
}

const defaultProps: TEntryBaseSequencerProps = {
    children: undefined,
    infinite: false,
    frames: [] as TEntryFrameProps[],
    play: true,
    restartAfterDisable: false,
};

function useDefaultProps<P extends object>(
    props: P,
  ): P & TEntryBaseSequencerProps {
    return {
      ...defaultProps,
      ...props
    };
  }

const BaseSequencer: MemoExoticComponent<React.FC<TEntryBaseSequencerProps>> = memo((_props: TEntryBaseSequencerProps) => {
    const { children, frames, infinite, play, restartAfterDisable } = useDefaultProps(_props);
    const opacityValue = useRef(new Animated.Value(0)).current
    const movementValue = useRef(new Animated.Value(0)).current

    const [ styles, setStyles ]: [TDynamicStyles, Dispatch<SetStateAction<TDynamicStyles>>] = useState({
        opacity: opacityValue,
    } as TDynamicStyles);

        const sequencer : ISequencer = useMemo(
            () => new CoreSequencer(frames, styles, setStyles, { infinite, restartAfterDisable }, {opacityValue, movementValue}), 
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

    return <Animated.View style={[styles]}>{children}</Animated.View>

},(prev, next) => (prev.play === next.play && prev.infinite === next.infinite));


export default BaseSequencer;
