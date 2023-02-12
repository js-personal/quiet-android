// import CONFIG from '../config'
// import axios from 'axios';

// import Store from '../stores/configureStore';

// // import { updateXDEVICE, updateXSESSION } from '../stores/modules/client/clientSlice';

// const API_URL = CONFIG.API_URL;
// const HEADER = {
//     X_DEVICE: 'x-device',
//     X_SESSION: 'x-session',
// }

// export default function (method, url, data=null, onProgress=null) {
//                 if (!method || !url) { console.warn('Fetcher.js: Invalid METHOD or URL options')};
//                 return new Promise((resolve,reject) => {
//                     if (typeof(url) ==="object") { url = url.url }
//                     else { url = API_URL + url}
//                     console.log('trying fetch : '+url);
//                     let responseReturn = {};
//                     let headers = axios.defaults.headers;
//                     headers['X-Requested-With'] = 'XMLHttpRequest'

//                     // ##### Mettre la lang de i18n ici
//                     // headers["accept-language"] = store.state.application.lang;

//                     // Update du header avec infos du store client (x-machine et x-sesion)
//                     if (Store.getState().client.xdevice && [null,'null','undefined'].indexOf(Store.getState().client.xdevice) === -1) {

//                      //   console.log(Store.getState().xdevice);
//                         headers[HEADER.X_DEVICE] = Store.getState().client.xdevice;
//                     }
//                     else { delete headers[HEADER.X_DEVICE]; }

//                     if (Store.getState().client.xsession && [null,'null','undefined'].indexOf(Store.getState().client.xsession) === -1) {

//                        // console.log(Store.getState().xsession);
//                         headers[HEADER.X_SESSION] = Store.getState().client.xsession;
//                     }
//                     else { delete headers[HEADER.X_SESSION]; }

//                     let request = {
//                         headers:headers,
//                         method: method,
//                         url: url,
//                         validateStatus: (s) => {
//                             responseReturn.status = s
//                             return true // I'm always returning true, you may want to do it depending on the status received
//                         }
//                     };

//                     if (typeof(onProgress) === "function") {
//                         request.onUploadProgress = onProgress;
//                         headers['Content-Type'] = 'multipart/form-data';
//                     }else delete headers['Content-Type'];

//                     if (method === "POST")  request.data = data;

//                     axios(request).then((response) => {
//                        // console.log(response.headers);
//                         /* Si le status est différent de 404, 403, */
//                         if ([404].indexOf(response.status) === -1) {
//                             /* Récupération et update de l'id DEVICE */
//                             if (response.headers[HEADER.X_DEVICE] && Store.getState().client.xdevice !== response.headers[HEADER.X_DEVICE]) {
//                                 if ([null, 'null', 'undefined'].indexOf(response.headers[HEADER.X_DEVICE]) > -1) {
//                                     Store.dispatch(updateXDEVICE(false))
//                                 } else {
//                                     // Store.dispatch(updateXDEVICE(response.headers[HEADER.X_DEVICE]))
//                                 }
//                             }

//                             /* Récupération et update du token SESSION  */
//                             if (response.headers[HEADER.X_SESSION]) {

//                                 if (Store.getState().client.xsession !== response.headers[HEADER.X_SESSION]) {

//                                     if ([null, 'null', 'undefined'].indexOf(response.headers[HEADER.X_SESSION]) > -1) {
//                                         // Store.dispatch(updateXSESSION(null));
//                                     } else {

//                                         Store.dispatch(updateXSESSION(response.headers[HEADER.X_SESSION]));
//                                     }
//                                 }
//                             } else if (Store.getState().client.xsession !== null) {
//                                 // Store.dispatch(updateXSESSION(false));
//                             }
//                         }

//                         /* Preparation des données de réponse */
//                         responseReturn.data = response.data.data!=='undefined' ? response.data.data : response.data;
//                         responseReturn.error = response.data.error || null;
//                         resolve(responseReturn)

//                     })
//                     //     .catch(error => {
//                     //     if (!error.status) {
//                     //         // network error
//                     //         responseReturn.status = 503
//                     //     }
//                     //     responseReturn.error = error;
//                     //     responseReturn.status = 500;
//                     //     responseReturn.data = false;
//                     //     resolve(responseReturn)
//                     // })
//                 })

// }
