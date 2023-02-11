import { SafeAreaView, StyleSheet } from 'react-native';
import Presentation from '../components/ActivityPresentation/Presentation';

export default function ActivityPresentation() {
    return <SafeAreaView style={styles.safeAreaView}><Presentation/></SafeAreaView>;
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
});
