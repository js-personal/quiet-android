// import { sha1 } from 'react-native-sha1';
// import { stringMd5 } from 'react-native-quick-md5';
import {Platform} from 'react-native';
import useStorages from '@composables/useStorages';

import Store from '@stores/configureStore';
import { setPermanentUniqID } from '@stores/app/appSlice';
import { MEM_STORAGE_UID } from '@memory';
import useDevice, { TDevice } from '@composables/useDevice';


export default async () => {
    console.log('installPermanentDatas');
    const MMKVPerm = useStorages.getMMKVPerm();
    const permanentUniqID = 'prout'; //DevNote create unique permanent KEY derived from device infos
    console.log('DevNote: Must create permanentUniqID based on device id unique hash');
    console.log('permanentUniqID : ', permanentUniqID);
    Store.dispatch(setPermanentUniqID(permanentUniqID))
    MMKVPerm.set(MEM_STORAGE_UID, permanentUniqID);
};
