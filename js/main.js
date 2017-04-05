"use strict";

//text defintions:
var spades = "<span style=\"color:black;font-size:1.25em\">&spades;</span>";
var hearts = "<span style=\"color:red;font-size:1.25em\">&hearts;</span>";
var diamonds = "<span style=\"color:red;font-size:1.25em\">&diams;</span>";
var clubs = "<span style=\"color:black;font-size:1.25em\">&clubs;</span>";

$(document).ready(function(){
    
  console.log(Math.pow(2,31));
  
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
  var solution = solver.solve();
  
  //display solution
  $('#solution').html(solution);
}

//class defintions
function Solver(id){
  if(!id){
    this.id = -1;
  }else{
    this.id = id-0;
  }
  
  this.setId = function(id){
    this.id = id-0;
  }
  this.getId = function(){
    return this.id;
  }
  
  //generate board
  this.board = function(){
    var cards = [];
    var deal = [];
    //suit
    for(var i = 0; i < 4; i++){
      var suit = "";
      switch(i){
        case 0:
          suit = "C";
          break;
        case 1:
          suit = "D";
          break;
        case 2:
          suit = "H";
          break;
        case 3:
          suit = "S";
          break;
      }
      //number
      for(var j = 0; j < 13; j++){
        var num = "";
        switch(j){
          case 0:
            num = "A";
            break;
          case 10:
            num = "J";
            break;
          case 11:
            num = "Q";
            break;
          case 12:
            num = "K";
            break;
          default:
            num = j+1;
            break;
        }
        //add card to the array of cards
        cards.push(card(num+suit) + " ");
      }
    }
    
    //use ID as the seed for LCG
    for(var i = 0; cards.length > 0; i++){
      //pick a random card
      var index = rand(this.id, i+1) % cards.length;
      
      //swap the random card and the last card
      var temp = cards[index];
      cards[index] = cards[cards.length-1];
      cards[cards.length-1] = temp;
      
      //pop the last card off the deck and put it into the deal stack
      deal.push(cards.pop());
    }
    
    //for now....
    return deal;
  }
  
  this.solve = function(){
    //for now, to test
    return this.board();
  }
}

function card(c){
  var num = c[0].toUpperCase();
  if (c[1] === "0"){
    num += c[1];
    var suit = c[2].toLowerCase();
  }else{
  var suit = c[1].toLowerCase();
  }
  
  var suitstring;
  
  //set suit
  switch(suit){
    case 1:
    case "s":
    case "spades":
      suitstring = spades;
      break;
    case 2:
    case "h":
    case "hearts":
      suitstring = hearts;
      break;
    case 3:
    case "d":
    case "diams":
    case "diamonds":
      suitstring = diamonds;
      break;
    case 4:
    case "c":
    case "clubs":
      suitstring = clubs;
      break;
    default:
      suitstring = spades;
  }
  
  //return number and suit
  return num+suitstring;
}

//RNG functions
function lcg(seed, n){
  if(n === 0){
    return seed;
  }
  
  return (214013 * lcg(seed, n-1) + 2531011) % (Math.pow(2,31));
}

function rand(seed, n){
  return Math.floor(lcg(seed, n) / (Math.pow(2,16)));
}

function nextLcg(seed, prev){
  return (214013 * prev + 2531011) % (Math.pow(2,31));
}
