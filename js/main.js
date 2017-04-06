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

var freecells = STACKS + 4;

$(document).ready(function(){
  
  //submit button
  $('#submit').click(function(){submit()});
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

function submit(){
  var solver = new Solver();
  
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
  //vars for foundations
  var hfound = new Cell(H);
  var cfound = new Cell(C);
  var dfound = new Cell(D);
  var sfound = new Cell(S);
  
  //vars for freecells
  var fc1 = new Cell();
  var fc2 = new Cell();
  var fc3 = new Cell();
  var fc4 = new Cell();
  
  //vars for rows
  var r1 = new Row();
  var r2 = new Row();
  var r3 = new Row();
  var r4 = new Row();
  var r5 = new Row();
  var r6 = new Row();
  var r7 = new Row();
  var r8 = new Row();
   
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
    freecells = STACKS + 4;
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
    
    //add rows to the board
    board.push(r1);
    board.push(r2);
    board.push(r3);
    board.push(r4);
    board.push(r5);
    board.push(r6);
    board.push(r7);
    board.push(r8);
    
    for(var i = 0; i < deal.length; i++){
      board[i % STACKS].push(deal[i]);
    }
    
    //push the 
    
    
    //add two extra arrays for foundations and freecells
    board.push(new Array());
    board.push(new Array());
    
    //add freecells and foundations ///// [STACKS] is foundations [STACKS+1] is cells
    board[STACKS].push(hfound);
    board[STACKS].push(cfound);
    board[STACKS].push(dfound);
    board[STACKS].push(sfound);
    
    board[STACKS+1].push(fc1);
    board[STACKS+1].push(fc2);
    board[STACKS+1].push(fc3);
    board[STACKS+1].push(fc4);
    
    console.log(r1.topCard+"");
    console.log(r2.topCard+"");
    console.log(r3.topCard+"");
    console.log(r4.topCard+"");
    console.log(r5.topCard+"");
    
    console.log(fc1.topCard+"");
    console.log(cfound.topCard+"");
    
    fc1.push(r1.pop());
    r6.pop();
    r6.pop();
    cfound.push(r6.pop());
    
    console.log("new top cards:");
    console.log(r1.topCard+"");
    console.log(r2.topCard+"");
    console.log(r3.topCard+"");
    console.log(r4.topCard+"");
    console.log(r5.topCard+"");
    
    console.log(fc1.topCard+"");
    console.log(dfound.topCard+"");
    
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
      ret+= b[i];
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

//CARD TO STRING
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

//CLASS: Cell
function Cell(suit){
  //set suit for foundations or 0 for freecells
  if(!suit){
    this.suit = 0;
  }
  else{
    this.suit = suit;
  }
  
  //set topCard to its default value of 0
  this.topCard = 0;
  
  // function: push
  //  purpose: push the card c onto the cell. includes logic to check if the
  //           move is valid
  //  returns: null if move is invalid
  //       in: c
  this.push = function(c){
    //if it is a foundation cell
    if (this.suit !== 0){
      //and if it is empty
      if(this.topCard !== 0){
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
    if(this.topCard !== 0){
      return null;
    }
    
    //else push the card
    freecells--;
    this.topCard = c;
  }
  
  // function: pop
  //  purpose: pop the card off the cell and return it
  //  returns: null if no card is on the cell, the card otherwise
  this.pop = function(){
    if(this.topCard === 0) return null;
    
    if(this.suit === 0) freecells++;
    
    var temp = this.topCard;
    this.topCard = 0;
    return temp;
  }
}
//CELL TO STRING
Cell.prototype.toString = function(){
  var ret = "";
  if(this.suit === 0){
    if(this.topCard === 0){
      ret += "&nbsp;#";
    }else{
      ret += this.topCard;
    }
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

function Row(){
  this.cards = [];
  this.topCard = 0;
  var size = 0;
  
  // function: push
  //  purpose: push a card onto the row
  //       in: c
  this.push = function(c){
    if(size === 0){
      freecells--;
    }
    this.cards.push(c);
    this.topCard = c;
    size++;
  }
  
  // function: pop
  //  purpose: pop a card off the row and return it
  //  returns: null if no card is in the row, the card otherwise
  this.pop = function(){
    if(size === 0){
      return null
    }else if(size === 1){
      freecells++;
    }
    
    ret = this.cards.pop();
    size--;
    if(size > 0){
      this.topCard = this.cards[size-1]
    }else{
      this.topCard = 0;
    }
    
    return ret;
  }
}

Row.prototype.toString = function(){
  var ret = "";
  for(var j = 0; j <this.cards.length; j++){
    ret += this.cards[j] + " ";
  }
  return ret;
}

//CLASS: Move
function Move(start,end,board){
  this.done = false;
  
  //temporary start variables
  var _start = start.pop();
  
  // function: make
  //  purpose: change the board state based on the move
  //  returns: null if move is invalid
  //       in: c
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
