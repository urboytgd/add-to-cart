import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-21606-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// CLICK AND ENTER EVENT LISTENERS ------------------------------------
inputFieldEl.addEventListener("keydown", function (event) {
    let inputValue = inputFieldEl.value
    if (event.key === "Enter") {
    push(shoppingListInDB, inputValue)
    clearInputFieldEl()
    }
})

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    push(shoppingListInDB, inputValue)
    clearInputFieldEl()
})

// DATABASE CROSSCHECKING FUNCTIONALITY--------------------------------

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = `No items here... yet. <br><br> Type in the box and press "Add to cart" to add items. Tap added items to delete.`
    }
})

// CLEAR FIELDS FUNCTIONALITY------------------------------------------

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// ADD ITEM TO LIST FUNCTIONALITY--------------------------------------

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}