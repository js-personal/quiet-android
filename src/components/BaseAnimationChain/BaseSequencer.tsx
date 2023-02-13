import { Dispatch, memo, PropsWithChildren, SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import { Animated, Easing, EasingFunction } from 'react-native';
import { TDynamicStyles } from './libs/rn-sequencer';
import CoreSequencer, { ISequencer, TEntryFrameProps } from './libs/rn-sequencer';


interface Props extends PropsWithChildren<any> {
    children: JSX.Element | undefined;
    frames: TEntryFrameProps[];
    infinite?: boolean;
    play?: boolean;
    restartAfterDisable?: boolean;
}

const defaultProps: Props = {
    children: undefined,
    infinite: false,
    frames: [] as TEntryFrameProps[],
    play: true,
    restartAfterDisable: false,
};



const BaseSequencer: React.FC<Props> = memo(({ children, frames, infinite, play, restartAfterDisable }: Props) => {

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

    return <Animated.View style={[styles]}>{children}</Animated.View>;

},(prev, next) => (prev.play === next.play && prev.infinite === next.infinite));

BaseSequencer.defaultProps = defaultProps;

export default BaseSequencer;
