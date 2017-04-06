//text defintions:
const SPADES = "<span style=\"color:black;font-size:1.25em\">&spades;</span>";
const HEARTS = "<span style=\"color:red;font-size:1.25em\">&hearts;</span>";
const DIAMONDS = "<span style=\"color:red;font-size:1.25em\">&diams;</span>";
const CLUBS = "<span style=\"color:black;font-size:1.25em\">&clubs;</span>";

const H = 3;
const C = 1;
const D = 2;
const S = 4;

const STACKS = 8;

const F = STACKS;
const FC = STACKS+1;

$(document).ready(function(){
  
  var solver = new Solver();
  
  //submit button
  $('#submit').click(function(){submit(solver)});
});

function error(txt){
  if(!txt){
    return;
  }
  $('#error').html("<span style=\"color:red\">Error:</span> " + txt + "...");
  setTimeout(function(){
    $('#error').html("");
  },3000);
}

function submit(solver){
  //set id to the value of the game num textbox
  var id = ($('#game-num').val());
  
  //check if blank
  if(!id){
    error("ID field must not be blank");
    return;
  }
  
  //convert to int
  id = id-0;
  
  //other checks
  if(id >= 0 && id <= 100000000){
    //if input is correct, submit
    solver.setId(id);
  }else if(id < 0){
    error("Game ID must be greater than or equal to 0");
  }else if(id > 100000000){
    error("Game ID must be less than or equal to 100,000,000");
  }else{
    error("Game ID must be a number");
  }
  
  //solve the board
  var board = solver.displayBoard(solver.board);
  var solution = solver.solve();
  
  //display board
  $('#board').html(board);
}

//class defintions
function Solver(id){
  var R1;
  var R2;
  var R3;
  var R4;
  var R5;
  var R6;
  var R7;
  var R8;
  
  var FC1;
  var FC2;
  var FC3;
  var FC4;
  
  var F1;
  var F2;
  var F3;
  var F4; 
   
  if(!id){
    this.id = -1;
  }else{
    this.id = id-0;
    this.board = this.genBoard();
  }
  
  this.setId = function(id){
    this.id = id-0;
    this.board = this.genBoard();
  }
  this.getId = function(){
    return this.id;
  }
  
  //generate board
  this.genBoard = function(){
    var cards = [];
    var deal = [];
    
    //add cards
    for(var i = 0; i < 52; i++){
      cards.push(new Card(i));
    }
    
    //use ID as the seed for LCG
    for(var i = 0; cards.length > 0; i++){
      //pick a random card
      var index = rand(this.id, i) % cards.length;
      
      //swap the random card and the last card
      var temp = cards[index];
	    cards[index] = cards[cards.length-1];
      cards[cards.length-1] = temp;
      
      //pop the last card off the deck and put it into the deal stack
      deal.push(cards.pop());
    }
    
    var board = [];
    //add two extra arrays for foundations and freecells
    board.push(new Array());
    board.push(new Array());
    
    for(var i = 0; i < deal.length; i++){
      if(i < STACKS){
        board.push(new Array());
      }
      
      board[i % STACKS].push(deal[i]);
    }
    
    //add freecells and foundations ///// [STACKS] is foundations [STACKS+1] is cells
    board[STACKS].push(new Cell(H));
    board[STACKS].push(new Cell(C));
    board[STACKS].push(new Cell(D));
    board[STACKS].push(new Cell(S));
    
    board[STACKS+1].push(new Cell());
    board[STACKS+1].push(new Cell());
    board[STACKS+1].push(new Cell());
    board[STACKS+1].push(new Cell());
    
    // R1 = board[0];
    // R2 = board[1];
    // R3 = board[2];
    // R4 = board[3];
    // R5 = board[4];
    // R6 = board[5];
    // R7 = board[6];
    // R8 = board[7];
    // 
    // FC1 = board[9][0];
    // FC2 = board[9][1];
    // FC3 = board[9][2];
    // FC4 = board[9][3];
    // 
    // F1 = board[8][0];
    // F2 = board[8][1];
    // F3 = board[8][2];
    // F4 = board[8][3];
    
    board[F][0].push(board[0].pop());
    board[FC][0].push(board[0].pop());
    
    board[0].push(board[F][0].pop());
    
    return board;
  }
  

  this.displayBoard = function(b){
    var ret = "";
    
    //show foundations and freecells
    for(var i = STACKS; i<STACKS + 2; i++){
      switch(i){
        case STACKS:
          ret+= "Foundations&nbsp;::&nbsp;";
          break;
        case STACKS+1:
          ret+= "&nbsp;&nbsp;FreeCells&nbsp;::&nbsp;";
          break;
      }
      
      for(var j = 0; j < b[i].length; j++){
        ret +=b[i][j];
      }
      
      ret+= "<br>";
      ret+= "<br>";
    }
    
    for(var i = 0; i < STACKS; i++){
      ret += i + 1 + "&nbsp;::";
      for(var j = 0; j < b[i].length; j++){
        ret += b[i][j] + " ";
      }
      ret += "<br>";
    }
    return ret;
  }
  
  this.solve = function(){
    
  }
}

function Card(n){
  //set suit based on n
  this.suit = (n % 4) + 1; // 1 - clubs
                           // 2 - diamonds
                           // 3 - hearts
                           // 4 - spades
                           
  //set rank based on n
  this.rank = Math.floor(n / 4) + 1;
}

//tostring function for card
Card.prototype.toString = function(){
  var ret = "";
  
  //set rank
  switch(this.rank){
    case 1:
      ret += "&nbsp;A";
      break;
    case 11:
      ret += "&nbsp;J";
      break;
    case 12:
      ret += "&nbsp;Q";
      break;
    case 13:
      ret += "&nbsp;K";
      break;
    case 10:
      ret += "10";
      break;
    default:
      ret += "&nbsp;" + this.rank;
      break;
  }
  
  //set suit
  switch(this.suit){
    case 1:
      ret += CLUBS;
      break;
    case 2:
      ret += DIAMONDS;
      break;
    case 3:
      ret += HEARTS;
      break;
    case 4:
      ret += SPADES;
      break;
    default:
      ret += "#";
      break;
  }
  
  return ret;
}

function Cell(suit){
  //set suit for foundations or 0 for freecells
  if(!suit){
    this.suit = 0;
  }
  else{
    this.suit = suit;
  }
  
  this.topCard = "#";
  
  // function: push
  //  purpose: push the card c onto the cell. includes logic to check if the
  //           move is valid
  //  returns: null if move is invalid
  //       in: c
  this.push = function(c){
    //if it is a foundation cell
    if (this.suit !== 0){
      //and if it is empty
      if(this.topCard !== "#"){
        //and if the card being pushed is not an ace
        if(c.rank !== 1){
          return null;
        }
      }else{//if it is not empty.....
        //and if the rank of the card is not 1 above the rank of the topCard
        if(c.rank !== (this.topCard.rank + 1)){
          return null;
        }
      }
      //if the suit of the card being pushed is not correct
      if(c.suit !== this.suit){
        return null;
      }
    }
    
    //if it is a regular free cell then return null if it has a card on it
    if(this.topCard !== "#"){
      return null;
    }
    
    //else push the card
    this.topCard = c;
  }
  
  this.pop = function(){
    if(this.topCard === "#") return null;
    
    var temp = this.topCard;
    this.topCard = "#";
    return temp;
  }
}

Cell.prototype.toString = function(){
  var ret = "";
  if(this.suit === 0){
    if(this.topCard === "#"){
      ret += "&nbsp;&nbsp;";
    }
    ret += "&nbsp;" + this.topCard;
  }else{
    switch(this.suit){
      case H:
        ret += HEARTS;
        break;
      case C:
        ret += CLUBS;
        break;
      case D:
        ret += DIAMONDS;
        break;
      case S:
        ret += SPADES;
        break;
    }
    ret += "-" + (this.topCard.rank || this.topCard) + "&nbsp;";
  }
  
  return ret;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Move(start,end,board){
  this.done = false;
  
  this.make = function(){
    end.push(start.pop());
    this.done = true;
  }
}

Move.prototype.toString = function(){
  var ret = "";
}

//RNG functions
function lcg(seed, n){
  if(n === 0){
    return seed;
  }
  
  return (214013 * lcg(seed, n-1) + 2531011) % (Math.pow(2,31));
}

function rand(seed, n){
  return Math.floor(lcg(seed, n+1) / (Math.pow(2,16)));
}
