
var admin = require("firebase-admin");
var serviceAccount = require('./firebase.secrate.json');

export default function init() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://auth-system-8d90f-default-rtdb.asia-southeast1.firebasedatabase.app",
    })
    console.log("firebase initialized");
}


