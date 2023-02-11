
import { object as FluxEvent } from '../../../../class/flux.event.js'
import {useSelector} from "react-redux";
import Crypter from '../../../../plugins/crypter'
import Store from '../../../configureStore';
import { fluxEventUpdate } from '../profileSlice';

export default async function flux_event_decryption(event) {
    return new Promise((res) => {
        let state = Store.getState().profile;

        let fluxIndex = Object.keys(state.fluxes).find((e) => e === event.target);
        let mk = state.fluxes[fluxIndex].mk;

        try {
            let decoded =  Crypter.AES.CBC.DECODE(mk, event.data);
            Store.dispatch(fluxEventUpdate(
                {
                    event: event,
                    flux: event.target,
                    key: 'data',
                    value: decoded
                }
            ));
            Store.dispatch(fluxEventUpdate(
                {
                    event: event,
                    flux: event.target,
                    key: 'encrypted',
                    value: false
                }
            ));
            res(true);
        }catch(e) {
            Store.dispatch(fluxEventUpdate(
                {
                    event: event,
                    flux: event.target,
                    key: 'status',
                    value: 2
                }
            ));
            res(false)
        }
    })





}
