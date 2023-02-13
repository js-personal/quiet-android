import { Dispatch, memo, PropsWithChildren, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, EasingFunction } from 'react-native';

const EntryAnimationSequenceType = ['fade', 'slide'] as const;
export type TEntryFrameSequenceType = (typeof EntryAnimationSequenceType)[number];
const EntryAnimationSequenceFadePropsOptions = ['out', 'in'] as const;
type TEntryFrameSequenceFadePropsOptions = (typeof EntryAnimationSequenceFadePropsOptions)[number];

type TEntryFrameSequenceFadeProps = {
    type: 'fade';
    mode: TEntryFrameSequenceFadePropsOptions[number];
    duration?: number;
    delay?: number;
    easing?: EasingFunction;
    useNativeDriver?: boolean;
};

type TEntryFrameSequenceSlideProps = {
    type: 'slide';
    from?: (number | undefined)[];
    to?: (number | undefined)[];
    duration: number;
    delay?: number;
    easing?: EasingFunction;
    useNativeDriver?: boolean;
};

export type TEntryFrameSequences = (TEntryFrameSequenceSlideProps | TEntryFrameSequenceFadeProps)[];

export type TEntryFrameProps = {
    sequences: TEntryFrameSequences;
    disableChildrenWhenTerminated?: boolean;
    onStart?: Function;
    onFinish?: Function;
};

type TSequenceOptions = {
    //DevNote create laters;
};

type TSequenceFade = {
    type: 'fade';
    animation: Animated.CompositeAnimation;
    options?: TSequenceOptions;
    fromValue: number;
};

type TSequenceSlide = {
    type: 'slide';
    animation:  Animated.CompositeAnimation;
    options?: TSequenceOptions;
    outputRangeY:  number[];
    outputRangeX: number[];
};

type TSequence = TSequenceFade | TSequenceSlide;

type TFrameOptions = {
    disableChildrenWhenTerminated: boolean;
    onStart: Function | null;
    onFinish: Function | null;
};

type TFrame = {
    options: TFrameOptions;
    sequences: TSequence[];
    sequencesLength: number;
};

type TSequencer = TFrame[] | [];

type TStyles = {
    opacity?: Animated.Value;
    translateX?: Animated.AnimatedInterpolation<string | number>;
    translateY?: Animated.AnimatedInterpolation<string | number>;
};

interface Props extends PropsWithChildren<any> {
    children: JSX.Element | undefined;
    frames: TEntryFrameProps[];
    infinite?: boolean;
    disabled?: boolean;
}

const defaultProps: Props = {
    children: undefined,
    infinite: false,
    frames: [] as TEntryFrameProps[],
    disabled: false,
    restartAfterDisable: false,
};

        
const initSequencer = (
    frames: TEntryFrameProps[], 
    {opacityValue, movementValue}
    : { opacityValue: Animated.Value, movementValue: Animated.Value}) 
    : TSequencer => {
    const preparedFrames = []
    for (let [_, frame] of Object.entries(frames)) {
        const AnimationFrame: TFrame = {
            options: {
                disableChildrenWhenTerminated: frame.disableChildrenWhenTerminated || false,
                onStart: frame.onStart || null,
                onFinish: frame.onFinish || null,
            },
            sequences: frame.sequences.map(
                (e: TEntryFrameSequenceSlideProps | TEntryFrameSequenceFadeProps) =>
                    prepareSequence(e, {opacityValue, movementValue }) as TSequenceSlide | TSequenceFade,
            ) as TSequence[],
            sequencesLength: frame.sequences.length,
        };
        preparedFrames.push(AnimationFrame);

    }
    return preparedFrames
}

const prepareSequence = (
    sequence: TEntryFrameSequenceSlideProps | TEntryFrameSequenceFadeProps, 
    { opacityValue, movementValue}
    : {opacityValue: Animated.Value, movementValue: Animated.Value}) 
    : TSequence => {
    if (sequence.type === 'fade') {
        return newFrameFade(sequence, { opacityValue });
    } else {
        return newFrameSlide(sequence, { movementValue });
    }
};

const newFrameFade = (
    props: TEntryFrameSequenceFadeProps,
    { opacityValue }: { opacityValue: Animated.Value })
    : TSequenceFade => {
    const fromValue = props.mode === 'in' ? 0 : 1;

    return {
        type: 'fade',
        fromValue: fromValue,
        animation: Animated.timing(opacityValue, {
            delay: props.delay || 0,
            duration: props.duration || 500,
            easing: props.easing || Easing.linear,
            toValue: props.mode === 'in' ? 1 : 0,
            useNativeDriver: props.useNativeDriver || true,
        }),
    };
};

const newFrameSlide = (
    props: TEntryFrameSequenceSlideProps,
    { movementValue }: { movementValue: Animated.Value})
    : TSequenceSlide => {

    let fromX, fromY, toX, toY;
    if (props.from) {
        fromX = props.from[0];
        fromY = props.from[1];
    }
    if (props.to) {
        toX = props.to[0];
        toY = props.to[1];
    }

    const outputRangeY = props.from ? [fromY || 0, 0] : [0, toY || 0];
    const outputRangeX = props.from ? [fromX || 0, 0] : [0, toX || 0]

    return {
        type: 'slide',
        outputRangeY: outputRangeY,
        outputRangeX: outputRangeX,
        animation: Animated.timing(movementValue, {
            delay: props.delay || 0,
            duration: props.duration || 500,
            easing: props.easing || Easing.linear,
            toValue: 1,
            useNativeDriver: props.useNativeDriver || true,
        }),
    };
};


const prepareSequenceStyle = (
	style: TStyles,
	sequence: TSequence,
	{ opacityValue, movementValue }
	:{ opacityValue: Animated.Value, movementValue: Animated.Value })
    : TStyles => {

	if (sequence.type === 'fade') {
		opacityValue.setValue(sequence.fromValue);
		style.opacity = opacityValue;
	}

	else if (sequence.type === 'slide')  {
		movementValue.setValue(0);
		style.translateX = movementValue.interpolate({
            inputRange: [0, 1],
            outputRange: sequence.outputRangeX,
        })
        style.translateY = movementValue.interpolate({
            inputRange: [0, 1],
            outputRange: sequence.outputRangeY,
        })
	}

    return style;
}


const playSequence = (
	sequence: TSequence, 
    currentStyles: TStyles,
	frameStyles: TStyles,
    setStyles: Dispatch<SetStateAction<{}>>,
	{opacityValue, movementValue}:{ opacityValue: Animated.Value, movementValue: Animated.Value },
    infinite: boolean | undefined): Promise<void> => {

		prepareSequenceStyle(frameStyles, sequence, { opacityValue, movementValue });
        if (!infinite) setStyles({...frameStyles});
                console.log('setStyle',{...currentStyles,...frameStyles});

	return new Promise((resolve, rej) => {
        sequence.animation.start(() =>{
            resolve()
        })
		// Animated.sequence()
		// //DEVNOTE GROSS MAJ : Utiliser Animated.sequence et memoration
		// Animated.sequence([]).reset
	})
}


const BaseAnimationChain: React.FC<Props> = memo(({ children, frames, infinite, disabled, restartAfterDisable }: Props) => {

    const opacityValue = useRef(new Animated.Value(0)).current
    const movementValue = useRef(new Animated.Value(0)).current

    const [ styles, setStyles ]: [TStyles, Dispatch<SetStateAction<TStyles>>] = useState({
        opacity: opacityValue,
    } as TStyles);

    const sequencer = useMemo(() => initSequencer(frames, {opacityValue, movementValue}), []);

    const [ requestedFrame, setRequestedFrame ]: [ number, Dispatch<SetStateAction<number>> ] = useState(-1);
    const [ playingFrame, setPlayingFrame ]: [ number, Dispatch<SetStateAction<number>> ] = useState(-1);
    const [ started, setStarted ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);
    const [ terminated, setTerminated ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);


    const animate = () => {

        const Animation: TFrame = sequencer[requestedFrame];

        let sequences = Object.entries(Animation.sequences);

        if (Animation?.options?.onStart) Animation.options.onStart();

		const frameStyles:TStyles = {}
		const threadSequences = [];
        console.log('frame '+requestedFrame);
		for (const [_, sequence] of sequences)
			threadSequences.push(playSequence(sequence, styles, frameStyles, setStyles, { opacityValue, movementValue }, infinite));

        if (infinite) setStyles({...styles,...frameStyles});

		Promise.all(threadSequences).then(() => { 
			if (Animation?.options?.onFinish) Animation.options.onFinish();
            setRequestedFrame(requestedFrame + 1);
		})

    }

    const resetSequencer = () => {
        console.log('Reset sequencer');
        // opacityValue.setValue(0);
        
        for (let frame of sequencer) {
            for (let sequence of frame.sequences) {
                sequence.animation.stop();
                // sequence.animation.reset();
            }
        }

        sequencer[0].sequences[0].animation.reset();
        const startStyle = !infinite ? {...styles } : {};
        // sequencer[0].sequences.forEach(sequence => {
            prepareSequenceStyle(startStyle, sequencer[0].sequences[0], { opacityValue, movementValue });
        // })
        setStyles(startStyle)
    }



    useEffect(() => {

            const disable = () => {
                if (restartAfterDisable) resetSequencer();
            }
            const terminate = () => {
                if (started) {
                    if (!terminated) {
                        if (infinite) {
                            setRequestedFrame(-1);
                            setPlayingFrame(-1);
                            setStarted(false);
                        }
                        else {
                            setTerminated(true);
                        }
                    }
                }
            }

            //If it disabled
			if (disabled) { 
                disable();
			}
            //if frame arrive to end
            else if (started && requestedFrame >= frames.length) {
                terminate()
            }
            //if it next frame request
            else if (started && requestedFrame > playingFrame) {
                if (playingFrame < requestedFrame) setPlayingFrame(requestedFrame);
                animate()
            }
            //if it default position
            else if (!started && requestedFrame === -1 && playingFrame === -1) {
                setStarted(true);
                if (playingFrame < requestedFrame) setPlayingFrame(requestedFrame);
                setRequestedFrame(requestedFrame+1);
            }

            
    }, [requestedFrame, disabled]);


    return <Animated.View style={[styles]}>{children}</Animated.View>;

},(prev, next) => (prev.disabled === next.disabled && prev.infinite === next.infinite));

BaseAnimationChain.defaultProps = defaultProps;

export default BaseAnimationChain;
