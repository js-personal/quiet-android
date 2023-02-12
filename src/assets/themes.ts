import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';

export interface CustomTheme extends Theme {
    name: string
}

export const ThemeLight:CustomTheme = {
    ...DefaultTheme,
    dark: false,
    name: 'light',
    colors: {
        ...DefaultTheme.colors,
        background: '#fff',
        text: '#000',
        notification: '#fff',
        primary: '#93d5ff',
    },
}

export const ThemeDark:CustomTheme = {
    ...DarkTheme,
    dark: true,
    name: 'dark',
    colors: {
        ...DarkTheme.colors,
        background: '#000',
        text: '#fff',
        notification: '#000',
        primary: '#93d5ff',
    },
}
