import { Alert} from 'react-native';
import i18n from "i18n-js";

import { schedulePushNotification } from '../methods/notificationsHandler';
import * as Notifications from 'expo-notifications'

const NOTIFICATION_TYPES = {
    BI_FLUX_JOIN: 'biFluxJoin',

}
export default {
    react(data) {
        const type = data.type, message = data.data;
        switch (type) {
            case NOTIFICATION_TYPES.BI_FLUX_JOIN:
                Alert.alert(
                    "Flux",
                    i18n.t('app.flux.someone_join'),
                    [
                        { text: "OK" }
                    ]
                );
                schedulePushNotification(
                    'Nouveau Flux',
                    'Un contact a rejoint l\'un de vos flux!',
                    data
                );
                break;
            default: return;
        }
    }
}
