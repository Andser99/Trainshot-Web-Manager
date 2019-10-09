var database = firebase.database();
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";
    // var user = firebase.auth().currentUser;
    console.log("USER:" + user + "\n");
    if(user != null){

      var email_id = user.email;
      // console.log(user);
      // console.log(user.uid);
      document.getElementById("user_para").innerHTML = "User : " + email_id;

    var  ref = database.ref('/users/' + user.uid).once('value').then(function(snapshot) {
    let userData = snapshot.val();
    // console.log(userData);
    if (userData.canManageCompetition == "TRUE") {
      document.getElementById("navbar").style.display = "block";
      console.log("login successful");
    }
    else firebase.auth().signOut();
    });

    var  ref = database.ref('/competition/' + "1").once('value').then(function(snapshot) {
    let competitionData = snapshot.val();
    console.log(competitionData);
    });
    }

  } else {
    // No user is signed in.

    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";

  }
});
var userId;
function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;
  // console.log(userPass);
  // console.log(userEmail);

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);
    // ...
  });
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}



 // Data pull
var userData;
function getCompetition(){
  var user = firebase.auth().currentUser;
  userId = user.uid;
  firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  userData = snapshot.val()
  parseCompetitionData(userData);
  console.log(userData);
  document.getElementById("user_div").style.display = "none";
  document.getElementById("login_div").style.display = "none";
  document.getElementById("competition_div").style.display = "block";
});
}
  // ...
let rowEnd = "</tr>";
let rowStart = "<tr>";
let columnStart = "<td>";
let columnEnd = "</td>";
let editCompetitionButton = "";
let editShootersButton = "";
function parseCompetitionData(userData){
  var compData = userData.competition.competitions;
  var tableString = rowStart + "<th>" + "ID" + "</th>" + "<th>" + "Name" + "</th> <th>" + "Date" + "</th>" + rowEnd;
  console.log(compData);
  for (key in compData) {
    // console.log(key);
    editCompetitionButton = "<button class=\"edit-button\" id=\"editStagesId" + compData[key].ID + "\"  onclick=\"editCompetition(this.id)\">Competition</button>";
    editShootersButton = "<button class=\"edit-button\" id=\"editUsersId" + compData[key].ID + "\"  onclick=\"editUsers()\">Users</button>";
    // console.log(compData[key].Date + " : " + compData[key].Name + "\n");
    tableString += rowStart + columnStart + compData[key].ID + columnEnd + 
    columnStart + compData[key].Name + columnEnd + 
    columnStart + compData[key].Date + editCompetitionButton + editShootersButton + columnEnd + rowEnd;
  }
document.getElementById("competition_table").innerHTML = tableString;
}

function editCompetition(editId){
  var tableString = rowStart + "<th>" + "ID" + "</th>" + "<th>" + "Drill" + "</th> <th>" + "IsDrill" + "</th> <th>" + "Name" + "</th>" + rowEnd;
  var id = editId.replace( /^\D+/g, '');
  console.log(id);
  var compData = userData.competition.competitions[id].stage;
  console.log(compData);
  for (key in compData) {
    tableString += rowStart + columnStart + compData[key].ID + columnEnd + 
    columnStart + compData[key].Drill + columnEnd + 
    columnStart + compData[key].IsDrill + columnEnd + 
    columnStart + compData[key].Name + columnEnd + rowEnd;
    // console.log(compData[key].Drill + compData[key].ID + compData[key].IsDrill + compData[key].Name);
  }
  
  document.getElementById("competition_table").innerHTML = tableString;
}

function editUsers(){
  firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    userData = snapshot.val();
  });
  var tableString = rowStart + "<th>" + "ID" + "</th>" + "<th>" + "Email" + "</th> <th>" + "First Name" + "</th> <th>" + "Last Name" + "</th><th>" + "Phone" + "</th>" + rowEnd;
  var compData = userData.competition.shooters;
  console.log(compData);
  for (key in compData) {
    tableString += rowStart + columnStart + compData[key].ID + columnEnd + 
    columnStart + compData[key].Email + columnEnd + 
    columnStart + compData[key].FirstName + columnEnd + 
    columnStart + compData[key].LastName + columnEnd + 
    columnStart + compData[key].PhoneNumber + columnEnd + rowEnd;
    // console.log(compData[key].Drill + compData[key].ID + compData[key].IsDrill + compData[key].Name);
  }
  tableString += rowStart + "<button class=\"edit-button\" onclick=\"openForm()\">Add Shooter</button>" + rowEnd;
  document.getElementById("competition_table").innerHTML = tableString;
}

function editThisUser(userRowId){
document.getElementById("");
}

function openForm() {
  document.getElementById("loginPopup").style.display="block";
  }

function closeForm() {
    document.getElementById("loginPopup").style.display= "none";
    document.getElementById("email").value = "";
    document.getElementById("first_name").value = "";
    document.getElementById("last_name").value = "";
    document.getElementById("phone_number").value = "";
  }

function writeUserData() {
  var user = firebase.auth().currentUser;
  userId = user.uid;
  var nextIndex = 0;
  var tempData;
  firebase.database().ref('/users/' + userId + '/competition/shooters').once('value').then(function(snapshot) {
    tempData = snapshot.val();
    let _email = document.getElementById("email").value;
    let _firstName = document.getElementById("first_name").value;
    let _lastName = document.getElementById("last_name").value;
    let _phoneNumber = document.getElementById("phone_number").value;
    nextIndex = Object.keys(tempData).length + 1;
    console.log("Continuing with next index: " + nextIndex);
    var newUser  = firebase.database().ref('users/' + userId + '/competition/shooters/' + nextIndex);
    newUser.set({
      Email: _email,
      FirstName: _firstName,
      ID: nextIndex,
      LastName: _lastName,
      PhoneNumber: _phoneNumber
    }, function(error) {
      if (error) {
      console.log(error);
    } else {
      console.log("SUCCESSFULLY ADDED");
      firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        userData = snapshot.val();
        editUsers();
      });
    }
  });

  }, function(error) {

    if (error){
      console.log(error);
    }
    else{}
  });
console.log(tempData);
  for (value in tempData) {
    nextIndex++;
  }

  
  // firebase.database().ref('users/' + userId + '/competition/shooters/' + nextIndex).set({
  //   Email: _email,
  //   FirstName: _firstName,
  //   ID: nextIndex,
  //   LastName: _lastName,
  //   PhoneNumber: _phoneNumber
  // }, function(error) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("SUCCESS");
  //     firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  //       userData = snapshot.val()
  //     });
  //     editUsers();
  //     // Data saved successfully!
  //   }
  // });

  
}

function homeButton(){
  parseCompetitionData(userData);
}
function logout(){
  document.getElementById("navbar").style.display = "none";
  document.getElementById("competition_table").style.display = "none";
  
  firebase.auth().signOut();
}