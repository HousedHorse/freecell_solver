"use strict";

//text defintions:
const SPADES = "<span style=\"color:black;font-size:1.25em\">&spades;</span>";
const HEARTS = "<span style=\"color:red;font-size:1.25em\">&hearts;</span>";
const DIAMONDS = "<span style=\"color:red;font-size:1.25em\">&diams;</span>";
const CLUBS = "<span style=\"color:black;font-size:1.25em\">&clubs;</span>";

const STACKS = 8;

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
    for(var i = 0; i < deal.length; i++){
      if(i < STACKS){
        board.push(new Array());
      }
      
      board[i % STACKS].push(deal[i]);
    }
    
    return board;
  }
  

  this.displayBoard = function(b){
    var ret = "";
    for(var i = 0; i < b.length; i++){
      ret += i + 1 + "&nbsp;::";
      for(var j = 0; j < b[i].length; j++){
        ret += b[i][j] + " ";
      }
      ret += "<br>";
    }
    return ret;
  }
  
  this.solve = function(){
    //for now, to test///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return this.displayBoard(this.board);
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
