"use strict";

//GLOBAL VARIABLES

let COLORS = [];
let numColors;
let timeout1;
let counter = 0;
let bestCount = 0;

let cardObject = {
  firstCard: true,
  card1: undefined,
  card2: undefined,
  firstColor: undefined,
  secondColor: undefined,
  firstEnd: false,
  listenerFlag: false,
  timeout1: undefined
};


//--------------
//BUTTON FUNCTIONS

function restartFunc(){

  const numsDiv = document.getElementById("numsDiv");
  removeTextEntries();

  //logic for counters on scoreboard
  if (counter < bestCount || !bestCount){
    bestCount = counter;
    const bestScore = document.getElementById("bestScore");
    bestScore.innerText = bestCount;
  }
  counter = 0;
  const currentScore = document.getElementById("currentScore");
  currentScore.innerText = counter;
  deleteBoard();
  reset();

  //add text entry elements for choosing number of colors to match
  const squaresNumLabel = document.createElement("label")
  squaresNumLabel.innerHTML =
    "<br><br>Enter the number of colors you would like to match. <br><br>"
  const squaresNumTextEntry = document.createElement("input")
  squaresNumTextEntry.type = "text";
  squaresNumTextEntry.name = "squaresNumTextEntry"
  const squaresNumSubmit = document.createElement("input")
  squaresNumSubmit.type = "submit";
  squaresNumSubmit.name = " squaresNumSubmit";
  numsDiv.appendChild(squaresNumLabel);
  numsDiv.appendChild(squaresNumTextEntry);
  numsDiv.appendChild(squaresNumSubmit);

  //entering number of colors calls functions to build board
  squaresNumTextEntry.addEventListener("change", function(evt){
    evt.preventDefault;
    createColors(evt);
  })
}

//same as restart function
function startFunc(){
  restartFunc()
}


//--------------
//BOARD CREATION FUNCTIONS

function createColors(evt){
  numColors = evt.target.value;
  makeColors(numColors);
  const colors = shuffle(COLORS);
  createCards(colors);
  //hide text entry for number of colors
  removeTextEntries();

}

//creates each color item and calls randfom color generator to get actual colors
//for them. Then pushes all colors to COLORS twice, so there are two to match,
function makeColors(numColors){
  for (let i=0; i<numColors; i++){
    const colorString = getRandomColor();
    COLORS.push(colorString);
    COLORS.push(colorString);
  }
}

//gives a random color to each color item
function getRandomColor(){
  const colorR = Math.floor(Math.random()*255);
  const colorG = Math.floor(Math.random()*255);
  const colorB = Math.floor(Math.random()*255);

  //random nubers are arranged into a sequence that will be readable if we add
  //it to the card's .style.backgroundColor attribute.
  let colorString = `rgb(${colorR},${colorG},${colorB})`;
  return colorString;
}

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

// make dom elements
function createCards(colors) {
  for (let i=0; i<colors.length; i++) {
    const newCard = document.createElement("div");
    newCard.classList.add(colors[i]);
    newCard.classList.add("cardSquare")
    newCard.value = `num${i}`;
    gameBoard.appendChild(newCard);
    gameBoard.height = "90vh";
    gameBoard.height = "80vw"

  }
  //add event listener for cards now that there are cards to listen for
  const cardClicked = gameBoard.addEventListener("click", handleCardClick);
}

//this function flips the color so that you can see it, but it has a lot of logic
//because it has to distinguish which click we are on, and then use that
//information, plus saved values, to determine how long/whether to keep colors
//showing
function flipCard(card, cardObject) {

  const presentColor = card.classList[0];
  card.style.backgroundColor = presentColor;

  //first color becomes undefined before first card and
  //the present color before 2nd then set time for amount
  //of time player has to find other card, unflips if no action

  if(cardObject.firstCard === true){
    cardObject.firstColor = presentColor;
    cardObject.card1 = card;
    cardObject.value = card.value;

    //this variable tells event listener function it should switch to 2nd click
    //without actually changing it yet
    cardObject.firstEnd = true;

    //timeout path for when no 2nd click takes place
    setTimeout(function(){
      card.style.backgroundColor = "white";
      reset();
    }, 2000);
  }

  //for 2nd card, if new color is same as 1st color, don't unflip
  //but if isn't the same then set 2 sec wait.
  else{
    removeTimeouts();
    cardObject.secondColor = presentColor;
    cardObject.card2 = card;

    //check to see if same card was clicked
    if(cardObject.value !== card.value){
      //if no, then check to see if cards were same color
      if(cardObject.firstColor === cardObject.secondColor){
        console.log("match path");
        reset();
      }
      //if cards are different colors we are on no match path timeout
      //two cards to unflip
      else{
        //set listener flag to prevent click on a third card
        cardObject.listenerFlag = true;
        setTimeout(function(){
          cardObject.card1.style.backgroundColor = "white";
          cardObject.card2.style.backgroundColor = "white";
          // unFlipCard2(cardObject);
          reset();
        }, 2000);
      }
    }

    //if values of card are the same, it doesn't count as match because
    //the same card has been clicked twice
    //only 1 card to unflip because no second card was clicked
    else{
       //set listener flag so can't click on a third card
      cardObject.listenerFlag = true;
        setTimeout(function(){
          // unFlipCard1(cardObject);
          card.style.backgroundColor = "white";
          reset();
        }, 2000);
    }
  }
}

//-------------------
//SUB/HELPER FUNCTIONS

//resets cardObject
function reset(){
  console.log("reset");
  cardObject.firstCard = true;
  cardObject.card1 = undefined;
  cardObject.card2 = undefined;
  cardObject.firstColor = undefined;
  cardObject.secondColor = undefined;
  cardObject.firstEnd = false;
  cardObject.listenerFlag = false;
  COLORS = [];
}

//removes all cards so board can be created in different size
function deleteBoard(){
  while (gameBoard.firstChild){
      gameBoard.removeChild(gameBoard.firstChild);
  }
}

//hides entry for number of colors
function removeTextEntries(){
  while (numsDiv.firstChild){
    numsDiv.removeChild(numsDiv.firstChild);
  }

}

//remove all timeouts (b/c couldn't get it to remove one on first card). I just
//re-add it later. Not sure why it wouldn't accept id
function removeTimeouts(){
  const highestId = window.setTimeout(() => {
    for (let i = highestId; i >= 0; i--) {
      window.clearInterval(i);
    }
  });
}

function changeScores(counter){
  const currentScore = document.getElementById("currentScore");
  currentScore.innerText = counter;
  const bestScore = document.getElementById("bestScore");
  bestScore.innerText = bestCount;


}

//----------------------
//EVENT LISTENERS

/** Handle clicking on a card: this could be first-card or second-card. */
function handleCardClick(evt) {
  evt.preventDefault();
  const whichCard = evt.target;
  console.log(whichCard.id);
  console.log("cardObject", cardObject);
  console.log("firstEnd", cardObject.firstEnd);


  if (cardObject.listenerFlag === false){
    // cardOne = cardObject.card1.id;
    // if (cardOne !== whichCard.id)
    console.log("flag", cardObject.listenerFlag);
      if (cardObject.firstEnd === true){
        console.log(cardObject);
        cardObject.firstCard = false;

      }
    flipCard(whichCard, cardObject);

    counter += 1;
    console.log(counter)
    changeScores(counter);
  }
}

function addButtonListeners(){
  console.log("addButtonListeners")
  const restartButton = document.getElementById("restart");
  const restartClicked = restartButton.addEventListener("click", restartFunc);

  const startButton = document.getElementById("start");
  const startClicked = startButton.addEventListener("click", startFunc);
}

addButtonListeners();
const gameBoard = document.getElementById("game");
