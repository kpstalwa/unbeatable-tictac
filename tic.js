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

  function checkWin(){
    let aiCheck=0;
    let playCheck=0;
    for(let i=0; i<viCond.length; i++) {
      for(let j=0; j<viCond[i].length; j++){  
          //do comparison
          if(curBoard[viCond[i][j]] === humanPlay){

            playCheck++;
            if(playCheck===3){
          //player has won
          curWinner = humanPlay;
          winningIndex=i;
          return true;
        }
            //console.log(playCheck);
          }
          else if(curBoard[viCond[i][j]] === aiPlay){
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
        if(checkWin()){
          alert(curWinner);
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
  return findFirstEmptySpot();
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
return {startGame};

})();


gameBoard.startGame();
let newBut = document.body.querySelector("#newgamebutton");
let contBut = document.body.querySelector('#continuebutton');
contBut.addEventListener('click', gameBoard.startGame, false);
newBut.addEventListener('click', gameBoard.startGame, false);


