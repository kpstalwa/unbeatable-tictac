const gameBoard = (() => {
  let curBoard=[];
  let viCond = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
  ];
  let winningIndex=null;
  let playerWins = 0;
  let aiWins = 0;
  let curWinner = null;
  let humanPlay = 'X'; //for now player is always X
  let aiPlay = 'O';
  let curPlayer = aiPlay; 
  let playedFirst = aiPlay;
  let curDiff = 'hard';//or'easy'
  let cells = document.querySelectorAll('.cell');
  //score and switching x and y

  function updateScreenScore(){
    let psc = document.body.querySelector('#playerscore');
    psc.textContent = playerWins;
    let asc = document.body.querySelector('#aiscore');
    asc.textContent = aiWins;
  }


  function updateScoreBoard(winner){
    if(winner === humanPlay) {
      playerWins++;
    }
    else if(winner === aiPlay) {
      aiWins++;
    }
    else{
      return;
    }
    updateScreenScore();
  }
  function announceOutcome(message){
    //make all the cells unclickable
    for (var i = cells.length - 1; i >= 0; i--) {
      cells[i].removeEventListener('click', makeMark, false);
    }
  //make div visible
  let divm = document.querySelector('.endgame');
  divm.style.display = 'block';
    //write the message
    let mes = document.querySelector('.endgame .text');
    if(curWinner == humanPlay){
      mes.innerHTML = "Hey, you won! <br/>";
    }
    else if(curWinner == aiPlay){
     mes.innerHTML = "Oh no, the AI won! <br/>";
   }
   else{
    console.log("reached here");
    mes.innerHTML = message;
  }
}

function checkTie(){
  for (var i = curBoard.length - 1; i >= 0; i--) {
    if(curBoard[i] === 'f'){
        //there is a space to put things
        return false;
      }
    }
    winningIndex=-1;
    highlightWinCombo();
    //incase of Tie we want it to say TieGame, and make the area unclickable
    announceOutcome("It's a Tie");
    //update the scoreboard
    updateScoreBoard(null);
    return true;
  }

  function highlightWinCombo(){
    let winArry = null;
    if(winningIndex!=-1){
      winArry = viCond[winningIndex];
    }
    for (var i = cells.length - 1; i >= 0; i--) {
      if(winningIndex===-1){
        //tie game
        cells[i].style.backgroundColor = "green";
      }
      else {
        if(winArry[0] == cells[i].id || winArry[1] == cells[i].id|| winArry[2] == cells[i].id){
          if(curWinner == humanPlay){
            cells[i].style.backgroundColor = "blue";
          }
          else{
            cells[i].style.backgroundColor = "red";
          }
        }
      }
    }
  }

  function checkWin(board){
    let aiCheck=0;
    let playCheck=0;
    for(let i=0; i<viCond.length; i++) {
      for(let j=0; j<viCond[i].length; j++){  
          //do comparison
          if(board[viCond[i][j]] === humanPlay){

            playCheck++;
            if(playCheck===3){
          //player has won
          curWinner = humanPlay;
          winningIndex=i;
          return true;
        }
            //console.log(playCheck);
          }
          else if(board[viCond[i][j]] === aiPlay){
            aiCheck++;
            if (aiCheck===3){
          //ai has won
          curWinner = aiPlay;
          winningIndex=i;
          return true;
        }
      }
      else{
            //free spot
            continue;
          }
        }
        aiCheck=0;
        playCheck=0;
      }
      return false;
    }

    function fillSlot(slotId, player){
    //before putting in a value check for ties/ai cannot put last tile
    if(!checkTie()){
      let slot = document.getElementById(slotId);
      slot.textContent = player;
      //update curBoard
      let tmp = parseInt(slotId);
      curBoard[tmp] = player;
      //after adding a point check for victory conditions
      //if(checkWin()){
        if(checkWin(curBoard)){
        //  alert(curWinner);
        highlightWinCombo();
        announceOutcome("The winner is " + curWinner);
        updateScoreBoard(curWinner);
        return;
      }
      else if(findFirstEmptySpot() === -1){
        checkTie();
      }
    }
  }

  function makeMark(slot){
   let slotId=  slot.target.id;
   if(curBoard[slotId] ==='f'){

      //if(curPlayer === humanPlay){
      //curPlayer will always be human because the AI waits on human
      //except for first iteration
      fillSlot(slotId, humanPlay);
      //winning before a tie
      if(!curWinner){
        fillSlot(nextBestSpot(), aiPlay);
      }
    //}
  }
}

//simple AI algorithm
function findFirstEmptySpot(){
  for(let i=0; i<curBoard.length; i++){
    if(curBoard[i] == 'f'){
      return i;
    }
  }
  return -1;
}

//returns the id of the td
function nextBestSpot(){
  //returns a move
  if(curDiff === 'easy'){
    return findFirstEmptySpot();
  }
  else{
  return minimax(curBoard, aiPlay).index;
}
}

function resetStateOfWin(){
  curWinner = null;
  winningIndex = null;
}
function findAllEmptySpots(){
  let arr = [];
  for (var i = 0; i < curBoard.length; i++) {
    if(curBoard[i] === 'f'){
      arr.push(i);
    }
  }
  return arr;
}


function minimax(board, currentPlayer){
 //first check terminal states and assign results
let emptySpots = findAllEmptySpots();

 if(checkWin(board)){
  if (curWinner === aiPlay){
   // console.log("Reached Terminal State: AI win");
    resetStateOfWin();
    return {score: 10};
  }
  else if(curWinner === humanPlay){
    //human won
   // console.log("Reached Terminal State: Player win");
    resetStateOfWin();
    return {score: -10};
  }
}
else if (emptySpots.length === 0){
  //  console.log("Tie Game");
    return {score: 0};
  }
//console.log("All empty spots are:" + emptySpots);


let moves = []; //a list of all possible moves available to current player
for (var i = 0; i < emptySpots.length; i++) {
  var move = {}; //empty object to store score and index
  move.index = emptySpots[i];

  let storeBoardTmp = board[emptySpots[i]];
  //place your move
  board[emptySpots[i]] = currentPlayer;

  if(currentPlayer === humanPlay){
    //change to ai's turn to go through this choice

    //console.log("Placed move human move at " + emptySpots[i]);
    var tmpobj = minimax(board, aiPlay);
    //console.log(tmpobj);

    move.score = tmpobj.score;
  }
  else{
  // console.log("Placed move AI move at " + emptySpots[i]);
   var tmpobj1 = minimax(board, humanPlay);
  // console.log(tmpobj1);
   move.score = tmpobj1.score;
 }

  //change back board
  board[emptySpots[i]] =  storeBoardTmp;
  //store this move as a possible choice
  moves.push(move);
  //console.log("All possible moves at this lvl evaluated are " + moves);
}
  var bestInd;
  if (currentPlayer == aiPlay){
    //maximize score
    var highSoFar = -1000;
    for (var p = 0; p < moves.length; p++) {
     if(moves[p].score > highSoFar){
      highSoFar = moves[p].score;
      bestInd = p;
    }
  }
  
}
else {
  var lowSoFar = 1000;
  for (var ii = 0; ii < moves.length; ii++) {
   if(moves[ii].score < lowSoFar){
    lowSoFar = moves[ii].score;
    bestInd = ii;
  }
}
}
return moves[bestInd]; 
}
function clearBoard(){
  for (var i = cells.length - 1; i >= 0; i--) {
    cells[i].textContent = '';
    let divm = document.querySelector('.endgame');
    divm.style.display = 'none';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', makeMark, false);
  }
}
//switch who goes first when a new game is started
//alternating turns
function switchPlayers(){
  if(playedFirst === humanPlay){ 
    //ai's turn
    //make the initial move from AI before click is activated
    fillSlot(nextBestSpot(), aiPlay);
    playedFirst = aiPlay;
    //change back to player
  }
  else{
    playedFirst = humanPlay;
  }
}
//gets called each time a new game is started
function startGame() {
  curBoard = [];
  //create an actual game board
  for(let i=0; i<9; i++){
    curBoard.push('f'); //free slot
  }
  clearBoard();
  updateScreenScore();
  switchPlayers();
  winningIndex = null;
  curWinner = null;
}

function setDifficulty(){
  if(curDiff === 'easy'){
    curDiff = 'hard';
    alert("You are now in Hard Mode, It's now impossible to win >:D")
  }
  else{
    curDiff = 'easy';
    alert("You are now in easy mode, the AI will make dumb moves ~:O");
  }

//  startGame();
}

return {startGame, setDifficulty};



})();

gameBoard.startGame();
let newBut = document.body.querySelector("#newgamebutton");
let contBut = document.body.querySelector('#continuebutton');
let diffBut = document.body.querySelector('#changediffbutton');
contBut.addEventListener('click', gameBoard.startGame, false);
newBut.addEventListener('click', gameBoard.startGame, false);
diffBut.addEventListener('click', gameBoard.setDifficulty, false);


