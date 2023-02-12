import {memo} from 'react';
import { StyleSheet, View } from 'react-native';

export type TEntrySlideEvents = {
    [key: string]: Function
}

export type TEntrySlideProps = {
    width: number,
    height: number,
    children: JSX.Element,
    index: number,
    active?: boolean
} 

const BaseSlide = memo((props: TEntrySlideProps) => {
    const { width, height, children } = props;
    // console.log('Render: BaseSlide');

    return (
        <View style={[{ width: width, height: height }]}>
            { children }
        </View>
    )
})


export default BaseSlide;