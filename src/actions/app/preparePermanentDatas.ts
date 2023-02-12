import useDevice from '@composables/useDevice';
import useStorages from '@composables/useStorages';

import Store from '@stores/configureStore';
import { setPersistentStates, persistentStates } from '@stores/app/appSlice';
import { FORCE_REFRESH_MMKV_PERMANENT } from '@config'

export default async () => {
    console.log('preparePermanentDatas');
    const device = await useDevice();
    const qID = await device.getQID()
    const MMKVPerm = useStorages.runMMKVPerm(qID);
    if (FORCE_REFRESH_MMKV_PERMANENT) {
        console.warn('DevNote: MMKV force refresh by ./app.config');
        MMKVPerm.getAllKeys().forEach((key) => {
            MMKVPerm.delete(key);
        })
    }
    console.log('[MMKVPerm Existent Keys] => ', MMKVPerm.getAllKeys());
    const states = Object.keys(persistentStates).reduce((a, v) => 
        ({ ...a, [v]: !['checkpoint'].includes(v) ? MMKVPerm.getString(v) : MMKVPerm.getNumber(v)}), {})
    console.log('[PersistentStates] => ', states);
    Store.dispatch(setPersistentStates(states))
};
