var firebase = require('firebase');
var config = require('../config/common');
var firebaseConfig = config.firebaseConfig;
var Role = { 1: "Staff", 2: "Management_Staff", 3: "Admin" }
var admin = require("firebase-admin");
var serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://myauthen-c3e5a.firebaseio.com"
});

firebase.initializeApp(firebaseConfig);

module.exports.Login = async function (req, res) {
    var auth = firebase.auth();
    auth.signInWithEmailAndPassword(req.body.email, req.body.pass)
        .then(() => {
            auth.onAuthStateChanged(async firebaseUser => {
                if (firebaseUser) {
                    var data = await GetDataFromCloudDB(firebaseUser.email);
                    res.cookie('uid', firebaseUser.uid);
                    
                    if(data.Role == 2 || data.Role == 3)
                    {
                        res.redirect('/admin/dashboard');
                    }
                    else {
                        res.redirect('/admin/ticket');
                    }
                }
            });
        })
        .catch(error => {
            console.log(JSON.stringify(error));
            res.render('login', { error: JSON.stringify(error) });
        })
}

module.exports.CheckLogin = function (req) {
    return new Promise(async resolve => {
        try {
            var currentUser = await admin.auth().getUser(req.cookies.uid);
            resolve(true);
        }
        catch{
            resolve(false);
        }
    })
}

module.exports.GetUser = async (req) => {
    // Cookies.set('acc', firebaseUser.email);
    var currentUser = await admin.auth().getUser(req.cookies.uid);
    return new Promise(async resolve => {
        var data = await GetDataFromCloudDB(currentUser.email);
        resolve(data);
    })
}

function GetDataFromCloudDB(Account) {
    return new Promise(resolve => {
        var database = firebase.firestore();
        database.collection('Employee').doc(Account).get().then(data => {
            resolve(data.data());
        })
    })
}