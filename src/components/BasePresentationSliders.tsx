import { cloneElement, ComponentType, FunctionComponentElement, memo, useCallback, useRef, useMemo } from 'react';
import { StyleSheet, View, NativeScrollEvent, Animated, NativeSyntheticEvent } from 'react-native';
import { ClipPath } from 'react-native-svg';
import BaseAnimationChain, { TEntryAnimationProps } from './BaseAnimationChain';
import PaginationDotLiquid from './PaginationDotLiquid';

type TSlide = {
    name: string;
    component: FunctionComponentElement<any>;
    paginationDisabled?: boolean;
};

type TSlides = TSlide[];

type BasePresentationSlidersProps = {
    slides: TSlides;
    slideWidth: number;
    slideHeight: number;
    dotActive?: object;
    dotInactive?: object;
    paginationEnabled?: boolean;
    paginationAppearSequences?: TEntryAnimationProps[];
    paginationDisappearSequences?: TEntryAnimationProps[];
    onChangeSlide?: (id: number | undefined) => void;
};
type TPaginationMemoProps = {
    paginationEnabled ?: boolean;
    slides: TSlides;
    scrollX: Animated.Value;
    scrollOffset: Animated.Value
}

const Pagination = memo((props: TPaginationMemoProps) => {
    return (
        <View style={styles.dotCtn}>
            {props.paginationEnabled && (
                <PaginationDotLiquid
                    data={props.slides}
                    scrollX={props.scrollX}
                    scrollOffset={props.scrollOffset}
                    dotSize={8}
                    activeDotColor={'#687dfa'}
                    inActiveDotColor={'black'}
                    inActiveDotOpacity={0.3}
                    marginHorizontal={2}
                    strokeWidth={4}
                    bigHeadScale={0.8}
                />
            )}
        </View>
    );
}, (prev, next) => (prev.paginationEnabled === next.paginationEnabled));

    
const renderSlide = ({ item }: { item: TSlide }) => {
    return item.component;
}

export default memo(function BasePresentationSliders(props: BasePresentationSlidersProps) {

    const { slides, slideWidth, slideHeight } = props;
    const scrollX = useRef(new Animated.Value(0)).current;
    let scrollOffset = useRef(new Animated.Value(0)).current;
    
    console.log('# Render BasePresentationSliders');


    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        scrollX.setValue(x);
    }, [])
    
    const onScrollMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => { 
        const x = event.nativeEvent.contentOffset.x;
        scrollOffset.setValue(x);
        const i = Math.round(x / slideWidth);
        props.onChangeSlide ? props.onChangeSlide(i) : null;
    }

    const renderPagination = useMemo(() => {
        const animationRequested = props.paginationAppearSequences || props.paginationDisappearSequences;
        const paginationProps: TPaginationMemoProps = {
            slides: slides,
            scrollX: scrollX,
            scrollOffset: scrollOffset,
            paginationEnabled: props.paginationEnabled,
        }
        const PaginationMemo = <Pagination {...paginationProps} />;
        if (!animationRequested) {
            return PaginationMemo;
        } else {
            const animation: TEntryAnimationProps[] | undefined = props.paginationEnabled && props.paginationAppearSequences 
            ? props.paginationAppearSequences
            : props.paginationDisappearSequences;
            
            if (animation)
                return (
                    <BaseAnimationChain animations={ animation }>
                      {PaginationMemo}
                    </BaseAnimationChain>
                );
            else return PaginationMemo
        }
    },[props.paginationEnabled])

    const getItemLayout = useCallback((_: TSlide[] | null | undefined, index: number) => {
        return {
            length: slideHeight,
            offset: slideHeight * index,
            index,
        };
    }, [slideHeight]);

    return (
        <>
            <Animated.FlatList
                data={slides}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                renderItem={renderSlide}
                keyExtractor={item => item.name}
                style={styles.flatlist}
                onScroll={onScroll}
                getItemLayout={getItemLayout}
                onMomentumScrollEnd={onScrollMomentumEnd}
                
            />
            {renderPagination}
        </>
    );
})

const styles = StyleSheet.create({
    flatlist: {
        backgroundColor: 'white',
    },
    dotCtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 30,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 5,
        marginHorizontal: 3,
    },
    dotInactive: {
        backgroundColor: 'black',
    },
    dotActive: {
        backgroundColor: 'blue',
    },
});
