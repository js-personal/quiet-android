import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import Store from '../stores/configureStore';
import Fetcher from '../plugins/fetcher';
import { PROFILE_NOTIFICATIONS_SUBSCRIPTION } from '../api.routes'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
    }),
});

export const constructor = function() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(async () => {
        //registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        registerForPushNotificationsAsync().then(token => {
            Fetcher(
                PROFILE_NOTIFICATIONS_SUBSCRIPTION.METHOD,
                PROFILE_NOTIFICATIONS_SUBSCRIPTION.URL,
                {
                    token
                }
            ).then((response) => {
                setExpoPushToken(token);
            })
        });

        // const token = await Notifications.getDevicePushTokenAsync();
        // Fetcher(
        //     PROFILE_NOTIFICATIONS_SUBSCRIPTION.METHOD,
        //     PROFILE_NOTIFICATIONS_SUBSCRIPTION.URL,
        //     {
        //         token
        //     }
        // ).then((response) => {
        //     console.log('response from subscription');
        //     console.log(response);
        // })

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            console.log('notification');
            console.log(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('response notif');
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);
}

export const schedulePushNotification = async function(title, body, data={}) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            data: data,
        },
        trigger: { seconds: 1 },
    });
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}
