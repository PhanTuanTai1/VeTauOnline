var firebase = require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyAji9PEi6sRHVql6v-SkDDMtx-QJ3_U_6k",
    authDomain: "myauthen-c3e5a.firebaseapp.com",
    databaseURL: "https://myauthen-c3e5a.firebaseio.com",
    projectId: "myauthen-c3e5a",
    storageBucket: "myauthen-c3e5a.appspot.com",
    messagingSenderId: "94604538850",
    appId: "1:94604538850:web:c14218cff021f81b30bfbb"
};

var Role = { 1: "Staff", 2: "Management_Staff", 3: "Admin" }

firebase.initializeApp(firebaseConfig);

module.exports.Login = async function (req, res) {
    var auth = firebase.auth();
    auth.signInWithEmailAndPassword(req.body.email, req.body.pass)
        .then(() => {
            auth.onAuthStateChanged(async firebaseUser => {
                if (firebaseUser) {
                    var data = await GetDataFromCloudDB(firebaseUser.email);
                    console.log("Current User: " + firebaseUser);
                    req.session[firebaseUser.email] = data;
                    var data = req.session[firebaseUser.email]
                    console.log('Login success');
                    console.log("req.session[firebaseUser.email]: " + JSON.stringify(req.session[firebaseUser.email]));
                    console.log("Role: " + Role[data.Role]);
                    res.redirect('/admin/dashboard');
                }
            });
        })
        .catch(error => {
            console.log(JSON.stringify(error));
            res.render('login', { error: JSON.stringify(error) });
        })
}

module.exports.CheckLogin = function () {
    return new Promise(resolve => {
        var currentUser = firebase.auth().currentUser;
        if (currentUser == null) resolve(false);
        else resolve(true);
    })
}
module.exports.GetUserFromSession = () => {
    // Cookies.set('acc', firebaseUser.email);
    return new Promise(resolve => {
        resolve(req.session[firebaseUser.email]);
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