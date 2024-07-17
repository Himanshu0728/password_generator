const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");
function handleCheckBoxChange(checkbox){
    checkbox.addEventListener('change', () => {
        checkCount = 0;
        if (uppercaseCheck.checked) checkCount++;
        if (lowercaseCheck.checked) checkCount++;
        if (numbersCheck.checked) checkCount++;
        if (symbolsCheck.checked) checkCount++;
        // special conditions
        if(passwordLength<checkCount ){
            passwordLength = checkCount;
            handleSlider();
        }
    });
}
//set strength circle color to grey
allCheckBox.forEach(checkbox => {
    handleCheckBoxChange(checkbox);
    
});
//set password length funtion
function handleSlider() {
    const passwordLength = inputSlider.value;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + '% 100%';
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow homework
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}



function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
    
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateRandomLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateRandomUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}



async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copy.classList.remove("active");
    },2000);
}



inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    if(checkCount==0) return;
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password ="";
     let funcArr=[];
    
    if(uppercaseCheck.checked){
        funcArr.push(generateRandomUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateRandomLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    //compulsory addition
    for(let i =0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    //ramaining letter
    for(let i =0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }
    //suffle the password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
});



function shufflePassword(array){
    //fisher yates method
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str="";
    array.forEach((el)=> (str+=el));
    return str;
}


