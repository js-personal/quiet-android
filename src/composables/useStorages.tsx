import { MMKV } from 'react-native-mmkv'
import {name as appName} from '../../app.json';
import base64 from 'react-native-base64'

let MMKVPerm: MMKV;
let MMKVUsers: MMKV;

export default {
    //MMKV Connectors
    runMMKVPerm(key: string) {
        if (!MMKVPerm)
            MMKVPerm = new MMKV({
                id: `${appName}-storage-permanent`,
                encryptionKey: base64.encode(key)
            })
    },
    runMMKVUsers(deviceId: string, userId: string) {
        if (!MMKVUsers)
            MMKVUsers = new MMKV({
                id: `${userId}-storage`,
                path: `/s-${userId}`,
                encryptionKey: base64.encode(deviceId)
            })
    },
    getMMKVPerm: () => (MMKVPerm),
    getMMKVUsers: () => (MMKVUsers),
}
