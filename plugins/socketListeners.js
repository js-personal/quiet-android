
import React from "react";
import Store from '../stores/configureStore';
import {
    setActiveMessenger
} from '../stores/modules/client/clientSlice';

import {
    updateBase,
    fluxUpdate,
    fluxDelete,
    fluxEventAdd,
    fluxEventUpdate,
    fluxUserStatus,
} from '../stores/modules/profile/profileSlice';

export default function(ws) {
    /* Socket on close */

    /* Socket Get Auth */

    console.log('LOADING WS LISTENERS');
    ws.getAuth(Store.getState().client.xdevice,Store.getState().client.xsession);
    /* Socket Receive Auth */
    ws.on(ws.TYPES_RECEIVE.PING, (data) => {
        ws.pong()
    })
    ws.on(ws.TYPES_RECEIVE.SET_AUTH, (data) => {

        console.log('RECEIVING AUTH');
        ws._registerAuth(data);
        ws.joinFluxRooms();
    })

    ws.on(ws.TYPES_RECEIVE.SET_MK, (data) => {


    })

    ws.on(ws.TYPES_RECEIVE.SET_BASE, (data) => {
        console.log('RECEIVE WS SET BASE');
        Store.dispatch(updateBase(data));
    })

    ws.on(ws.TYPES_RECEIVE.FLUX_DELETE, (data) => {
        console.log('WSS: FluxDelete');
        console.log('RECEIVE FLUX DELETE');
        // if (data === Store.getState().client.activeMessenger) {
        //     Store.dispatch(setActiveMessenger(null));
        // }
        Store.dispatch(fluxDelete(data));
    })
    /* Socket Receive Flux Message */
    ws.on(ws.TYPES_RECEIVE.RECEIVE_MESSAGE, (data) => {
        Store.dispatch(fluxEventAdd({
            flux: data.flux,
            event: data.event
        }));
        // EventBus.$emit('Messenger::newMessage');
    })
    /* Socket Receive NOTIFICATIONS */
    ws.on(ws.TYPES_RECEIVE.NOTIFICATIONS, (data) => {
        ws._handleNotifications(data);
    })
    /* Socket Receive Flux Update */
    ws.on(ws.TYPES_RECEIVE.FLUX_UPDATE, (data) => {
        console.log('WSS: FluxUpdate');
        Store.dispatch(fluxUpdate(data));
    })
    /* Socket Receive Event Update */
    ws.on(ws.TYPES_RECEIVE.FLUX_EVENT_UPDATE, (data) => {
        Store.dispatch(fluxEventUpdate(data));
    })

    /* Socket Receive User Online */
    ws.on(ws.TYPES_RECEIVE.USER_STATUS, (data) => {
        Store.dispatch(fluxUserStatus(data));
    })

}
