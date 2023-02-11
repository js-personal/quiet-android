
import { object as FluxEvent } from '../../../../class/flux.event.js'
import {useSelector} from "react-redux";
import Crypter from '../../../../plugins/crypter'
import GlobalSocket from "../../../../sockets/GlobalSocket";
import Store from '../../../configureStore';
import { fluxEventAdd, fluxEventUpdate } from '../profileSlice';
import Fetcher from '../../../../plugins/fetcher';
import {
    FLUX_SEND_MESSAGE,
} from '../../../../api.routes';

export default function actionFluxEventSend(profile, flux, dataToSend) {

    return new Promise((resolve, reject) => {
        let event = new FluxEvent({
            data: dataToSend,
            origin: 'client',
            originId: profile.key,
            target: flux.key
        });
        let eventSocket = new FluxEvent({
            data: dataToSend,
            origin: 'client',
            originId: profile.key,
            target: flux.key,
            encrypted: true,
        });
        Store.dispatch(fluxEventAdd({
            event: event.getObject(),
            flux: flux.key,
        }));
        try {

            eventSocket.setKey(event.getKey());
            eventSocket.encryptData(Crypter.AES.CBC.ENCODE, flux.mk)

            Fetcher(
                FLUX_SEND_MESSAGE.METHOD,
                FLUX_SEND_MESSAGE.URL,
                {
                    flux: flux.key,
                    event: eventSocket.getObject()
                }
            ).then((response) => {
                if (!response.error && response.data) {
                    Store.dispatch(fluxEventUpdate({
                        event: event.getObject(),
                        key: response.data.key,
                        value: response.data.value,
                    }))
                    resolve(true);
                }
                else resolve(false);


            })
        }
        catch(e) {
            Store.dispatch(fluxEventUpdate({
                event: event.getObject(),
                key: 'status',
                value: 2,
            }))
            resolve(false);
        }

    })

}
