/************************************
 * 
 * Copyright 2023 Jérémy Sarteur
 *  *
 */

import { Dispatch, SetStateAction } from "react";
import { Animated, Easing, EasingFunction } from "react-native";

const EntryAnimationSequenceType = ['fade', 'slide'] as const;
export type TEntryFrameSequenceType = (typeof EntryAnimationSequenceType)[number];
const EntryAnimationSequenceFadePropsOptions = ['out', 'in'] as const;
type TEntryFrameSequenceFadePropsOptions = (typeof EntryAnimationSequenceFadePropsOptions)[number];

export type TEntryFrameProps = {
    sequences: TEntryFrameSequences;
    disableChildrenWhenTerminated?: boolean;
    onStart?: Function;
    onFinish?: Function;
};

export type TEntryFrameSequences = (TEntryFrameSequenceSlideProps | TEntryFrameSequenceFadeProps)[];

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

type TSequence = TSequenceFade | TSequenceSlide;

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

type TSequenceOptions = {
    //DevNote create laters;
};


type TFrame = {
    options: TFrameOptions;
    sequences: TSequence[];
};

type TFrameOptions = {
    disableChildrenWhenTerminated: boolean;
    onStart: Function | null;
    onFinish: Function | null;
};

export type TDynamicStyles = {
    opacity?: Animated.Value;
    translateX?: Animated.AnimatedInterpolation<string | number>;
    translateY?: Animated.AnimatedInterpolation<string | number>;
};

type TFramesOptions = {
    infinite?: boolean;
    restartAfterDisable?: boolean;
};

export interface ISequencer {
    run:() => void
    stop:() => void
    reset:() => void
}

export default class Sequencer implements ISequencer {

        private frames: TFrame[];
        private styles: TDynamicStyles
        private setStyles: Dispatch<SetStateAction<TDynamicStyles>>;
        private movementValue: Animated.Value;
        private opacityValue: Animated.Value;
        private infinite: boolean;
        private stopped = false;
        private started = false;
        private paused = false;
        private requestRestart = false;
        private terminated= false;
        private requestFrame = -1;
        private playingFrame = -1;
        private restartAfterDisable = false;

        constructor(
            entryFrames: TEntryFrameProps[],
            styles: TDynamicStyles,
            setStyles: Dispatch<SetStateAction<TDynamicStyles>>,
            { infinite, restartAfterDisable }: TFramesOptions,
            { opacityValue, movementValue }:{opacityValue: Animated.Value, movementValue: Animated.Value}) {
                const preparedFrames = []
                this.styles = styles
                this.setStyles = setStyles;
                this.infinite = infinite || false;
                this.opacityValue = opacityValue;
                this.movementValue = movementValue;
                this.restartAfterDisable = restartAfterDisable || false;
                for (let [_, frame] of Object.entries(entryFrames)) {
                    const AnimationFrame: TFrame = {
                        options: {
                            disableChildrenWhenTerminated: frame.disableChildrenWhenTerminated || false,
                            onStart: frame.onStart || null,
                            onFinish: frame.onFinish || null,
                        },
                        sequences: frame.sequences.map(
                            (e: TEntryFrameSequenceSlideProps | TEntryFrameSequenceFadeProps) =>
                                generateSequence(e, {opacityValue, movementValue }) as TSequenceSlide | TSequenceFade,
                        ) as TSequence[]
                    };
                    preparedFrames.push(AnimationFrame);
            
                }
            this.frames = preparedFrames;
    }

    run() {
        // console.log('START');
        this.stopped = false;
        if (!this.started && !this.requestRestart && !this.paused) {
            return this.start()
            
        }
        else if (this.paused && !this.terminated) {
            return this.continue();
        }
        else if (this.requestRestart) {
            this.requestRestart = false;
            this.playingFrame = -1;
            return this.start();
        }
    }

    stop() {
        // console.log('STOP');
        this.stopped = true;
        if (this.started) {
            this.started = false;
            if (this.restartAfterDisable) {
                this.requestRestart = true;
                return this.reset();
            }
            else {
                return this.pause();
            }
        }
    }

    reset() {
        // console.log('RESET');
        for (let frame of this.frames) {
            for (let sequence of frame.sequences) {
                sequence.animation.reset()
            }
        }
        this.setStyles({...updateFrameStyles(this.styles, this.frames[0].sequences[0], {opacityValue: this.opacityValue, movementValue: this.movementValue })});
        this.playingFrame = -1;
        return true;
    }

    private start() {
        this.started = true;
        this.terminated = false;
        this.playingFrame = -1;
        this.requestFrame = 0.
        return this._playFrame(this.requestFrame).then(this._requestNextFrame.bind(this))
    }

    private continue() {
        this.paused = false;
        if (this.playingFrame === -1) this.playingFrame = 0;
        return this._continueFrame(this.playingFrame).then(this._requestNextFrame.bind(this))
    }

    private pause() {
        // console.log('PAUSE');
        this.paused = true;
        for (let frame of this.frames) {
            for (let sequence of frame.sequences) {
                sequence.animation.stop()
            }
        }
        return true;
    }

    private terminate() {
        if (this.infinite && !this.paused) {
            this.start();
            return false;
        }
        else {
            this.terminated = true
            return true;
        }
    }


    async _playFrame(i: number) {
        // console.log('PLAY : '+i);
        this.playingFrame = i;

        const Frame: TFrame = this.frames[i];
        let sequences = Object.entries(Frame.sequences);
        if (Frame?.options?.onStart) Frame.options.onStart();
    
        const frameStyles:TDynamicStyles = {}
        const threadSequences = [];
        for (const [_, sequence] of sequences) {
            threadSequences.push(new Promise((resolve,rej) => {
                updateFrameStyles(frameStyles, sequence, { opacityValue: this.opacityValue, movementValue: this.movementValue });
                sequence.animation.start(() =>{
                    resolve(true)
                })
            }))
        }
        if (this.infinite) this.setStyles({...this.styles,...frameStyles});
        else this.setStyles({...frameStyles})
        
        return Promise.all(threadSequences).then(() => { 
            if (Frame?.options?.onFinish) Frame.options.onFinish();
            return i + 1;
        })
    }

    private async _continueFrame(i: number) {
        // console.log('CONTINUE :'+i);
        const Frame: TFrame = this.frames[i];
        const sequences = Object.entries(Frame.sequences);
        const threadSequences = [];
        for (const [_, sequence] of sequences) {
            threadSequences.push(new Promise((resolve,rej) => {
                sequence.animation.start(() =>{
                    resolve(true)
                })
            }))
        }
        return Promise.all(threadSequences).then(() => { 
            if (Frame?.options?.onFinish) Frame.options.onFinish();
            return i + 1;
        })
    }

    private async _requestNextFrame(i: number): Promise<boolean> {
        if (this.stopped) return false;
        else if (i >= this.frames.length) return this.terminate()
        else return await this._playFrame(i).then(this._requestNextFrame.bind(this))
    }
}


const updateFrameStyles = (
	style: TDynamicStyles,
	sequence: TSequence,
	{ opacityValue, movementValue }
	:{ opacityValue: Animated.Value, movementValue: Animated.Value })
    : TDynamicStyles => {

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


const generateSequence = (
    sequence: TEntryFrameSequenceSlideProps | TEntryFrameSequenceFadeProps, 
    { opacityValue, movementValue}
    : {opacityValue: Animated.Value, movementValue: Animated.Value}) 
    : TSequence => {
    if (sequence.type === 'fade') {
        return createSequenceFade(sequence, { opacityValue });
    } else {
        return createSequenceSlide(sequence, { movementValue });
    }
}
    
const createSequenceFade = (
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

const createSequenceSlide = (
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