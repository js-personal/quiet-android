
import DeviceInfo from 'react-native-device-info';

export type TDevice = {
    brand: string
    buildId: string
    buildNumber: string
    bundleId: string
    deviceName: string
    devicePhoneNumber: string
    fontScale: number,
    isTablet: boolean
    manufacturer: string
    systemName: string
    systemVersion: string
    type: string
    uniqId: string
    macAddress: string

}

let device:TDevice;

export default async function() {
    if (!device) {
        device = {
            brand: DeviceInfo.getBrand(),
            buildId: DeviceInfo.getBuildIdSync(),
            buildNumber: DeviceInfo.getBuildNumber(),
            bundleId: DeviceInfo.getBundleId(),
            deviceName: await DeviceInfo.getDeviceName(),
            devicePhoneNumber: await DeviceInfo.getPhoneNumber(),
            fontScale: await DeviceInfo.getFontScale(),
            isTablet: DeviceInfo.isTablet(),
            manufacturer: await DeviceInfo.getManufacturer(),
            systemName: DeviceInfo.getSystemName(),
            systemVersion: DeviceInfo.getSystemVersion(),
            type: await DeviceInfo.getType(),
            uniqId: await DeviceInfo.getUniqueId(),
            macAddress: await DeviceInfo.getMacAddress(),
        }
    }
    return device;
}