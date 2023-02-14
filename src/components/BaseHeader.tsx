import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import RootCSS from '../assets/root';
import { NativeStackNavigationProp  } from '@react-navigation/native-stack';
import type { ParamListBase, RouteProp } from '@react-navigation/native';

type TBaseHeaderProps<T extends ParamListBase> = {
  route: RouteProp<T>
  navigation: NativeStackNavigationProp<T>
  title: string, 
  backTitle: string,
  backgroundColor: string;
  backNavigate: string
};
const BaseHeader: React.FC<TBaseHeaderProps<ParamListBase>>  = ({ navigation, title, backTitle, backNavigate, backgroundColor }) => {
    
    return (
        <View
            style={[
                RootCSS.container,
                RootCSS.directionRow,
                RootCSS.alignCenter,
                RootCSS.justifyBetween,
                styles.headerContainer,
                { backgroundColor: backgroundColor },
            ]}>
            <View style={[RootCSS.directionRow, { flex: 2 }]}>
                <Pressable
                    onPress={() => {
                        navigation.navigate(backNavigate);
                    }}
                    style={[RootCSS.directionRow, RootCSS.alignCenter]}>
                    <Icon style={styles.headerBackIcon} name="caret-left" type="font-awesome" color="white" size={40} />
                    <View>
                        <Text style={[RootCSS.textWhite, styles.headerBackTitle]}> {backTitle}</Text>
                    </View>
                </Pressable>
            </View>
            <View style={[RootCSS.container, RootCSS.textCenter, { flex: 5 }]}>
                <Text style={[styles.headerTitle, { color: 'white' }, { textAlign: 'center' }]}>{title}</Text>
            </View>
            <View style={[RootCSS.container, { flex: 2 }]}>
                <Text style={[RootCSS.textWhite]}></Text>
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

export default BaseHeader;
