import { useEffect, useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useColorScheme, StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import useTranslation from './composables/useTranslation';
import ActivityPresentation from './activities/ActivityPresentation';
import { appCheckpoints } from './stores/app/appSlice';
import preparePermanentDatas from './actions/app/preparePermanentDatas';
import installPermanentDatas from './actions/app/installPermanentDatas';
import { MEM_STORAGE_UID } from './index.memory';
import { ThemeDark, ThemeLight } from './assets/themes';

export default function App() {
    const { loadI18nLanguage } = useTranslation();
    const nativeTheme = useColorScheme();
    // const { theme, setTheme } = useContext(ThemeContext);

    const storePersistentReady = useSelector((state: any) => state.app.persistentReady);
    const language = useSelector((state: any) => state.app.language);
    const permanentUniqID = useSelector((state: any) => state.app[MEM_STORAGE_UID]);
    const checkpoint = useSelector((state: any) => state.app.checkpoint);
    const [isRequestingPresentation, setIsRequestingPresentation] = useState(false);
    const [isRequestingAuth, setIsRequestingAuth] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!storePersistentReady) {
            preparePermanentDatas();
        } else {
            if (!permanentUniqID) installPermanentDatas();
            loadI18nLanguage(language);
            if (checkpoint === appCheckpoints.justInstalled) {
                setIsRequestingPresentation(true);
            } else if (checkpoint >= appCheckpoints.presentationPassed) {
                if (true) {
                    setIsRequestingPresentation(false);
                    setIsRequestingAuth(true);
                }
            }
            setReady(true);
        }
    }, [storePersistentReady]);

    return (
        <>
            {/* {!ready && (
                <View style={[styles.loadingWindow]}>
                    <View style={[styles.logoCtn]}>
                        <SimpleAnimation delay={0} duration={300} fade staticType="zoom">
                            <Image source={require('./assets/img/logo.png')} style={styles.logo} />
                        </SimpleAnimation>
                    </View>
                    <SimpleAnimation delay={0} duration={600} direction={'up'} distance={200} movementType={'slide'} fade>
                        <Text style={styles.bigTitle}>Quiet</Text>
                    </SimpleAnimation>
                </View>
            )} */}
            {ready && isRequestingPresentation && (
                <NavigationContainer theme={nativeTheme === 'dark' ? ThemeDark : ThemeLight}>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="ActivityPresentation"
                            component={ActivityPresentation}
                            options={{
                                headerShown: false,
                                gestureEnabled: false,
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    loadingWindow: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoCtn: {
        marginTop: -100,
        width: 100,
        height: 100,
    },
    logo: {
        width: 100,
        height: 100,
    },
    bigTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        color: 'black',
    },
});
