
import { Dispatch, memo, PropsWithChildren, SetStateAction, useEffect, useRef, useState } from 'react';
import { Animated, Easing, EasingFunction } from 'react-native';

const EntryAnimationSequenceType = ['fade','slide'] as const;
type TEntryAnimationSequenceType = (typeof EntryAnimationSequenceType)[number];
const EntryAnimationSequenceFadePropsOptions = ['out', 'in'] as const;
type TEntryAnimationSequenceFadePropsOptions = (typeof EntryAnimationSequenceFadePropsOptions)[number];

type TEntryAnimationSequenceFadeProps = {
    type: 'fade'
    mode: TEntryAnimationSequenceFadePropsOptions[number];
    duration?: number;
    delay?: number;
    easing?: EasingFunction;
    useNativeDriver?: boolean;
};

type TEntryAnimationSequenceSlideProps = {
    type: 'slide'
    from?: (number | undefined)[];
    to?: (number | undefined)[];
    duration: number;
    delay?: number;
    easing?: EasingFunction;
    useNativeDriver?: boolean;
};

export type TEntryAnimationsSequences = (TEntryAnimationSequenceSlideProps | TEntryAnimationSequenceFadeProps)[]

export type TEntryAnimationProps = {
    sequences: TEntryAnimationsSequences;
    disableChildrenWhenTerminated?: boolean;
    onStart?: Function;
    onFinish?: Function;
};

type TSequenceOptions = {
    // disableChildrenWhenTerminated?: boolean;
};

type TSequenceFade = {
    type: 'fade'
    animation: Animated.TimingAnimationConfig;
    options?: TSequenceOptions;
    fromValue: number;
};

type TSequenceSlide = {
    type: 'slide'
    animation: Animated.TimingAnimationConfig;
    options?: TSequenceOptions;
    outputRangeY: [number,number],
    outputRangeX: [number,number],
}

type TSequence = TSequenceFade | TSequenceSlide;

type TAnimationOptions= {
    disableChildrenWhenTerminated: boolean; 
    onStart: Function | null; 
    onFinish: Function | null; 
}

type TAnimation = {
    options: TAnimationOptions
    sequences: TSequence[]
    sequencesLength: number
}

type TSequencer = TAnimation[] | [];

type TStyles = {
    opacity?: Animated.Value;
    translateX?: Animated.AnimatedInterpolation<string | number>;
    translateY?: Animated.AnimatedInterpolation<string | number>;
};

interface Props extends PropsWithChildren<any> {
    children: JSX.Element | undefined;
    animations: TEntryAnimationProps[];
    infinite?: boolean;
    disabled?: boolean;
}

const defaultProps: Props = {
    children: undefined,
    infinite: false,
    animations: [] as TEntryAnimationProps[],
    disabled: false,
};

const newFrameFade = (props: TEntryAnimationSequenceFadeProps): TSequenceFade => {
    const fromValue = props.mode === 'in' ? 0 : 1;

    return {
        type: 'fade',
        fromValue: fromValue,
        animation: {
            delay: props.delay || 0,
            duration: props.duration || 500,
            easing: props.easing || Easing.linear,
            toValue: props.mode === 'in' ? 1 : 0,
            useNativeDriver: props.useNativeDriver || true,
        },
    }
};

const newFrameSlide = (props: TEntryAnimationSequenceSlideProps): TSequenceSlide => {
    let fromX, fromY, toX, toY;
    if (props.from) {
        fromX = props.from[0];
        fromY = props.from[1];
    }
    if (props.to) {
        toX = props.to[0];
        toY = props.to[1];
    }
    return {
        type: 'slide',
        outputRangeY: props.from ? [fromY || 0, 0] : [0, toY || 0],
        outputRangeX: props.from ? [fromX || 0, 0] : [0, toX || 0],
        animation: {
            delay: props.delay || 0,
            duration: props.duration || 500,
            easing: props.easing || Easing.linear,
            toValue: 1,
            useNativeDriver: props.useNativeDriver || true,
        },
    }
};

const prepareSequence = (sequence: TEntryAnimationSequenceSlideProps | TEntryAnimationSequenceFadeProps): TSequence => {
    if (sequence.type === 'fade') {
        return newFrameFade(sequence);
    } else {
        return newFrameSlide(sequence);
    } 
}

const BaseAnimationChain: React.FC<Props> = memo(({ children, animations, infinite, disabled }: Props) => {
    
    const sequencer: TSequencer = [] as TAnimation[];
    
    const [styles, setStyles]: [TStyles, Dispatch<SetStateAction<{}>>] = useState({});

    const [frame, setFrame]: [number, Dispatch<SetStateAction<number>>] = useState(0);

    const opacityValue = new Animated.Value(0)
    const movementValue = new Animated.Value(0)

    const initSequencer = () => {
        for (let [_, animation] of Object.entries(animations)) {
            const AnimationFrame: TAnimation = {
                options: {
                    disableChildrenWhenTerminated: animation.disableChildrenWhenTerminated || false,
                    onStart: animation.onStart || null,
                    onFinish: animation.onFinish || null,
                },
                sequences: animation.sequences.map((e: TEntryAnimationSequenceSlideProps | TEntryAnimationSequenceFadeProps) => prepareSequence(e) as TSequenceSlide | TSequenceFade) as TSequence[],
                sequencesLength: animation.sequences.length,
            }
            sequencer.push(AnimationFrame);
        }
        // console.log('inited');
        return;
    };



    const animate = (requestFrame: number = 0) => {
        // console.log('Animate Frame '+requestFrame);
        const frames = sequencer.length;

        if (disabled) return;
        if (requestFrame && requestFrame >= frames) {
            if (!infinite) return;
            else { setFrame(0); return }
        }
        if (requestFrame === undefined || !sequencer[requestFrame]) requestFrame = 0;

        const Animation: TAnimation = sequencer[requestFrame];

        let sequenceFinished = 0;
        let sequences = Object.entries(sequencer[requestFrame].sequences)
        let sequencesLength = sequences.length
        let interpolatedAnimationY;
        let interpolatedAnimationX;

        if (Animation?.options?.onStart) Animation.options.onStart();

        for (const [id, sequence] of sequences) {
            if (sequence.type === 'slide') {
                movementValue.setValue(0);
                
                interpolatedAnimationY = movementValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: sequence.outputRangeY
                })
                interpolatedAnimationX = movementValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: sequence.outputRangeX
                })
                if (!infinite) setStyles({
                    ...styles,
                    translateX: interpolatedAnimationX,
                    translateY: interpolatedAnimationY
                })
            }

            else if (sequence.type === 'fade') {
                opacityValue.setValue(sequence.fromValue);
                if (!infinite) setStyles({
                    ...styles,
                    opacity: opacityValue,
                })
            }

            if (infinite) setStyles({
                opacity: opacityValue,
                translateX: interpolatedAnimationX,
                translateY: interpolatedAnimationY
            })

            const timing = sequence.type === 'slide' ? movementValue
            : sequence.type === 'fade' ? opacityValue
            : movementValue;

            Animated.timing(timing, sequence.animation).start(() =>
                {
                    if (sequenceFinished < sequencesLength - 1) {
                        sequenceFinished = sequenceFinished + 1;
                        return;
                    } else {
                        if (Animation?.options?.onFinish) Animation.options.onFinish();
                        return setFrame(requestFrame + 1);
                    }
                }
            );
        }
    };
    

    useEffect(() => {
        if (!disabled) {
            initSequencer();
            animate(frame);
        }
    },[frame])

 
    
    return <Animated.View style={[styles]}>{children}</Animated.View>;
});

BaseAnimationChain.defaultProps = defaultProps;

export default BaseAnimationChain;
