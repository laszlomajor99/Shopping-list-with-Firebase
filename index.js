import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js'

import { getDatabase, ref, push, onValue, remove, update, get} from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://shopping-list-app-6f377-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

const shoppingListInDB = ref(database, "shoppingList");


const inputField = document.getElementById("input");
const addButton = document.getElementById("button")
const shoppingList = document.getElementById("shopping-list");



//print list on screen from DB when app is loaded 
window.onload = function() {
    
    pullAndPrintDBData()
    console.log("The application has fully loaded.");
  };



function clearInput() {
    inputField.value = ""
}

function clearShoppingList () {
    shoppingList.innerHTML = "";
}
/*
function addListItem () {
    let inputValue = inputField.value;

    push(shoppingListInDB, inputValue)

    console.log(inputValue)


    shoppingList.innerHTML += `<li>${inputValue}</li>`
}*/

function pullAndPrintDBData() {
    onValue(shoppingListInDB, function(snapshot) {
        //let fireBaseDBObjectArray = Object.values(snapshot.val())
        let fireBaseDBObject = snapshot.val(); // This gets the entire object from Firebase

        clearShoppingList()

        // Loop through DB objects and print the items on screen
        for (let key in fireBaseDBObject) {
            if (fireBaseDBObject.hasOwnProperty(key)) {
              const itemValue = fireBaseDBObject[key]; // Access the value using the key
              console.log(itemValue);
          
              // Create a new list item element
              let newListElement = document.createElement("li");
              newListElement.textContent = itemValue.name;

                // Add an event listener to the specific list item to remove it when clicked
                newListElement.addEventListener("dblclick", function() {
                    removeItemFromDB(key); // Correctly pass the unique key of the item to be removed
                });
                
                newListElement.addEventListener("touchend", handleDoubleTapOrClick(() => {
                    removeItemFromDB(key);
                }));

                newListElement.addEventListener("click", function() {
                    crossOutItem(key)
                });

                // Append the new list item to the shopping list
                shoppingList.append(newListElement);



                if (itemValue.hasOwnProperty('isCrossed') && itemValue.isCrossed) {
                    newListElement.classList.add('crossed-out'); // Add class if "isCrossed" is true
                  }
            }
        }
    });
};

function handleDoubleTapOrClick(callback) {
    let lastTap = 0;
    return function (event) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            callback(event);
        }
        lastTap = currentTime;
    };
}
  

function addListItem () {
    let inputValue = inputField.value;

    if (!inputValue == "") {

        let newItem = {
            name: inputValue, 
            isCrossed: false,
        }


        push(shoppingListInDB, newItem)

        console.log("Added Item: ", newItem)

        pullAndPrintDBData()
    } else {
        return
    }

}

addButton.addEventListener('click', function(){
    
    addListItem()

    clearInput()

});


function removeItemFromDB(key) {
    // Reference the specific item in the database using its key
    const itemRef = ref(database, `shoppingList/${key}`);
    
    // Remove the item from the database
    remove(itemRef)
    
}

function crossOutItem(key) {
    const itemRef = ref(database, `shoppingList/${key}`);
  
    // Get the current value of isCrossed
    get(itemRef).then((snapshot) => {
      if (snapshot.exists()) {
        const currentValue = snapshot.val().isCrossed;
        // Toggle the isCrossed value
        update(itemRef, {
          isCrossed: !currentValue
        });
      } else {
        console.log('No data available');
      }
    }).catch((error) => {
      console.error(error);
    });

}

const infoIcon = document.getElementById("info");
const infoPopup = document.getElementById("info-popup");

// Add a click event listener to the info icon
infoIcon.addEventListener("click", function () {
  // Toggle the display of the popup
  if (infoPopup.style.display === "none" || infoPopup.style.display === "") {
    infoPopup.style.display = "block";
  } else {
    infoPopup.style.display = "none";
  }
});
