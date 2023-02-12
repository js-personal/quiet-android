import { Dimensions, View, SafeAreaView, StyleSheet, Text } from 'react-native';
import RootCSS from '@assets/root';

type Props = {
    enable?: boolean;
};

export default function SecureOutside(props: Props) {

    const { enable } = props;

    return (
        <View style={[ RootCSS.container ]}>
            <Text>SecureOutside {enable ? 'true' : 'false' }</Text>
        </View>
    );
}

