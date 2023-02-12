import { name as appName } from './app.json';
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { Provider } from 'react-redux';

import stores from './src/stores/configureStore';
console.log(appName);
const RNRedux = () => (
    <Provider store={stores}>
        <App />
    </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
