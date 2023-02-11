import { useTheme } from '@react-navigation/native';
import { StyleSheet, View, Text, Image, Easing } from 'react-native';
import RootCSS from '../../assets/root';
import { CustomTheme } from '../../assets/themes';

import useTranslation from '../../composables/useTranslation';

import BaseAnimationChain, { TEntryAnimationProps } from '../BaseAnimationChain';

type Props = {
    onFinishAnimation?: Function;
    enable?: boolean;
};

export default function Welcome(props: Props) {
    const { translate } = useTranslation();
    const theme = useTheme() as CustomTheme;
    const enabled = props.enable !== undefined ? props.enable : true;
    let linkImageTouchHand;
    
    switch (true) {
        case theme.name === 'light':
            linkImageTouchHand = require('../../assets/img/touch-screen-line-light.png');
            break;
        case theme.name === 'dark':
            linkImageTouchHand = require('../../assets/img/touch-screen-line-dark.png');
            break;
    }

    const animationSequencesTextWelcome: TEntryAnimationProps[] = [
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
                    from: [0, -20],
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

    const animationSequencesTextOn: TEntryAnimationProps[] = [
        {
            sequences: [
                {
                    type: 'fade',
                    mode: 'in',
                    duration: 1000,
                    delay: 1500,
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

    const animationSequencesCtnLogo: TEntryAnimationProps[] = [
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
    const animationSequencesLogoImage: TEntryAnimationProps[] = [
        {
            sequences: [
                {
                    type: 'slide',
                    from: [0, -250],
                    duration: 1000,
                    delay: 3300,
                    easing: Easing.out(Easing.exp),
                },
            ],
        },
    ];
    const animationSequencesLogoTitle: TEntryAnimationProps[] = [
        {
            sequences: [
                {
                    type: 'slide',
                    from: [0, 250],
                    duration: 1000,
                    delay: 3300,
                    easing: Easing.out(Easing.exp),
                },
            ],
        },
    ];

    const animationSequencesTextDescription: TEntryAnimationProps[] = [
        {
            sequences: [
                {
                    type: 'fade',
                    mode: 'in',
                    duration: 1200,
                    delay: 5500,
                    easing: Easing.out(Easing.linear),
                },
            ],
            onFinish: props.onFinishAnimation
        },
    ];

    const animationSequencesSlideTouch: TEntryAnimationProps[] = [
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

    const animationSequencesSlideTouchHand:TEntryAnimationProps[] = [
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
    ]
    return (
        <View style={[RootCSS.container, RootCSS.justifyCenter, RootCSS.alignCenter]}>
            <Text>ENABLED : {enabled ? 'true' : 'false' }</Text>
            <BaseAnimationChain animations={animationSequencesTextWelcome} disabled={!enabled}>
                <Text style={styles.textWelcome}>{translate('w.welcome')}</Text>
            </BaseAnimationChain>
            <BaseAnimationChain animations={animationSequencesTextOn} disabled={!enabled}>
                <Text style={styles.textOn}>{translate('w.on')}</Text>
            </BaseAnimationChain>

            <BaseAnimationChain animations={animationSequencesCtnLogo} disabled={!enabled}>
                <View style={styles.logoContainer}>
                    <BaseAnimationChain animations={animationSequencesLogoImage} disabled={!enabled}>
                        <Image source={require('../../assets/img/logo.png')} style={styles.logo} />
                    </BaseAnimationChain>
                    <BaseAnimationChain animations={animationSequencesLogoTitle} disabled={!enabled}>
                        <Text style={styles.textApp}>Quiet</Text>
                    </BaseAnimationChain>
                </View>
            </BaseAnimationChain>
            <BaseAnimationChain animations={animationSequencesTextDescription} disabled={!enabled}>
                <View style={styles.logoContainer}>
                    <Text style={styles.textDescription}>{translate('present.description')}</Text>
                </View>
            </BaseAnimationChain>
            <BaseAnimationChain animations={animationSequencesSlideTouch} disabled={!enabled}>
                <View style={styles.touchContainer}>
                    <BaseAnimationChain animations={animationSequencesSlideTouchHand} infinite={true} disabled={!enabled}>
                        <Image source={linkImageTouchHand} style={styles.touchIcon} />
                    </BaseAnimationChain>
                </View>
            </BaseAnimationChain>
        </View>
    );
}

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
