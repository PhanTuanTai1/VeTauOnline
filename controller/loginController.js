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
firebase.initializeApp(firebaseConfig);

module.exports.Login = async function(req,res){
    var auth = firebase.auth();   
    auth.signInWithEmailAndPassword(req.query.email,req.query.password)
    .then(() => {
        auth.onAuthStateChanged(firebaseUser => {
            if(firebaseUser){
                console.log('Login success')
                res.redirect('/');
            }
        });
    })
    .catch(error => {
        console.log('Login fail')
        res.render('login');
    })
    // res.render('login', {data : auth.onAuthStateChanged()});
}

module.exports.CheckLogin = function(req,res){
    var currentUser = firebase.auth().currentUser;   
    if(currentUser == null) res.render('login')
}