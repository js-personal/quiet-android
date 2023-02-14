import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


export type TClientStates = {
    base: object | null,
}

const initialState: TClientStates = {
    base: null,
}


const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        setBase(state, action) {
            state.base = action.payload;
        },
    },
})

export const { setBase } = clientSlice.actions

export default clientSlice.reducer