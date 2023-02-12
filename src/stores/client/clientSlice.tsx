import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


export type TClientStates = {
    xsession: string | null,
    ready: boolean,
}

const initialState: TClientStates = {
    xsession: null,
    ready: false,
}

export const getSessionData = createAsyncThunk('client/getSessionData', async () => {
    const keys = Object.keys(initialState);
    const gets = ''
    return gets;
})


const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        setXSESSION(state, action) {
            state.xsession = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getSessionData.pending, (state: TClientStates, { payload }) => {
                state.ready = false
            })
            .addCase(getSessionData.fulfilled, (state: TClientStates, { payload }) => {
                for (const [key, value] of payload) {
                    //@ts-ignore
                    state[key as keyof TClientStates] = value || initialState[key as keyof TClientStates];
                }
                state.ready = true;
            })
    }
})

export const { setXSESSION } = clientSlice.actions

export default clientSlice.reducer