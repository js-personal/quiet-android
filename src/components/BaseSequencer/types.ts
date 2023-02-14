import { Animated, EasingFunction } from "react-native";

export type TEntryFrameSequenceType = 'fade' | 'slide';
export type TEntryFrameSequenceFadePropsOptions = 'out' | 'int'

export type TEntryFrameProps = {
    sequences: TEntryFrameSequences;
    disableChildrenWhenTerminated?: boolean;
    onStart?: Function;
    onFinish?: Function;
};

export type TEntryFrameSequences = (TEntryFrameSequenceSlideProps | TEntryFrameSequenceFadeProps)[];

export type TEntryFrameSequenceFadeProps = {
    type: 'fade';
    mode: TEntryFrameSequenceFadePropsOptions[number];
    duration?: number;
    delay?: number;
    easing?: EasingFunction;
    useNativeDriver?: boolean;
};

export type TEntryFrameSequenceSlideProps = {
    type: 'slide';
    from?: (number | undefined)[];
    to?: (number | undefined)[];
    duration: number;
    delay?: number;
    easing?: EasingFunction;
    useNativeDriver?: boolean;
};

export type TSequence = TSequenceFade | TSequenceSlide;

export type TSequenceFade = {
    type: 'fade';
    animation: Animated.CompositeAnimation;
    options?: TSequenceOptions;
    fromValue: number;
};

export type TSequenceSlide = {
    type: 'slide';
    animation:  Animated.CompositeAnimation;
    options?: TSequenceOptions;
    outputRangeY:  number[];
    outputRangeX: number[];
};

export type TSequenceOptions = {
    //DevNote create laters;
};


export type TFrame = {
    options: TFrameOptions;
    sequences: TSequence[];
};

export type TFrameOptions = {
    disableChildrenWhenTerminated: boolean;
    onStart: Function | null;
    onFinish: Function | null;
};

export type TDynamicStyles = {
    opacity?: Animated.Value;
    translateX?: Animated.AnimatedInterpolation<string | number>;
    translateY?: Animated.AnimatedInterpolation<string | number>;
};

export type TFramesOptions = {
    infinite?: boolean;
    restartAfterDisable?: boolean;
};

export interface ISequencer {
    run:() => void
    stop:() => void
}