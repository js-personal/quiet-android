import type { MemoExoticComponent } from 'react';

import { memo, useCallback, useRef, useMemo, ReactElement } from 'react';
import { StyleSheet, View, NativeScrollEvent, Animated, NativeSyntheticEvent, ListRenderItem } from 'react-native';
import SequencerComponent from '@components/rn-sequencer';
import type { TEntryFrameProps } from '@components/rn-sequencer';
import PaginationDotLiquid from './PaginationDotLiquid';


type TEntryPropsSlide = {
    name: string;
    component: ReactElement<any, string | React.JSXElementConstructor<any>> | null
    paginationDisabled?: boolean;
};

type TEntryPropsSlides = TEntryPropsSlide[];

export type TEntryBasePresentationProps = {
    slides: TEntryPropsSlides;
    slideWidth: number;
    slideHeight: number;
    dotActive?: object;
    dotInactive?: object;
    paginationEnabled?: boolean;
    paginationAppearSequences?: TEntryFrameProps[];
    paginationDisappearSequences?: TEntryFrameProps[];
    onChangeSlide?: (id: number | undefined) => void;
};


const BasePresentationSliders:MemoExoticComponent<React.FC<TEntryBasePresentationProps>> =  memo((props: TEntryBasePresentationProps) => {

    const { slides, slideWidth, slideHeight } = props;
    const scrollX = useRef(new Animated.Value(0)).current;
    let scrollOffset = useRef(new Animated.Value(0)).current;

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
            const frames: TEntryFrameProps[] | undefined = props.paginationEnabled && props.paginationAppearSequences 
            ? props.paginationAppearSequences
            : props.paginationDisappearSequences;
            
            if (frames)
                return (
                    <SequencerComponent frames={ frames }>
                      {PaginationMemo}
                    </SequencerComponent>
                );
            else return PaginationMemo
        }
    },[props.paginationEnabled])

    const getItemLayout = useCallback((_: TEntryPropsSlide[] | null | undefined, index: number) => {
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
});

const renderSlide: ListRenderItem<TEntryPropsSlide> = ({ item }: { item: TEntryPropsSlide }) => {
    return item.component;
}

type TPaginationMemoProps = {
    paginationEnabled ?: boolean;
    slides: TEntryPropsSlides;
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


export default BasePresentationSliders;