import {RSA} from 'react-native-rsa-native';
import sha1 from 'sha1';
// import CryptoES from 'crypto-es';
// import AesGcmCrypto from 'react-native-aes-gcm-crypto';
import CryptoJS from "react-native-crypto-js";
var AES = require("react-native-crypto-js").AES;


export default {
    randomToken(length) {
        length=length||6;
        var char = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var charL = char.length, result='';
        for ( var i = 0; i < length; i++ ) {
            result += char.charAt(Math.floor(Math.random() * charL));
        }
        return result
    },
    RSA: {
        async GENERATE() {
            return await RSA.generateKeys(4096);
        },
        async ENCODE(message, publicKey) {
            return await RSA.encrypt(message, publicKey);
        },
        async DECODE(message, privateKey) {
            return await RSA.decrypt(message, privateKey);
        }
    },
    AES: {
        GCM: {
            // async ENCRYPT(key, data, inBinary = false) {
            //        
            //     return await AesGcmCrypto.encrypt(data, inBinary, key)
            // },
            // async DECRYPT(key, data, iv, tag, isBinary = false) {
            //     return await AesGcmCrypto.decrypt(data, key, iv, tag, isBinary)
            // },
            // async GENERATE() {
            // var t = Date.now();
            //    
            // let keys = await crypto.subtle.generateKey(
            //     {
            //         name: "AES-GCM",
            //         length: 256, //can be  128, 192, or 256
            //     },
            //     false, //whether the key is extractable (i.e. can be used in exportKey)
            //     ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
            // )
            //
            // console.log('Certificate AES-GCM-256 generated in [' + ((Date.now() - t) / 1000) + 's] in worker threads')
            // return keys;
        },
        CBC: {
            ENCODE(key, data) {
                //return CryptoES.AES.encrypt(key, data, { format: CryptoESJsonFormatter });
                return AES.encrypt(JSON.stringify(data), key).toString();
            },
            DECODE(key, data) {
                //return CryptoES.AES.decrypt(key, data).toString(CryptoES.enc.Utf8);
                let bytes = AES.decrypt(data, key);
                bytes = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                return bytes;
            }
        }
    },
    // PBKDF2: {
    //     GENERATE(passphrase) {
    //         const salt = CryptoES.lib.WordArray.random(128 / 8);
    //         // const key128Bits = CryptoES.PBKDF2("Secret Passphrase", salt, { keySize: 128/32 });
    //         // const key256Bits = CryptoES.PBKDF2("Secret Passphrase", salt, { keySize: 256/32 });
    //         // const key512Bits = CryptoES.PBKDF2("Secret Passphrase", salt, { keySize: 512/32 });
    //         const key512Bits1000Iterations = CryptoES.PBKDF2(passphrase, salt, {keySize: 512 / 32, iterations: 1000});
    //         return key512Bits1000Iterations;
    //     }
    // },
    SALT: {
        PASSWORD(string) {
            string = sha1(sha1(sha1(string)))
            return string;
        },
        PIN(string) {
            string = sha1(sha1(sha1(sha1(string))));
            return string;
        }
    },
    // RESALT: {
    //     PIN(string) {
    //         string = sha1(string);
    //         return string;
    //     }
    // }
}
// const CryptoESJsonFormatter = {
//     stringify: function (cipherParams) { // create json object with ciphertext
//         const jsonObj = { ct: cipherParams.ciphertext.toString(CryptoES.enc.Base64) }; // optionally add iv and salt
//         if (cipherParams.iv) {
//             jsonObj.iv = cipherParams.iv.toString();
//         }
//         if (cipherParams.salt) {
//             jsonObj.s = cipherParams.salt.toString();
//         }
//         // stringify json object
//         return JSON.stringify(jsonObj);
//     },
//     parse: function (jsonStr) { // parse json string
//         const jsonObj = JSON.parse(jsonStr); // extract ciphertext from json object, and create cipher params object
//         const cipherParams = CryptoES.lib.CipherParams.create(
//             { ciphertext: CryptoES.enc.Base64.parse(jsonObj.ct) },
//         ); // optionally extract iv and salt
//         if (jsonObj.iv) {
//             cipherParams.iv = CryptoES.enc.Hex.parse(jsonObj.iv)
//         }
//         if (jsonObj.s) {
//             cipherParams.salt = CryptoES.enc.Hex.parse(jsonObj.s)
//         }
//         return cipherParams;
//     },
// };

function convertPemToBinary(pem) {
    var lines = pem.split('\n');
    var encoded = '';
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].trim().length > 0 &&
            lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 &&
            lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
            lines[i].indexOf('-BEGIN PUBLIC KEY-') < 0 &&
            lines[i].indexOf('-END PUBLIC KEY-') < 0 &&
            lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
            lines[i].indexOf('-END RSA PUBLIC KEY-') < 0) {
            encoded += lines[i].trim();
        }
    }
    return base64StringToArrayBuffer(encoded);
}

// function arrayBufferToBase64String(arrayBuffer) {
//     var byteArray = new Uint8Array(arrayBuffer)
//     var byteString = '';
//     for (var i = 0; i < byteArray.byteLength; i++) {
//         byteString += String.fromCharCode(byteArray[i]);
//     }
//     return btoa(byteString);
// }

// function base64StringToArrayBuffer(b64str) {
//     var byteStr = self.atob(b64str);
//     var bytes = new Uint8Array(byteStr.length);
//     for (var i = 0; i < byteStr.length; i++) {
//         bytes[i] = byteStr.charCodeAt(i);
//     }
//     return bytes.buffer;
// }

// function textToArrayBuffer(str) {
//     var buf = self.unescape(encodeURIComponent(str)); // 2 bytes for each char
//     var bufView = new Uint8Array(buf.length);
//     for (var i = 0; i < buf.length; i++) {
//         bufView[i] = buf.charCodeAt(i);
//     }
//     return bufView;
// }

// function Uint8ArrayToBuffer(array) {
//     return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
// }

// function convertBufferToHex(arr) {
//     let i,
//         len,
//         hex = '',
//         c
//     for (i = 0, len = arr.length; i < len; i += 1) {
//         c = arr[i].toString(16)
//         if (c.length < 2) {
//             c = '0' + c
//         }
//         hex += c
//     }
//     return hex
// }

// function convertHexToBuffer(hex) {
//     let i,
//         byteLen = hex.length / 2,
//         arr,
//         j = 0
//     if (byteLen !== parseInt(byteLen, 10)) {
//         throw new Error("Invalid hex length '" + hex.length + "'")
//     }
//     arr = new Uint8Array(byteLen)
//     for (i = 0; i < byteLen; i += 1) {
//         arr[i] = parseInt(hex[j] + hex[j + 1], 16)
//         j += 2
//     }
//     return arr
// }

// // compare ArrayBuffers
// function arrayBuffersAreEqual(a, b) {
//     return dataViewsAreEqual(new DataView(a), new DataView(b));
// }

// // compare DataViews
// function dataViewsAreEqual(a, b) {
//     if (a.byteLength !== b.byteLength) return false;
//     for (let i = 0; i < a.byteLength; i++) {
//         if (a.getUint8(i) !== b.getUint8(i)) return false;
//     }
//     return true;
// }

// // compare TypedArrays
// function typedArraysAreEqual(a, b) {
//     if (a.byteLength !== b.byteLength) return false;
//     return a.every((val, i) => val === b[i]);
// }

// function stringToBuffer(str) {
//     return new TextEncoder().encode(str)
// }

// function bufferToString(buf) {
//     return new TextDecoder().decode(buf)
// }
