"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
// const COLORS = [
//   "red", "blue", "green", "orange", "purple",
//   "red", "blue", "green", "orange", "purple",
// ];



let timeout1;


const cardObject = {
  firstCard: true,
  card1: undefined,
  card2: undefined,
  firstColor: undefined,
  secondColor: undefined,
  firstEnd: false,
  listenerFlag: false
}

// let firstCard = true;
// let card1 = null;
// let card2 = null;
// let firstColor = undefined;
// let secondColor = undefined;
// let firstEnd = false;

/** Shuffle array items in-place and return shuffled array. */

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

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let i=0; i<colors.length; i++) {
    // missing code here ...
    // make dom elements
    const newCard = document.createElement("div");
    newCard.classList.add(colors[i]);
    newCard.value = `num${i}`;
    gameBoard.appendChild(newCard);
    const cardClicked = document.addEventListener("click", handleCardClick);
  }
}



/** Flip a card face-up. */

function flipCard(card, cardObject) {
  // ... you need to write this ...

  // if(card.id !== cardObject.card1.id){
  //   console.log("test");
  // }

  const presentColor = card.classList[0];
  card.classList.add(`${presentColor}On`);

  //first color becomes undefined before first card and
  //the present color before 2nd then set time for amount
  //of time player has to find other card, unflips if no action


  if(cardObject.firstCard === true){
    cardObject.firstColor = presentColor;
    cardObject.card1 = card;
    cardObject.value = card.value;
    timeout1 = setTimeout(function(){
        console.log("no 2nd card path");
        unFlipCard1(cardObject);
        reset();
    }, 2000);
    cardObject.firstEnd = true;
  }

  //for 2nd card, if new color is same as 1st color, don't unflip
  //but if isn't the same then set 2 sec wait.

  //if firstCard === false
  else{
    // firstCard = false1
    if (timeout1){
      clearTimeout(timeout1);
    }

    cardObject.secondColor = presentColor;
    cardObject.card2 = card;

    if(cardObject.value !== card.value){
      if(cardObject.firstColor === cardObject.secondColor){
        console.log("match path");
        reset();
      }
      else{
        console.log("no match path");
        cardObject.listenerFlag = true;
        setTimeout(function(){
          unFlipCard2(cardObject);
          reset();
        }, 2000);
      }
    }

    else{
      console.log("same space twice")
      cardObject.listenerFlag = true;
        setTimeout(function(){
          unFlipCard1(cardObject);
          reset();
        }, 2000);
    }
  }
}

/** Flip a card face-down. */

function unFlipCard2(cardObject) {

  // ... you need to write this ...
  // if(card1 && card2){
    console.log("flip2");
    console.log(cardObject);
    const presentColor1 = cardObject.card1.classList[0];
    cardObject.card1.classList.remove(`${presentColor1}On`);
    const presentColor2 = cardObject.card2.classList[0];
    cardObject.card2.classList.remove(`${presentColor2}On`);

}

function unFlipCard1(cardObject){
  console.log("flip1");
  console.log(cardObject);
  const presentColor1 = cardObject.card1.classList[0];
  cardObject.card1.classList.remove(`${presentColor1}On`);
}

function reset(){
  console.log("reset");
  cardObject.firstCard = true;
  cardObject.card1 = undefined;
  cardObject.card2 = undefined;
  cardObject.firstColor = undefined;
  cardObject.secondColor = undefined;
  cardObject.firstEnd = false;
  cardObject.listenerFlag = false;
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  // ... you need to write this ...
  evt.preventDefault();
  const whichCard = evt.target;
  console.log(whichCard.id);


  if (cardObject.listenerFlag === false){
    // cardOne = cardObject.card1.id;
    // if (cardOne !== whichCard.id)
      if (cardObject.firstEnd === true){
        console.log(cardObject);
        cardObject.firstCard = false;
      }
      flipCard(whichCard, cardObject);


  }

}

function startGame(){
  console.log("start game")
  const buttonsDiv = document.querySelector("#buttonsDiv");
  const squaresNumForm = document.createElement("form");
  squaresNumForm.name = "squaresNumForm"
  const squaresNumLabel = document.createElement("label")
  squaresNumLabel.innerHTML =
    "<br><br>Enter the number of cards you would like to match. <br> Make sure to choose an even number: <br><br>"
  const squaresNumTextEntry = document.createElement("input")
  squaresNumTextEntry.type = "text";
  squaresNumTextEntry.defaultValue = 8;
  squaresNumTextEntry.name = "squaresNumTextEntry"
  const squaresNumSubmit = document.createElement("input")
  squaresNumSubmit.type = "submit";
  squaresNumSubmit.name = " squaresNumSubmit";
  squaresNumForm.appendChild(squaresNumLabel);
  squaresNumForm.appendChild(squaresNumTextEntry);
  squaresNumForm.appendChild(squaresNumSubmit);
  buttonsDiv.appendChild(squaresNumForm);


  console.log("test1")


  function squaresSubmitted(evt){
    // evt.preventDefault;
    // console.dir(evt.target);
    const numberOfCards = evt.target.value;
    // let numberOfCards = 8;
    console.log(numberOfCards)

    const COLORS = [];
    for (let i=0; i<numberOfCards; i++){

    }



    const colors = shuffle(COLORS);

    createCards(colors);
  }

  console.log("test2");
  squaresNumForm.addEventListener("submit", squaresSubmitted);
  console.log("test3");
}



function restartGame(evt){

}



// const cardClicked = document.addEventListener("click", handleCardClick);
const startButton = document.querySelector("#start");
const startClicked = startButton.addEventListener("click", startGame);
const restartButton = document.querySelector("#restart");
const numSquaresSubmit = document.addEventListener("click", restartGame);
const restartClicked = document.addEventListener("click", restartGame);


//done: adding protection from clicking 3rd card, added protection from clicking
//same card twice
//todo:
  //reset button
  //start button
  //keep score (count clicks) and display
  //save lowest scoring game
  //choose number of cards
  //random colors