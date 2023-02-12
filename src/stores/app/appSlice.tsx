import { createSlice, createAsyncThunk, Slice } from '@reduxjs/toolkit';
import { MEM_STORAGE_UID } from '../../app.memory';

export const appCheckpoints = {
    justInstalled: 1,
    presentationPassed: 2,
} as const;

export type TAppCheckpoints = typeof appCheckpoints;

export const appLanguages = {
    fr: 'fr',
    en: 'en',
} as const;
export type TAppLanguages = typeof appLanguages;

export type TAppPersistentStates = {
    language: keyof TAppLanguages;
    checkpoint: number;
    activeSession: string | null;
    activeFlow: string | null;
};

export type TAppDynamicStates = {
    persistentReady: boolean;
};

export type TAppStates = TAppPersistentStates & TAppDynamicStates;

export const persistentStates: TAppPersistentStates = {
    language: appLanguages.fr,
    [MEM_STORAGE_UID]: null,
    checkpoint: appCheckpoints.justInstalled,
    activeSession: null,
    activeFlow: null,
};

export const dynamicStates: TAppDynamicStates = {
    persistentReady: false,
};

const appSlice: Slice = createSlice({
    name: 'app',
    initialState: { ...persistentStates, ...dynamicStates } as TAppStates,
    reducers: {
        setPersistentStates(state, action) {
            for (const [key, value] of Object.entries(action.payload)) {
                if (value) state[key] = value;
            }
            state.persistentReady = true;
        },
        setPermanentUniqID(state, action) {
            state[MEM_STORAGE_UID] = action.payload;
        },
        setCheckpoint(state, action) {
            state.checkpoint = action.payload;
        },
        setLanguage(state, action) {
            state.language = action.payload;
        },
        setActiveSession(state, action) {
            state.activeFlow = action.payload;
        },
        setActiveFlow(state, action) {
            state.activeFlow = action.payload;
        },
    },
});

export const { setPersistentStates, setPermanentUniqID, setLanguage, setCheckpoint, setActiveSession, setActiveFlow } =
    appSlice.actions;

export default appSlice.reducer;
