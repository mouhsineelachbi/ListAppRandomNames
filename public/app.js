const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if(user) {
        //user signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3> Hello ${user.displayName}!</h3> <p></p>`;
    }
    else {
        // user signed out
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }

})

// FireStore

const db = firebase.firestore();

const createThing = document.getElementById('createThing');
const thigsList = document.getElementById('thigsList');

let thingsRef;
let unsubscribe;

// Change data only for Loged in users
auth.onAuthStateChanged(user => {
    if(user){
        const { serverTimestamp } = firebase.firestore.FieldValue;
        thingsRef = db.collection('things');
        createThing.onclick = () => {
            thingsRef.add({
                uid: user.uid,
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                age: faker.random.number({
                    'min': 20,
                    'max': 70
                    }),
                createdAt: serverTimestamp()
            })
        }

        unsubscribe = thingsRef
            .where('uid', '==', user.uid)
            .orderBy('createdAt')
            .onSnapshot(querySnapshot => {
                const items = querySnapshot.docs.map(doc => {
                    return `<li>${doc.data().firstname} ${doc.data().lastname}</li>`
                 });
            thigsList.innerHTML = items.join('');
            })
            console.log("unsubscribe : ", unsubscribe);
    }
    else {
        unsubscribe && unsubscribe();
        console.log("unsubscribe : ", unsubscribe);
    }
})