
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';;
import { MEM_DEVICE_PLATFORMS } from '@memory';
// export type TDevice = {
//     brand: string
//     buildId: string
//     buildNumber: string
//     bundleId: string
//     deviceName: string
//     devicePhoneNumber: string
//     fontScale: number,
//     isTablet: boolean
//     manufacturer: string
//     systemName: string
//     systemVersion: string
//     type: string
//     uniqId: string
//     macAddress: string
// }

type TDeviceAndroid = {
    getPlatform: () => string | undefined
    getUniqueID: () => Promise<string | undefined>
    getQID: () => Promise<string>
}

type TDeviceIOS= TDeviceAndroid;

export type TDevice = (TDeviceAndroid | TDeviceIOS)

let Device:TDevice;

const useDevice = async(): Promise<TDevice> => {
    if (!Device) {
        if (Platform.OS === MEM_DEVICE_PLATFORMS.ANDROID) Device = new DeviceAndroid();
        else if (Platform.OS === MEM_DEVICE_PLATFORMS.IOS) Device = new DeviceIOS();
    }
    return Device;
}

export default useDevice;

class DeviceAndroid {

    protected platform: string;
    protected brand?: string
    protected buildId?: string
    protected buildNumber?: string
    protected bundleId?: string
    protected deviceName?: string
    protected devicePhoneNumber?: string
    protected fontScale?: number
    protected isTablet?: boolean
    protected manufacturer?: string
    protected systemName?: string
    protected systemVersion?: string
    protected type?: string
    protected uniqId?: string
    protected macAddress?: string

    constructor() {
        this.platform = MEM_DEVICE_PLATFORMS.ANDROID
    }

    public getPlatform(): string { 
        return !this.platform ? this.platform = Platform.OS && this.platform : this.platform;
    }

    public async getUniqueID(): Promise<string | undefined> {
        if  (!this.uniqId) {
            this.uniqId = await DeviceInfo.getUniqueId() as string
            return this.uniqId;
        }
    }

    public async getQID(): Promise<string> {
        console.log(await DeviceInfo.getManufacturer());
        console.log(await DeviceInfo.getModel());
        console.log(await DeviceInfo.getSerialNumber());
        console.log(await DeviceInfo.getType());
        return 'test'
    }

    //         platform: Platform.OS,
    //         brand: DeviceInfo.getBrand(),
    //         buildId: DeviceInfo.getBuildIdSync(),
    //         buildNumber: DeviceInfo.getBuildNumber(),
    //         bundleId: DeviceInfo.getBundleId(),
    //         deviceName: await DeviceInfo.getDeviceName(),
    //         devicePhoneNumber: await DeviceInfo.getPhoneNumber(),
    //         fontScale: await DeviceInfo.getFontScale(),
    //         isTablet: DeviceInfo.isTablet(),
    //         manufacturer: await DeviceInfo.getManufacturer(),
    //         systemName: DeviceInfo.getSystemName(),
    //         systemVersion: DeviceInfo.getSystemVersion(),
    //         type: await DeviceInfo.getType(),
    //         uniqId: await DeviceInfo.getUniqueId(),
    //         macAddress: await DeviceInfo.getMacAddress(),

}

class DeviceIOS extends DeviceAndroid {
    protected platform: string;
    constructor() {
        super();
        this.platform = MEM_DEVICE_PLATFORMS.IOS
    }
}