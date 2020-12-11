//get data from the game list
db.collection('game').onSnapshot(snapshot =>{
    setupGame(snapshot.docs);
});

//track for auth status changes .onSnapshot real time update
auth.onAuthStateChanged(user => {
    if (user){
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            setupUI(user);
        })
        //get data
        db.collection('guides').onSnapshot(snapshot =>{
        setupGuides(snapshot.docs);
        
});
    } else{
        setupUI();
        setupGuides([]);
    }
});

//create new guide
const createForm = document.querySelector('#create-form');

createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    db.collection('guides').add({
        title: createForm['title'].value,
        content: createForm['content'].value,
        date: createForm['date'].value,
        time: createForm['time'].value,
        dateend: createForm['dateend'].value,
        timeend: createForm['time1'].value,
        game: createForm['gamename'].value,
        location: createForm['autocomplete'].value
    }).then(() => {
        //close the modal and reset form
        // const modal = document.querySelector('#modal-create');
        modal.style.display = "none";
        createForm.reset();
    }).catch(err => {
       // console.log(err.message)
    })
})



//signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    //signup the user
    auth.createUserWithEmailAndPassword(email, password).then( cred =>{
        return db.collection('users').doc(cred.user.uid).set({
            bio: signupForm['signup-bio'].value
        });
    }).then(() =>{
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        signupForm.querySelector('.error').innerHTML = '';

    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message;
    })
});

//logout 
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
})

//login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get user info 
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    //log user in
    auth.signInWithEmailAndPassword(email, password).then(cred =>{
        //close the login modal and reset the form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
        loginForm.querySelector('.error').innerHTML = '';

    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message;

    })
})