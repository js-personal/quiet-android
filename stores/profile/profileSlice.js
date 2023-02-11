import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    id: false,
    key: false,
    nickname: false,
    fluxes: {},
}


const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {

        updateBase(state, action) {
            if (!action.payload) {
                return {
                    id: false,
                    key: false,
                    nickname: false,
                    fluxes: {}
                }
            } else {
                let a = {...state};
                Object.keys(action.payload).forEach((key) => {
                    a[key] = action.payload[key]
                })

                if (action.payload.fluxes) {
                    let fluxes = {};
                    action.payload.fluxes.forEach((flux) => {
                        fluxes[flux.key] = flux;
                        let events = {};
                        flux.events.forEach((event) => {
                            events[event.key] = event;
                        })
                        fluxes[flux.key].events = events;
                        // if (!fluxes.invite_key) fluxes.invite_key = undefined;
                    })
                    a.fluxes = fluxes;
                }
                return {
                    ...a,
                };
            }

        },


        fluxUpdate(state, action) {
            const flux = action.payload;
            let events = {};
            flux.events.forEach((event) => {
                events[event.key] = event;
            })
            flux.events = events;
            state.fluxes[flux.key] = flux
            // return {
            //     ...state,
            //     fluxes: {
            //         ...state.fluxes,
            //         [action.payload.key]: action.payload,
            //     }
            // };
        },
        
        fluxDelete(state, action) {
            const fluxKey = action.payload;
            delete state.fluxes[fluxKey];
        },

        fluxEventUpdate(state, action) {
            const key = action.payload.key;
            const value = action.payload.value;
            const event = action.payload.event
            if (state.fluxes[event.target]) {
                state.fluxes[event.target].events[event.key][key] = value;
            }
        },

        fluxEventAdd(state, action) {
            let event = action.payload.event;
            const flux = action.payload.flux;
            const index = Object.keys(state.fluxes).find((e) => (e === flux))
            return {
                ...state,
                fluxes: {
                    ...state.fluxes,
                    [index]: {
                        ...state.fluxes[index],
                        events: {
                            ...state.fluxes[index].events,
                            [event.key]: event
                        }
                    }
                }
            }
        },

        fluxUserStatus(state, action) {
            const flux = action.payload.flux;
            const profile = action.payload.profile;
            const status = action.payload.status;
            if (state.fluxes[flux]) {
                if (state.fluxes[flux].owner.key === profile) state.fluxes[flux].owner.online = status;
                else {
                    for (let client in state.fluxes[flux].clients) {
                        if (state.fluxes[flux].clients[client].key === profile) {
                            state.fluxes[flux].clients[client].online = status;
                        }
                    }
                }
            }

        },

        fluxUpdateOptions(state, action) {
            const flux = action.payload.flux;
            const options = action.payload.options;
            state.fluxes[flux].options = options;
        }


    }
})

export const {
    updateBase,
    fluxUpdate,
    fluxDelete,
    fluxEventUpdate,
    fluxEventAdd,
    fluxUserStatus,
    fluxUpdateOptions
} = profileSlice.actions

export default profileSlice.reducer