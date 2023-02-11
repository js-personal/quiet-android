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

export default function BaseSlide(props: TEntrySlideProps) {
    const { width, height, children } = props;
    return (
        <View style={[{ width: width, height: height }, styles.slide]}>
            { children }
        </View>
    );
}

const styles = StyleSheet.create({
    slide: {
        // alignItems:'center'
    }
});
