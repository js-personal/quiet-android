import React, {useEffect, useState, useRef, forwardRef} from 'react';
import socketListeners from '../methods/socketListeners';
import socketNotificationsHandler from '../plugins/socketNotificationsHandler';

const CONFIG = require("../config");
let memoryPath = null;

const TYPES_SEND = {
    PONG: 'pong',
    GET_AUTH: 'auth',
    SEND_MESSAGE: 'onSendMessage',
    JOIN_FLUXROOMS: 'onJoinFluxRooms',
    ON_VIEWED: 'onViewed',
}
const TYPES_RECEIVE = {
    PING: 'ping',
    SET_AUTH: 'setAuth',
    SET_MK: 'setMK',
    SET_BASE: 'setBase',
    RECEIVE_MESSAGE: 'receiveMessage',
    FLUX_UPDATE: 'fluxUpdate',
    FLUX_DELETE: 'fluxDelete',
    FLUX_EVENT_UPDATE: 'eventUpdate',
    USER_STATUS: 'userStatus',
    NOTIFICATIONS: 'receiveNotification',
}
let auth = null
let ws = null;
let timeReconnect = 1000;
let intervalReconnect = null;
let reconnect = true;

module.exports = {
    /***************
     * BASE STRUCTURE
     *****************/
            memoryPath: null,
            methods: {},
            TYPES_RECEIVE: TYPES_RECEIVE,

            connect() {
                const [wss, setWss] = useState(false);
                let _this = this;

                this.reconnect = function() {
                    reconnect = true;
                    if (ws) ws.close();
                    build()
                }

                let build = () => {
                    let websocket = new WebSocket(CONFIG.default.SOCKET_URL);
                    websocket.onopen = () => {
                        reconnect = true;
                        ws = websocket;
                        setWss(websocket);
                        clearTimeout(intervalReconnect);
                        console.log('#> Socked connected.')
                        websocket.onmessage = (event) => {
                            let data;
                            try {
                                data = JSON.parse(event.data);
                            } catch {
                            }
                            let type = data.type;
                            if (_this.methods[type]) _this.methods[type](data.data)
                        }

                        websocket.onclose = () => {
                            console.log('#> Socked closed.')
                            setWss(false);
                                intervalReconnect = setTimeout(() => {
                                    build();
                                }, timeReconnect)

                        }

                        socketListeners(_this);
                    }
                }
                useEffect(() => {
                    build();
                    return () => { _this.close() }
                }, [])

                useEffect(() => {
                    if (!ws) {
                        setWss(false);
                        _this.close();

                    }
                }, [ws])
            },
            on(name, method) {
                this.methods[name] = method;
            },

            close() {
                    reconnect = false;
                 if (ws) ws.close();
            },
            getSocket() {
                if (!ws) this.reconnect()
                return ws;
            },
            _registerAuth(receivedAuth) {
                auth = receivedAuth;
            },
            _send(data) {
                if (auth) data.auth = auth;
                console.log('#> Socked data send  ')
               //
                try {
                    ws.send(JSON.stringify(data));
                }
                catch(e) {

                }
            },
            _handleNotifications(data) {
                socketNotificationsHandler.react(data);
            },
            /***************
             * LAYER STRUCTURE
             *****************/

            getAuth(xdevice, xsession) {
                this._send({
                    type: TYPES_SEND.GET_AUTH,
                    data: {
                        xdevice: xdevice,
                        xsession: xsession,
                    }
                })
            },
            pong() {
                this._send({
                    type: TYPES_SEND.PONG
                })
            },
            sendMessage(data) {
                    this._send({
                        type: TYPES_SEND.SEND_MESSAGE,
                        data: data
                    })
            },
            joinFluxRooms() {
                this._send({
                    type: TYPES_SEND.JOIN_FLUXROOMS,
                })
            },

            onViewed(data) {
                this._send({
                    type: TYPES_SEND.ON_VIEWED,
                    data: data,
                })
            }



}
