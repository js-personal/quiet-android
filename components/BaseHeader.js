import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import GlobalCSS from '../assets/root';

export default function BaseHeader({ navigation, title, back, backTitle, backNavigate, backgroundColor }) {
    return (
        <View
            style={[
                GlobalCSS.styles.container,
                GlobalCSS.directionRow,
                GlobalCSS.alignCenter,
                GlobalCSS.justifyBetween,
                styles.headerContainer,
                { backgroundColor: backgroundColor },
            ]}>
            <View style={[GlobalCSS.styles.container, GlobalCSS.directionRow, { flex: 2 }]}>
                <Pressable
                    onPress={() => {
                        navigation.navigate(backNavigate);
                    }}
                    style={[GlobalCSS.directionRow, GlobalCSS.alignCenter]}>
                    <Icon style={[styles.headerBackIcon]} name="caret-left" type="font-awesome" color="white" size={40} />
                    <View>
                        <Text style={[GlobalCSS.textWhite, styles.headerBackTitle]}> {backTitle}</Text>
                    </View>
                </Pressable>
            </View>
            <View style={[GlobalCSS.styles.container, GlobalCSS.textCenter, { flex: 5 }]}>
                <Text style={[styles.headerTitle, { color: 'white' }, { textAlign: 'center' }]}>{title}</Text>
            </View>
            <View style={[GlobalCSS.styles.container, { flex: 2 }]}>
                <Text style={[GlobalCSS.textWhite]}></Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
        paddingLeft: 5,
        paddingTop: 35,
        flex: 0.08,
    },
    headerBackIcon: {
        marginLeft: 5,
        marginRight: 5,
    },
    headerBackTitle: {
        fontSize: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
