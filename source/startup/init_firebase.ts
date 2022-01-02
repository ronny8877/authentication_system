
var admin = require("firebase-admin");
var serviceAccount = require('./firebase.secrate.json');

export default function init() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
    console.log("firebase initialized");
}
