// Assignment Code
var showCriteriaBtn = document.querySelector("#showCriteria");
var form = document.querySelector("#form")

//generate number between min and max inclusive.
function randomNum(min, max) {
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.floor(Math.random()*(max-min+1)) + min;
}

/* Return a random lowercase character */
function lowerCase() {
    /* generate a random number from 97-122 ASCII(a-z) and convert that number to character.*/
    return String.fromCharCode(randomNum(97,122));
}

function specialChars() {
    var specialChars = ["!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "\/"];
    return specialChars[randomNum(0,specialChars.length-1)];
}

//Return a character based on string parameter passed in.
function getChar(checked) {
    var char= "";
    switch(checked) {
        case "lowercase": 
           char = lowerCase();
           break;
        case "uppercase":
            char = lowerCase().toUpperCase();
            break;
        case "number":
            char = randomNum(0,9);
            break;
        case "specialChar":
            char = specialChars();
            break;
        default:
            char = lowerCase();
    }
    return char;
}

function generatePassword(selected, pwSize) {

    var password = "";
    /*
        splice() split the array selected and return a new array 
        with different memory. shallow copy. 
    */
    let list = selected.splice();
    
    for(var i = 0; i < pwSize; i++ ) {
        let idx;
        /* 
            Check when there is still item/s in list
            and there is only enough slot/s in password for for those item/s.
            Forces the remaining slot/s in password meet the left over criteria.
        */
        if(list.length > 0 && i + list.length === (pwSize-1)) {
            let listIdx = randomNum(0, list.length-1);
            idx = selected.indexOf(list[listIdx]);    
        } else {
            idx = randomNum(0, selected.length-1);
        }

        password = password.concat(getChar(selected[idx]));
        
        /* 
            Remove criteria from list when criteria is met.
        */
        if (list.length > 0) {
            let listIdx = list.indexOf(selected[idx]);
            if(listIdx >= 0) {
                 list.splice(listIdx, 1);
            }
        }
    }
    return password;
}

function toggleCriteriaList(event) {
    let modal = document.querySelector("#modal");
    // Get the display type from external CSS.  .style.display would not work.
    let displayStyle = getComputedStyle(modal)["display"];

    if(displayStyle === "none") {
        modal.style.display = "block";
    } else {
        modal.style.display = "none";
    }
}
//Return user input for size and return -1 if it is not a number.
function validatePWSize() {
    var size = parseInt(form.pwSize.value);
    if( isNaN(size) || (size < 8 && size >128)) {
        size = -1;
    }
    return size;
}
/*
    Return an array of string with the selection that was 
    chosen by user.
*/
function typesSelected(){
  /* from document retrieve all element with class .checked-box */
    var characterTypes = document.querySelectorAll(".checked-box");
    var selected = [];

    for(var i = 0; i < characterTypes.length; i++) {
        if(characterTypes[i].children[0].checked) {
            selected.push(characterTypes[i].children[0].name);
        }
    }
  
  return selected;
}
/* 
    Write password to the #password input and clear the modal once 
    password is generated.
*/
function writePassword(event) {
    event.preventDefault();

    var pwSize = validatePWSize();
    var selected = typesSelected();
    var sizeErr = document.querySelector("#sizeErr");
    var selectionErr = document.querySelector("#selectionErr");
    
    //hide error display when function is pushed.
    sizeErr.style.display = "none";
    selectionErr.style.display ="none";

    if( pwSize > 0 && selected.length > 0) {

        var password = generatePassword(selected, pwSize);
        var passwordText = document.querySelector("#password");

        passwordText.value = password;
        
        toggleCriteriaList();
    } else {
        //If error display the error.
        if( pwSize < 0 ) {
            sizeErr.style.display = "block"; 
        }
        if(selected.length === 0) {
            selectionErr.style.display = "block"; 
        } 
    }
}

// Add event listener to generate button
showCriteriaBtn.addEventListener("click", toggleCriteriaList );

document.getElementById("closeModal").addEventListener("submit", toggleCriteriaList );

document.getElementById("generate").addEventListener("click", writePassword);

