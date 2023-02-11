import React from 'react';
import { useRef, useState } from 'react';
import { StyleSheet, View, FlatList, NativeScrollEvent, Animated, NativeSyntheticEvent } from 'react-native';
import BaseAnimationChain, { TEntryAnimationProps } from './BaseAnimationChain';
import PaginationDotLiquid from './PaginationDotLiquid';

type TSlide = {
    name: string;
    component: JSX.Element;
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



export default React.memo(function BasePresentationSliders(props: BasePresentationSlidersProps) {

    const { slides, slideWidth } = props;
    const scrollX = useRef(new Animated.Value(0)).current;
    let scrollOffset = useRef(new Animated.Value(0)).current;
    let slideIndex = useRef(0).current;

    const renderSlide = ({ item }: { item: TSlide }) => item.component;

    const Pagination = () => {
        return (
            <View style={styles.dotCtn}>
                {props.paginationEnabled && (
                    <PaginationDotLiquid
                        data={slides}
                        scrollX={scrollX}
                        scrollOffset={scrollOffset}
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
    };

    
    const onScroll = ({ nativeEvent } : { nativeEvent: NativeScrollEvent }) => { 

        const i = Math.round(nativeEvent.contentOffset.x / slideWidth);
        props.onChangeSlide ? props.onChangeSlide(i) : null;
    
    }

    const renderPagination = () => {
        const animationRequested = props.paginationAppearSequences || props.paginationDisappearSequences;
        if (!animationRequested) {
            return <Pagination />;
        } else {
            const animation: TEntryAnimationProps[] | undefined = props.paginationEnabled && props.paginationAppearSequences 
            ? props.paginationAppearSequences
            : props.paginationDisappearSequences;
            
            if (animation)
                return (
                    <BaseAnimationChain animations={ animation }>
                        <Pagination />
                    </BaseAnimationChain>
                );
            else return <Pagination />;
        }
    };

    return (
        <>
            <Animated.FlatList
                data={slides}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                renderItem={renderSlide}
                // onScroll={onScroll}
                keyExtractor={item => item.name}
                style={styles.flatlist}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: true,
                })}

                onMomentumScrollEnd={Animated.event([{ nativeEvent: { contentOffset: { x: scrollOffset } } }], {
                    useNativeDriver: false,
                    listener: onScroll
                })}
            />
            {renderPagination()}
        </>
    );
})

const styles = StyleSheet.create({
    flatlist: {
        backgroundColor: 'white',
    },
    dotCtn: {
        // flexDirection: 'row',
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
