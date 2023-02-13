import { useTheme } from '@react-navigation/native';
import { StyleSheet, View, Text, Image, Easing } from 'react-native';
import RootCSS from '@assets/root';
import { CustomTheme } from '@assets/themes';

import useTranslation from '@composables/useTranslation';

import BaseAnimationChain, { TEntryFrameProps } from '@components/BaseAnimationChain';
import { memo } from 'react';

type Props = {
    onFinishAnimation?: Function;
    enable?: boolean;
};

export default memo((props: Props) => {
    const { translate } = useTranslation();
    const theme = useTheme() as CustomTheme;
    const enabled = props.enable !== undefined ? props.enable : true;
    let linkImageTouchHand;
    // console.log('Render slide Welcome');
    switch (true) {
        case theme.name === 'light':
            linkImageTouchHand = require('@assets/img/touch-screen-line-light.png');
            break;
        case theme.name === 'dark':
            linkImageTouchHand = require('@assets/img/touch-screen-line-dark.png');
            break;
    }

    const framesTextWelcome: TEntryFrameProps[] = [
        {
            sequences: [
                {
                    type: 'fade',
                    mode: 'in',
                    duration: 500,
                    delay: 0,
                    easing: Easing.in(Easing.exp),
                },
                {
                    type: 'slide',
                    from: [0, -100],
                    duration: 1000,
                    delay: 0,
                    easing: Easing.out(Easing.exp),
                },
            ],
        },
        {
            sequences: [
                {
                    type: 'fade',
                    mode: 'out',
                    duration: 300,
                    delay: 0,
                    easing: Easing.out(Easing.linear),
                },
            ],
        },
    ];

    const framesTextOn: TEntryFrameProps[] = [
        {
            sequences: [
                {
                    type: 'fade',
                    mode: 'in',
                    duration: 1000,
                    delay: 1700,
                    easing: Easing.out(Easing.linear),
                },
            ],
        },
        {
            sequences: [
                {
                    type: 'fade',
                    mode: 'out',
                    duration: 1000,
                    easing: Easing.out(Easing.linear),
                    delay: 0,
                },
            ],
        },
    ];

    const framesCtnLogo: TEntryFrameProps[] = [
        {
            sequences: [
                {
                    type: 'fade',
                    mode: 'in',
                    duration: 1000,
                    delay: 3500,
                    easing: Easing.out(Easing.linear),
                },
            ],
        },
    ];
    const framesLogoImage: TEntryFrameProps[] = [
        {
            sequences: [
                {
                    type: 'slide',
                    from: [0, -250],
                    duration: 1500,
                    delay: 3300,
                    easing: Easing.out(Easing.exp),
                },
            ],
        },
    ];
    const framesLogoTitle: TEntryFrameProps[] = [
        {
            sequences: [
                {
                    type: 'slide',
                    from: [0, 250],
                    duration: 1500,
                    delay: 3300,
                    easing: Easing.out(Easing.exp),
                },
            ],
        },
    ];

    const framesTextDescription: TEntryFrameProps[] = [
        {
            sequences: [
                {
                    type: 'fade',
                    mode: 'in',
                    duration: 1200,
                    delay: 5500,
                    easing: Easing.out(Easing.linear),
                }
            ],
            onFinish: props.onFinishAnimation,
        },
    ];

    const framesSlideTouch: TEntryFrameProps[] = [
        {
            sequences: [
                {
                    type: 'fade',
                    mode: 'in',
                    duration: 1200,
                    delay: 7500,
                    easing: Easing.out(Easing.linear),
                },
            ],
        },
    ];

    const framesSlideTouchHand: TEntryFrameProps[] = [
        {
            sequences: [
                {
                    type: 'fade',
                    mode: 'in',
                    duration: 1200,
                    easing: Easing.out(Easing.linear),
                },
                {
                    type: 'slide',
                    from: [100, 0],
                    duration: 2000,
                    easing: Easing.in(Easing.exp),
                },
            ],
        },
        {
            sequences: [
                {
                    type: 'slide',
                    to: [-100, 0],
                    duration: 2000,
                    easing: Easing.out(Easing.exp),
                },
                {
                    type: 'fade',
                    mode: 'out',
                    duration: 1200,
                    easing: Easing.out(Easing.linear),
                },
            ],
        },
    ];

    return (
        <View style={[RootCSS.container, RootCSS.justifyCenter, RootCSS.alignCenter]}>
            <BaseAnimationChain frames={framesTextWelcome} disabled={!enabled} restartAfterDisable={true}>
                <Text style={styles.textWelcome}>{translate('w.welcome')}</Text>
            </BaseAnimationChain>
            <BaseAnimationChain frames={framesTextOn} disabled={!enabled} restartAfterDisable={true}>
                <Text style={styles.textOn}>{translate('w.on')}</Text>
            </BaseAnimationChain>

            <BaseAnimationChain frames={framesCtnLogo} disabled={!enabled} restartAfterDisable={true}>
                <View style={styles.logoContainer}>
                    <BaseAnimationChain frames={framesLogoImage} disabled={!enabled} restartAfterDisable={true}>
                        <Image source={require('@assets/img/logo.png')} style={styles.logo} />
                    </BaseAnimationChain>
                    <BaseAnimationChain frames={framesLogoTitle} disabled={!enabled} restartAfterDisable={true}>
                        <Text style={styles.textApp}>Quiet</Text>
                    </BaseAnimationChain>
                </View>
            </BaseAnimationChain>
            <BaseAnimationChain frames={framesTextDescription} disabled={!enabled} restartAfterDisable={true}>
                <View style={styles.logoContainer}>
                    <Text style={styles.textDescription}>{translate('present.description')}</Text>
                </View>
            </BaseAnimationChain>
            <BaseAnimationChain frames={framesSlideTouch} disabled={!enabled}>
                <View style={styles.touchContainer}>
                    <BaseAnimationChain frames={framesSlideTouchHand} infinite={true} disabled={!enabled}>
                        <Image source={linkImageTouchHand} style={styles.touchIcon} />
                    </BaseAnimationChain>
                </View>
            </BaseAnimationChain>
        </View>
    );
});

const styles = StyleSheet.create({
    textWelcome: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        color: 'black',
        textTransform: 'capitalize',
        position: 'absolute',
        alignSelf: 'center',
        bottom: '-5%',
    },
    textOn: {
        fontSize: 30,
        textAlign: 'center',
        marginTop: 0,
        color: 'black',
        position: 'absolute',
        alignSelf: 'center',
        bottom: '-5%',
    },
    logoContainer: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: '5%',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
    },
    textApp: {
        flex: 1,
        textAlign: 'center',
        marginTop: 0,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 60,
    },
    textDescription: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        top: 30,
    },
    touchContainer: {
        position: 'absolute',
        alignSelf: 'center',
        left: 0,
        top: 140,
        alignItems: 'center',
    },
    touchIcon: {
        width: 50,
        height: 50,
        position: 'absolute',
        alignSelf: 'center',
    },
});
