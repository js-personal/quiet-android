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
    animation: Animated.TimingAnimationConfig;
    options?: TSequenceOptions;
    fromValue: number;
};

type TSequenceSlide = {
    type: 'slide';
    animation: Animated.TimingAnimationConfig;
    options?: TSequenceOptions;
    outputRangeY: [number, number];
    outputRangeX: [number, number];
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

        
const initSequencer = (frames: TEntryFrameProps[]) : TSequencer => {
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
                    prepareSequence(e) as TSequenceSlide | TSequenceFade,
            ) as TSequence[],
            sequencesLength: frame.sequences.length,
        };
        preparedFrames.push(AnimationFrame);

    }
    return preparedFrames
}

const prepareSequence = (sequence: TEntryFrameSequenceSlideProps | TEntryFrameSequenceFadeProps): TSequence => {
    if (sequence.type === 'fade') {
        return newFrameFade(sequence);
    } else {
        return newFrameSlide(sequence);
    }
};

const prepareSequenceStyle = (
	style: TStyles,
	sequence: TSequence,
	{ opacityValue, movementValue }
	:{ opacityValue: Animated.Value, movementValue: Animated.Value }) => {

	if (sequence.type === 'fade') {
		opacityValue.setValue(sequence.fromValue);
		style.opacity = opacityValue;
	}

	else if (sequence.type === 'slide')  {
		movementValue.setValue(0);
		let interpolatedAnimationY = movementValue.interpolate({
			inputRange: [0, 1],
			outputRange: sequence.outputRangeY,
		});
		let interpolatedAnimationX = movementValue.interpolate({
			inputRange: [0, 1],
			outputRange: sequence.outputRangeX,
		});
		style.translateX = interpolatedAnimationX;
		style.translateY = interpolatedAnimationY;
	}
}


const playSequence = (
	sequenceId: string, 
	sequencesLength: number, 
	sequence: TSequence, 
	frameStyles: TStyles, 
	{opacityValue, movementValue}
	:{ opacityValue: Animated.Value, movementValue: Animated.Value }): Promise<void> => {
	return new Promise((resolve, rej) => {
		prepareSequenceStyle(frameStyles, sequence, { opacityValue, movementValue });
		const timing = sequence.type === 'slide' ? movementValue : sequence.type === 'fade' ? opacityValue : movementValue;
		Animated.timing(timing, sequence.animation).start(() => {
			resolve()
		});
	})
}

const newFrameFade = (props: TEntryFrameSequenceFadeProps): TSequenceFade => {
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
    };
};

const newFrameSlide = (props: TEntryFrameSequenceSlideProps): TSequenceSlide => {
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
    };
};

const BaseAnimationChain: React.FC<Props> = memo(({ children, frames, infinite, disabled, restartAfterDisable }: Props) => {

    const sequencer = useMemo(() => initSequencer(frames), []);

    const [ styles, setStyles ]: [TStyles, Dispatch<SetStateAction<{}>>] = useState({});

    const [ currentFrame, setCurrentFrame ]: [ number, Dispatch<SetStateAction<number>> ] = useState(-1);
    const [ animationStarted, setAnimationStarted ]: [ number, Dispatch<SetStateAction<number>> ] = useState(-1);
    const [ terminated, setTerminated ]: [ boolean, Dispatch<SetStateAction<boolean>> ] = useState(false);

    const opacityValue = new Animated.Value(0);
    const movementValue = new Animated.Value(0);

    const animate = useCallback(() => {

        const Animation: TFrame = sequencer[currentFrame];

        let sequences = Object.entries(Animation.sequences);
        let sequencesLength = sequences.length;

        if (Animation?.options?.onStart) Animation.options.onStart();

		const frameStyles:TStyles = {}
		const threadSequences = [];

		for (const [sequenceId, sequence] of sequences)
			threadSequences.push(playSequence(sequenceId, sequencesLength, sequence, frameStyles, { opacityValue, movementValue }));

		setStyles(frameStyles);

		Promise.all(threadSequences).then(() => { 
			if (Animation?.options?.onFinish) Animation.options.onFinish();
			setCurrentFrame(currentFrame + 1);
		})

    }, [currentFrame]);
    

	const getStyleStart = () => {
		//devnote non fonctionnel
		opacityValue.setValue(0);
		movementValue.setValue(0);
		let style = {}
		sequencer[0].sequences.forEach((e) => prepareSequenceStyle(style, e, { opacityValue, movementValue }));
		// console.log('GET STYLE STAT');
		// console.log({...style, opacity: opacityValue });
		return {...style, opacity: opacityValue };
	}

    useEffect(() => {
            if (currentFrame >= frames.length) {
                if (!terminated) setTerminated(true);
                setAnimationStarted(-1);
                if (infinite || disabled) setCurrentFrame(-1);
            }
            else {
                if (currentFrame === -1) {
                    if (!disabled) {
                        if (terminated) setTerminated(false);
                        setCurrentFrame(0);
                    }
                }
                else if (animationStarted !== currentFrame) {
                    if (!disabled) {
                        setAnimationStarted(currentFrame);
                        if (terminated) setTerminated(false);
                        animate();
                    }
                }
            }
            if (disabled && restartAfterDisable && currentFrame > -1) {
				setStyles(getStyleStart())
            }
    }, [currentFrame, disabled]);


    return <Animated.View style={[styles]}>{children}</Animated.View>;

},(prev, next) => (prev.disabled === next.disabled && prev.infinite === next.infinite && next.frames === prev.frames));

BaseAnimationChain.defaultProps = defaultProps;

export default BaseAnimationChain;
