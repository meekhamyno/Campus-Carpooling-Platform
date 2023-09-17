const firebaseConfig = {
  apiKey: "AIzaSyDT6_-I_PiN8rZ2NzRyMKLRYcSSFgsiX1M",
  authDomain: "mini-project-16d95.firebaseapp.com",
  databaseURL: "https://mini-project-16d95-default-rtdb.firebaseio.com",
  projectId: "mini-project-16d95",
  storageBucket: "mini-project-16d95.appspot.com",
  messagingSenderId: "44019272618",
  appId: "1:44019272618:web:211fb6deef85f75a6cb9d3",
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

function handleLogout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Error during logout:", error);
    });
}

const db = firestore.collection("Cardetails");
function showMessageModal(title, message) {
  const modalTitle = document.getElementById("messageModalTitle");
  const modalBody = document.getElementById("messageModalBody");

  modalTitle.textContent = title;
  modalBody.textContent = message;

  $("#messageModal").modal("show");
  setTimeout(() => {
    window.location.href = "driver.html";
  }, 3000);
}
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.getElementById("btn");

closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  menuBtnChange();
});

function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
  }
}

// Function to validate the form
function validateForm(loginUid) {
  // Get form elements
  const name = document.getElementById("name");
  const uid = document.getElementById("uid");
  const sem = document.getElementById("sem");
  const number = document.getElementById("number");
  const car = document.getElementById("car");
  const registrationNumber = document.getElementById("registration_number");
  const upload = document.getElementById("upload");
  const licenseUpload = document.getElementById("licenseUpload");
  const gender = document.querySelector('input[name="gender"]:checked');
  const nameError = document.getElementById("nameError");
  const uidError = document.getElementById("uidError");
  const semError = document.getElementById("semError");
  const numberError = document.getElementById("numberError");
  const genderError = document.getElementById("genderError");
  const carError = document.getElementById("carError");
  const regError = document.getElementById("regError");
  const vehicleError = document.getElementById("vehicleError");
  const licenseError = document.getElementById("licenseError");

  nameError.textContent = "";
  uidError.textContent = "";
  semError.textContent = "";
  numberError.textContent = "";
  genderError.textContent = "";
  carError.textContent = "";
  regError.textContent = "";
  semError.textContent = "";
  vehicleError.textContent = "";
  licenseError.textContent = "";

  // Validate UID
  if (uid.value.trim() === "") {
    uidError.textContent = "UID is required";
    uid.focus();
    return false;
  }
  if (name.value.trim() === "") {
    nameError.textContent = "Name is required";
    name.focus();
    return false;
  }

  // Validate semester
  const semesterRegex = /^S\s?\d+\s?[a-zA-Z]*$/; // Should start with S, followed by an optional space, a number, an optional space, and then any number of alphabets
  if (!semesterRegex.test(sem.value.trim())) {
    semError.textContent = "eg.S6 IT";
    sem.focus();
    return false;
  }

  // Validate phone number
  const phoneNumberRegex = /^\+91\d{10}$/; // Indian phone number format: +91 followed by 10 digits
  if (!phoneNumberRegex.test(number.value.trim())) {
    numberError.textContent = "Should start with +91";
    number.focus();
    return false;
  }

  // Validate car make and model
  if (car.value.trim() === "") {
    carError.textContent = "Make and model is required";
    car.focus();
    return false;
  }

  // Validate registration number
  const registrationNumberRegex = /^KL(?:\s?\d{2}\s?\d{4}|\d{6})$/;
  if (!registrationNumberRegex.test(registrationNumber.value.trim())) {
    regError.textContent = "eg.Start with KL";
    registrationNumber.focus();
    return false;
  }

  // Validate vehicle image upload
  if (!upload.value) {
    vehicleError.textContent = "Upload the vehicle";
    return false;
  }

  // Validate license upload
  if (!licenseUpload.value) {
    licenseError.textContent = "Upload the license";
    return false;
  }

  // Validate gender
  if (!gender) {
    genderError.textContent = "Choose your gender";
    return false;
  }

  // Validate if login UID matches the entered UID
  if (loginUid !== null && uid.value !== loginUid) {
    uidError.textContent = "UID does not match with logged in credentials";
    uid.focus();
    return false;
  }

  // If all fields are valid, proceed with form submission
  return true;
}

function storeLoginUID(uid) {
  localStorage.setItem("userUID", JSON.stringify({ uid: uid }));
  sessionStorage.setItem("userUID", JSON.stringify({ uid: uid }));
}

// Function to get the login UID from both localStorage and sessionStorage
function getLoginUID() {
  const userUIDLocalStorage = JSON.parse(localStorage.getItem("userUID"));
  const userUIDSessionStorage = JSON.parse(sessionStorage.getItem("userUID"));

  // First, check if the login UID is available in localStorage
  if (userUIDLocalStorage && userUIDLocalStorage.uid) {
    return userUIDLocalStorage.uid;
  }

  // If not available in localStorage, check if it's available in sessionStorage
  if (userUIDSessionStorage && userUIDSessionStorage.uid) {
    return userUIDSessionStorage.uid;
  }

  // If not found in both, return null
  return null;
}
let submitButton = document.getElementById("submit");
submitButton.addEventListener("click", async (e) => {
  // Prevent default form submission behavior
  e.preventDefault();
  const loginUid = getLoginUID();

  if (validateForm(loginUid)) {
    console.log("Validation");
    const form = document.getElementById("carOwnerForm");
    let name = document.getElementById("name").value;
    let uid = document.getElementById("uid").value;
    let photoFile = document.getElementById("upload").files[0];
    let licenseFile = document.getElementById("licenseUpload").files[0];
    let gender = document.querySelector('input[name="gender"]:checked').value;
    let semester = document.getElementById("sem").value;
    let phoneNumber = document.getElementById("number").value;
    let carMakeModel = document.getElementById("car").value;
    let registrationNumber = document.getElementById(
      "registration_number"
    ).value;

    let photoURL = "";
    let licenseURL = "";

    try {
      // Upload photo file to Firebase Storage
      if (photoFile) {
        const photoRef = firebase
          .storage()
          .ref()
          .child("photos/" + photoFile.name);
        await photoRef.put(photoFile);

        photoURL = await photoRef.getDownloadURL();
      }

      // Upload license file to Firebase Storage
      if (licenseFile) {
        const licenseRef = firebase
          .storage()
          .ref()
          .child("licenses/" + licenseFile.name);
        await licenseRef.put(licenseFile);
        licenseURL = await licenseRef.getDownloadURL();
      }

      // Save form data to Firestore
      await db.add({
        name: name,
        uid: uid,
        photoURL: photoURL,
        licenseURL: licenseURL,
        gender: gender,
        sem: semester,
        number: phoneNumber,
        car: carMakeModel,
        registration_number: registrationNumber,
        status: "Pending", // Set initial status as "Pending"
      });

      console.log("Data saved");
      showMessageModal("Form submitted, please wait for approval.");
    } catch (error) {
      console.log("Error:", error);
      showMessageModal("Error", "An error occurred. Please try again.");
    }
  }
});
