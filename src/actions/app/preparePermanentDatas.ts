import useDevice from '../../composables/useDevice';
import useStorages from '../../composables/useStorages';

import Store from '../../stores/configureStore';
import { setPersistentStates, persistentStates } from '../../stores/app/appSlice';

export default async () => {
    console.log('preparePermanentDatas');
    const device = await useDevice();
    useStorages.runMMKVPerm(device.uniqId);
    const MMKVPerm = useStorages.getMMKVPerm();
    console.log('[MMKVPerm Existent Keys] => ', MMKVPerm.getAllKeys());
    const states = Object.keys(persistentStates).reduce((a, v) => 
        ({ ...a, [v]: !['checkpoint'].includes(v) ? MMKVPerm.getString(v) : MMKVPerm.getNumber(v)}), {})
    console.log('[PersistentStates] => ', states);
    Store.dispatch(setPersistentStates(states))
};
