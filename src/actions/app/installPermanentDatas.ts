// import { sha1 } from 'react-native-sha1';
// import { stringMd5 } from 'react-native-quick-md5';
import useDevice from '../../composables/useDevice';
import useStorages from '../../composables/useStorages';

import Store from '../../stores/configureStore';
import { setPermanentUniqID } from '../../stores/app/appSlice';
import { MEM_STORAGE_UID } from '../../app.memory';


export default async () => {
    console.log('installPermanentDatas');
    const device = await useDevice();
    const MMKVPerm = useStorages.getMMKVPerm();
    const permanentUniqID = 'test';
    console.warn('DevNote: Must create permanentUniqID based on device id unique hash');
    console.log('permanentUniqID : ', permanentUniqID);
    Store.dispatch(setPermanentUniqID(permanentUniqID))
    MMKVPerm.set(MEM_STORAGE_UID, permanentUniqID);
};
