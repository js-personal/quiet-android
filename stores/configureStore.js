import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import appReducer from './app/appSlice';
import clientReducer from './client/clientSlice';
// import profileReducer from './modules/profile/profileSlice'

const store = configureStore({
    reducer: {
        app: appReducer,
        client: clientReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
    // .concat(logger)
});

export default store;
