
type TEventListeners = {
    [name: string]: Function[]
}

const EventListeners: TEventListeners = {};

function _remove(array: Function[], item: Function) {
    if (!array) return;
    for (let i = 0, l = array.length; i < l; i++) {
        if (item === array[i]) array.splice(i, 1);
    }
}

export const fireEvent = (eventName: string, data: object) => {
    let listeners = EventListeners[eventName];
    if (Array.isArray(listeners)) {
        listeners.map(listener => {
            if (typeof listener === 'function') {
                listener(data);
            }
        });
    }
};
export const addListener = (eventName: string, listener: Function) => {
    let listeners = EventListeners[eventName];
    if (Array.isArray(listeners)) {
        listeners.push(listener);
    } else {
        EventListeners[eventName] = [listener];
    }
};

export const removeListener = (listener: Function) => {
    Object.keys(EventListeners).map(eventName => {
        let listeners = EventListeners[eventName];
        _remove(listeners, listener);
        if (listeners.length === 0) {
            delete EventListeners[eventName];
        }
    });
};

export default () => ({
    fireEvent,
    addListener,
    removeListener,
})