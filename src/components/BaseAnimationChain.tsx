import { Dispatch, memo, PropsWithChildren, SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from 'react';
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

        return new Promise((resolve, rej) => {
            sequence.animation.start(() =>{
                resolve()
            })
        })
    }


const BaseAnimationChain: React.FC<Props> = memo(({ children, frames, infinite, play, restartAfterDisable }: Props) => {

    const opacityValue = useRef(new Animated.Value(0)).current
    const movementValue = useRef(new Animated.Value(0)).current

    const [ styles, setStyles ]: [TStyles, Dispatch<SetStateAction<TStyles>>] = useState({
        opacity: opacityValue,
    } as TStyles);

    const sequencer = useMemo(() => initSequencer(frames, {opacityValue, movementValue}), []);

    const [ requestedFrame, setRequestedFrame ]: [ number, Dispatch<SetStateAction<number>> ] = useState(-1);

    const [ refresh, setRefresh ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);

    let started: React.MutableRefObject<boolean>= useRef(false)
    let paused: React.MutableRefObject<boolean>= useRef(false)
    let playing: React.MutableRefObject<boolean>= useRef(false)
    let requestRestart: React.MutableRefObject<boolean> = useRef(false)
    let terminated: React.MutableRefObject<boolean>= useRef(false)
    let playingFrame: React.MutableRefObject<number> = useRef(-1)
   

    const animate = () => {

        const Animation: TFrame = sequencer[requestedFrame];
        let sequences = Object.entries(Animation.sequences);
        if (Animation?.options?.onStart) Animation.options.onStart();

		const frameStyles:TStyles = {}
		const threadSequences = [];
		for (const [_, sequence] of sequences)
			threadSequences.push(playSequence(sequence, styles, frameStyles, setStyles, { opacityValue, movementValue }, infinite));

        if (infinite) setStyles({...styles,...frameStyles});
        else setStyles({...frameStyles})

		Promise.all(threadSequences).then(() => { 
			if (Animation?.options?.onFinish) Animation.options.onFinish();
            setRequestedFrame(requestedFrame + 1);
		})
    }

    const resetSequencer = () => {
        console.log('resetSequencer');
        for (let frame of sequencer) {
            for (let sequence of frame.sequences) {
                sequence.animation.reset()
            }
        }
        setStyles({...prepareSequenceStyle(styles, sequencer[0].sequences[0], {opacityValue, movementValue })});
    }

    const stopSequencer =() => {
        console.log('stopSequencer');

        for (let frame of sequencer) {
            for (let sequence of frame.sequences) {
                sequence.animation.stop()
            }
        }
    }


    const run = () => {
        if (started.current !== true) { started.current = true; }
        if (terminated.current) terminated.current = false;
        if (playingFrame.current < requestedFrame) playingFrame.current = requestedFrame;
        animate();
    }

    const disable = () => {
        if (started.current) {
            if (restartAfterDisable) {
                resetSequencer();
                requestRestart.current = true;
                setRefresh(true);
            }
            else {
                paused.current = true;
                stopSequencer();
            }
        }
    }

    const terminate = () => {
        if (started.current) {
            if (!terminated.current) {
                if (!infinite) {
                    terminated.current = true;
                    setRequestedFrame(-1);
                    playingFrame.current = -1;
                }
                else {
                    setRequestedFrame(0);
                    playingFrame.current = -1
                }
            }

        }
    }


    
    useEffect(() => {
        if (!play) {
            if (playing.current) {
                playing.current = false;
                disable();
            }
        }
        else {
            playing.current = true;
            if (!started.current && !requestRestart.current && !paused.current) {
                console.log('pas demarrer')
                playingFrame.current = -1;
                setRequestedFrame(0);
                
            }
            else if (started.current && paused.current && !terminated.current) {
                setRequestedFrame(playingFrame.current);
                playingFrame.current = playingFrame.current - 1;
            }
            else if (requestRestart.current) {
                console.log('deja demarré et besoin de restart')
                requestRestart.current = false;
                playingFrame.current = -1;
                setRequestedFrame(0);
            }
        }
    }, [play])

    useEffect(() => {
        if (!playing.current) return ;
        if (requestedFrame >= frames.length) {
            terminate();
        }
        else if (requestedFrame > playingFrame.current) {
            run();
        }
    }, [requestedFrame]);


    return <Animated.View style={[styles]}>{children}</Animated.View>;

},(prev, next) => (prev.play === next.play && prev.infinite === next.infinite));

BaseAnimationChain.defaultProps = defaultProps;

export default BaseAnimationChain;
