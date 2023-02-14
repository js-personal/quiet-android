import { FlexAlignType, ViewStyle } from "react-native";

export default {
    container: {
        flex: 1,
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    justifyBetween: {
        justifyContent: 'space-between',
    },
    alignCenter: {
        alignItems: 'center'
    },
    verticalMiddle: {
        verticalAlign: 'middle',
    },
    directionRow: {
        flexDirection: 'row'
    },

} as { [key: string]: ViewStyle };
