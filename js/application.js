$(document).ready(function(){
/* card list */
var cardListTreasure = [
{cname:"Copper",type:"Treasure",money:1,action:0,cost:0,vp:0,description:"+1 money this turn"},
{cname:"Silver",type:"Treasure",money:2,action:0,cost:3,vp:0,description:"+2 money this turn"},
{cname:"Gold",  type:"Treasure",money:3,action:0,cost:6,vp:0,description:"+3 money this turn"}
],
  cardListVP = [
{cname:"Estate",type:"Victory",money:0,action:0,cost:2,vp:1,description:"+1 VP at the end of the game"},
{cname:"Duchy", type:"Victory",money:0,action:0,cost:5,vp:3,description:"+3 VP at the end of the game"},
{cname:"Province",type:"Victory",money:0,action:0,cost:8,vp:6,description:"+6 VP at the end of the game"},
{cname:"Curse",type:"Curse",money:0,action:0,cost:0,vp:-1,description:"-1 VP at the end of the game"}
],
  cardList = [
{cname:"Workshop",type:"Action",money:0,action:0,buys:0,cards:0,cost:3,vp:0,description:"Gain a card costing up to 4."},
{cname:"Woodcutter",type:"Action",money:2,action:0,buys:1,cards:0,cost:3,vp:0,description:"+1 Buy, +2 Money"},
{cname:"Witch",type:"Action",money:0,action:0,buys:0,cards:2,cost:5,vp:0,description:"Each other player gains a Curse card."},
{cname:"Village",type:"Action",money:0,action:2,buys:0,cards:1,cost:3,vp:0,description:"+1 Card, +2 Actions"},
{cname:"Throne Room",type:"Action",money:0,action:0,buys:0,cards:0,cost:4,vp:0,description:"Choose an Action card in your hand.  Play it twice."},
{cname:"Thief",type:"Action Attack",money:0,action:0,buys:0,cards:0,cost:4,vp:0,description:"Each other player reveals the top 2 cards of his deck.  If they revealed any Treasure cards, they trash one of them that you choose.  You may gain any or all of these trashed cards.  They discard the other revealed cards."},
{cname:"Spy",type:"Action Attack",money:0,action:1,buys:0,cards:1,cost:4,vp:0,description:"Each player (including yourself) reveals the top card of his deck and either discards it or puts it back, your choice."},
{cname:"Smithy",type:"Action",money:0,action:0,buys:0,cards:3,cost:4,vp:0,description:"+3 Cards"},
{cname:"Remodel",type:"Action",money:0,action:0,buys:0,cards:0,cost:4,vp:0,description:"Trash a card from your hand.  Gain a card costing up to 2 money more than the trashed card."},
{cname:"Moat",type:"Action Reaction",money:0,action:0,buys:0,cards:2,cost:2,vp:0,description:"When another player plays an Attack card, you may reveal this from your hand.  If you do, you are unaffected by that Attack."},
{cname:"Moneylender",type:"Action",money:0,action:0,buys:0,cards:0,cost:4,vp:0,description:"Trash a Copper from your hand.  If you do, +3 Money this turn."},
{cname:"Mine",type:"Action",money:0,action:0,buys:0,cards:0,cost:5,vp:0,description:"Trash a Treasure card from your hand.  Gain a Treasure card costing up to 3 more; put it in your hand."},
{cname:"Militia",type:"Action Attack",money:2,action:0,buys:0,cards:0,cost:4,vp:0,description:"+2 Money, Each other player discards down to 3 cards in his hand."},
{cname:"Market",type:"Action",money:1,action:1,buys:1,cards:1,cost:5,vp:0,description:"+1 Card, +1 Action, +1 Buy, +1 Money"},
{cname:"Library",type:"Action",money:0,action:0,buys:0,cards:0,cost:5,vp:0,description:"Draw until you have 7 cards in hand.  You may set aside any Action cards drawn this way, as you draw them.  Discard the set aside cards after you finish drawing."},
{cname:"Laboratory",type:"Action",money:0,action:1,buys:0,cards:2,cost:5,vp:0,description:"+2 Cards, +1 Action"},
{cname:"Gardens",type:"Victory",money:0,action:0,buys:0,cards:0,cost:4,vp:"*",description:"Worth +1 VP for every 10 cards in your deck (rounded down)."},
{cname:"Feast",type:"Action",money:0,action:0,buys:0,cards:0,cost:4,vp:0,description:"Trash this card.  Gain a card costing up to 5."},
{cname:"Festival",type:"Action",money:2,action:2,buys:1,cards:0,cost:5,vp:0,description:"+2 Actions, +1 Buy, +2 Money"},
{cname:"Council Room",type:"Action",money:0,action:0,buys:1,cards:4,cost:5,vp:0,description:"+4 Cards, +1 Buy, Each other player draws a card."},
{cname:"Chapel",type:"Action",money:0,action:0,buys:0,cards:0,cost:2,vp:0,description:"Trash up to 4 cards from your hand."},
{cname:"Chancellor",type:"Action",money:2,action:0,buys:0,cards:0,cost:3,vp:0,description:"You may immediately put your deck into your discard pile."},
{cname:"Cellar",type:"Action",money:0,action:1,buys:0,cards:0,cost:2,vp:0,description:"Discard any number of cards.  +1 Card per card discarded."},
{cname:"Bureaucrat",type:"Action Attack",money:0,action:0,buys:0,cards:0,cost:4,vp:0,description:"Gain a silver card; put it on top of your deck.  Each other player reveals a Victory card from his hand and puts it on his deck (or reveals a card with no Victory cards)."},
{cname:"Adventurer",type:"Action",money:0,action:0,buys:0,cards:0,cost:6,vp:0,description:"Reveal cards from your deck until you reveal 2 Treasure cards.  Put those Treasure cards into your hand and discard the other revealed cards."}
],
cardListIntrigue = [], 
cardListSeaside = [],
cardListAll = cardListTreasure.concat(cardListVP,cardList);

/* global variables */
var phase="action",addCurse=false,
  /* cards in play for the game */  
  cardsInPlay=[],
  deck=[],
  discard=[],
  /* cards a player has gained, bought, not trashed */
  playerCards=[],
  hand=[],
  turn=1,

/* constants */
cn = {
  pA:"#south-player .actions",
  pB:"#south-player .buys",
  pM:"#south-player .money",
  pC:"#player-cards .card-title",
  pCT:"#player-cards .card-type",
  pCP:"#player-cards .card-play",
  paB:"#play-area .buy-a-card",
  cC:"card-title-curse",
  cVP:"card-title-vp",
  cM:"card-title-money",
  cR:"card-title-react",
  V:"Victory",
  T:"Treasure",
  C:"Curse",
  A:"Action",
  AR:"Action Reaction",
  AA:"Action Attack"
},
/* messsages */
msgs = {
  nb:"You don't have any buys left.",
  nm:"You don't have enough money.",
  ncl:"None of this card left to buy",
  na:"You don't have any actions left.",
  buy:"You are in the buy phase."
};

/* 
 * variables: cardlists, global variables, constants, messages
 * timer
 * ajax server events
 * jQuery events
 * player actions
 * screen manipulation
 * validations
 * convenience methods
 * initial state functions
 * append
 */

/* local timer until ending turn */

/* polling for server updates */

/* jQuery events */
/* card info */
$(".card-info").live("click",function(){
  var $this = $(this), cardTitle = getCard($this),
    c = discoverCard(cardTitle), msg;
  msg = "Card Name: " + c.cname + "\nCard Type: " + c.type 
    + "\nCard Cost: " + c.cost;
  if (c.vp > 0)
    msg += "\nVictory Points: " + c.vp;
  msg += "\nDescription: " + c.description;
  msg += "\nQuantity: " + c.qty;
  alert(msg);
  return false;
});

/* playing cards */
$(".card-play").click(function(){
  var played = playCard(getCard($(this)));
  if (played){
    $(this).parents(".card").fadeOut().end().remove();
  }
  return false;
});

/* ending turn */
$(".end-turn").click(function(){
  var ended = endTurn();
  if (ended){
    //reset for next turn
    phase = "action";
    $(cn.paB).show();
    discardHand();
    resetPlayerArea();
    dealDeck(5);
    setupCards(cn.pC);
    depositMoney();
    turn++;
  }
});

$(".new-game").click(function(){
  newGame();
});

/* buying cards */
$(".buy-a-card").live("click",function(){
  buyCard($(this));
  return false;
});
/* end jQuery events */

/* screen manipulation */
/* update what you did */
function updateEvents(action,card){
  var $playCard = $(".play-card"),played;
  if ($playCard.find("li:first").html() === "What to do?"){
    $playCard.find("li:first").remove();
  }
  if( $playCard.find("li").length > 15){
    $playCard.find("li:first").remove();
  }
  played = "<li>Turn "+ turn + ": You " + action + ": "+card+"</li>";
  $("#events-area .play-card").append(played);
}
/* add card stats to player turn */
function addCardStats(card){
  if (card.money > 0)
    setMoney(null,card.money);
  if (card.action > 0)
    setActions(null,card.action);
  if (card.buys > 0)
    setBuys(null,card.buys);
}
/* reset the player area */
function resetPlayerArea(){
  setBuys(1);
  setActions(1);
}
/* "deposit money" to player area from gold in hand */
function depositMoney(){
  var monies = 0;
  $("#player-cards .card-title-money").each(function(){
    var card = discoverCard($(this).html());
    monies += card.money;
  });
  setMoney(monies);
}
/* end screen manipulation */

/* player actions */
/* play card*/
function playCard(title){
  var hasErrors = validatePlayCard();
  if (!hasErrors){
    var card = discoverCard(title);
    //server side validation action
    updateEvents("played",title);
    if (card.type.match(/Action/gi)){
      setActions(getActions()-1);
    }
    //do card stuff
    addCardStats(card);
    if (card.cards > 0)
      dealDeck(card.cards);

    setupCards(cn.pC);
    return true;
  } else {
    return false;
  }
}
/* trash card */
function trashCard(){
}
/* gain card */
function gainCard(){
}
/* buy card */
function buyCard($this){
  var hasErrors = validateBuyCard($this);
  if (!hasErrors){
    //perform the buy
    var buys = getBuys(),
      money = getMoney(),
      cost = getCost($this),
      card = getCard($this);

    updateEvents("bought",card);
    //decrement info
    setBuys(buys-1);
    setMoney(money-cost);

    for(var i=0;i<cardsInPlay.length;i++){
      var cardP = cardsInPlay[i];
      if (cardP.cname === card){
        cardsInPlay[i].qty--;
        setQty($this,cardsInPlay[i].qty);
        playerCards.push(cardP);
        discard.push(cardP);
      }
    }
    
    //after buy remove play card
    $(cn.pCP).hide();
    if (getBuys() <= 0)
      $(cn.paB).hide();
    phase = "buy";
    
    //check for game end (server-side)
    validateGameEnd();
  }
}
function endTurn(){
  return validateEndTurn();
}
/* end player actions */

/* validations */
function validatePlayCard(){
  var errors = "";
  if (getActions() <= 0){
    errors += msgs.na;
  } else if (phase === "buy"){
    errors += "\n"+msgs.buy;
  }
  return validateErrors(errors);
}
function validateBuyCard($this){
  var errors = "",
    askConfirm = false,
    actConfirm = true,
    cost = getCost($this),
    card = getCard($this),
    qty = 0;
  for(var i=0;i<cardsInPlay.length;i++){
    var cardP = cardsInPlay[i];
    if (cardP.cname === card){
      qty = cardP.qty;
    }
  }
  if (getBuys() <= 0){
    errors += msgs.nb;
  } else if (getMoney() < cost){
    errors += "\n"+msgs.nm;
  } else if (qty <= 0){
    errors += "\n"+msgs.ncl;
  }
  if (errors === "" && getActions() > 0 && phase === "action"){
    $(cn.pCT).each(function(){
      var act = $(this).val(), $parent = $(this).parent();
      if ($parent.css("display") !== "none" && act.match(/Action|Action Attack|Action Reaction/gi)){
        askConfirm = true;
      }
    });
    if (askConfirm)
      actConfirm = confirm("You still have actions remaining!  Buy this card and forfeit remaining actions?");
  }
  if(!actConfirm){
    return true;
  }
  return validateErrors(errors);
}
function validateEndTurn(){
  var errors = "",
    askConfirm = false,
    actConfirm = true;
  if (getMoney() > 0 && getBuys() > 0){
    actConfirm = confirm("You have money and buys left!  Forfeit your buy?");
  }
  if (actConfirm === "false" && getActions() > 0 && phase === "action"){
    $(cn.pCT).each(function(){
      var act = $(this).val(), $parent = $(this).parent();
      if ($parent.css("display") !== "none" && act.match(/Action|Action Attack|Action Reaction/gi))
        askConfirm = true;
    });
    if (askConfirm)
      actConfirm = confirm("You still have actions remaining!  Buy this card and forfeit remaining actions?");
  }
  if (!actConfirm){
    return false;
  }
  return true;
}
function validateErrors(errors){
  if (errors !== ""){
    alert(errors);
    return true;
  }
  else
    return false;
}
function validateGameEnd(){
  var empty = 0, gameOver = false;
  for(var i=0;i<cardsInPlay.length;i++){
    var cardP = cardsInPlay[i];
    if (cardP.cname === "Province")
      if (cardP.qty === 0)
        gameOver = true;
    if (cardP.qty === 0){
      empty++;
    }
    if (empty >= 3)
      gameOver = true;
  }

  if (gameOver)
    endGame();
}
/* end validations */

/* internal */
/* discover card */
function discoverCard(title){
  var card = {};
  for (i=0;i<cardListAll.length;i++){
    card = cardListAll[i];
    if (card.cname === title)
      break;
    card = {};
  }  
  return card;
}
/* end game */
function endGame(){
  var vp=calculateVPs();
  $(".new-game").show();
  $(".end-turn").hide();
  alert("The game is over.  You had " + vp + " points!");
}
/* calculate VPs */
function calculateVPs(){
  var vp=0;
  for(var i=0;i<playerCards.length;i++){
    if (playerCards[i].type === "Victory"){
      if (playerCards[i].cname !== "Gardens"){
        vp += playerCards[i].vp;
      }
      if (playerCards[i].cname === "Gardens"){
        //TODO fix this to round down
        vp += (1 * playerCards.length/10);
      }
    }
  }
  return vp;
}
/* getters and setters */
function setItem(s,n,q){
  q ? $(s).html(parseInt($(s).html()) + q) : $(s).html(n);
}
function getItem(s){
  return parseInt($(s).html());
}
function setActions(n,q,s){
  s = s ? s : cn.pA;
  setItem(s,n,q);
}
function getActions(s){
  s = s ? s : cn.pA;
  return getItem(s);
}
function setBuys(n,q,s){
  s = s ? s : cn.pB;
  setItem(s,n,q);
}
function getBuys(s){
  s = s ? s : cn.pB;
  return getItem(s);
}
function setMoney(n,q,s){
  s = s ? s : cn.pM;
  setItem(s,n,q);
}
function getMoney(s){
  s = s ? s : cn.pM;
  return getItem(s);
}
function getCost($j){
  return parseInt($j.siblings(".card-cost").html());
}
function getCard($j){
  return $j.siblings(".card-title").html();
}
function getQty($j){
  return $j.siblings(".card-qty").html();
}
function setQty($j,n){
  return $j.siblings(".card-qty").html(n);
}
/* end internal */


//load up stats
function setupCards(selector){
  $(selector).each(function(){
    var $this = $(this), card = discoverCard($this.html()),msg="",
      $parents = $this.parents(".card,.card-buy"),
      actions = getActions();
    if (card.type === cn.V)
      msg += "+"+card.vp+" VP\<br \/\>";
    if (card.money > 0)
      msg += "+"+card.money+" money\<br \/\>";
    if (card.action > 0)
      msg += "+"+card.action+" actions\<br \/\>";
    if (card.buys > 0)
      msg += "+"+card.buys+" buys\<br \/\>";
    if (card.cards > 0)
      msg += "+"+card.cards+" cards";
    $parents.find(".card-stats").html(msg);
    $parents.find(".card-type").val(card.type);
    $parents.find(".card-qty").html(card.qty);
    $parents.find(".card-cost").html(card.cost);
    if (card.type.match(/Victory|Curse|Treasure/gi) || actions <= 0){
      $parents.find(".card-play").hide();
    }
    if (card.type === cn.V){
      $this.addClass(cn.cVP);
    }
    if (card.type === cn.C){
      $this.addClass(cn.cC);
    }
    if (card.type === cn.T){
      $this.addClass(cn.cM);
    }
    if (card.type === cn.AR){
      $this.addClass(cn.cR);
    }
  });
}


/* Deck Functions */
/* Shuffle deck */
function shuffleDeck(){
  var newDeck = [];
  deck = [];
  discard = [];
  rebuildDeck();
  removeHandCardsFromDeck();
  randomizeDeck();
  
  function rebuildDeck(){
    for(var i=0;i<playerCards.length;i++){
      var card = playerCards[i];
      deck.push(playerCards[i]);
    }
  }
  function removeHandCardsFromDeck(){
    for(var j=0;j<hand.length;j++){
      var cardH = hand[j];
      for(var i=0;i<deck.length;i++){
        if (cardH.cname === deck[i].cname){
          deck.splice(i,1);
          break;
        }
      }
    }  
  }
  function randomizeDeck(){
    while(deck.length>0){
      var rand = Math.floor(Math.random()*deck.length);
        card = deck.slice(rand,rand+1)[0];
      deck.splice(rand,1);
      newDeck.push(card);
    }
    deck = newDeck;
  }
}
/* adds X cards to hand from deck */
function dealDeck(x){
  var j = 0;
  while (j < x){
    if (deck.length > 0){
      var card = deck.pop();
      addCardToHand(card);

      if (card.type === cn.T)
        addCardStats(card);

      hand.push(card);
      j++;
    } else {
      shuffleDeck();
    }
  }
}
/* adds cards to hand (Display!) */
function addCardToHand(card){
  var $card = $("#hidden-cards .player-card").clone(true);
  $card.appendTo($("#player-cards"));
  $card.find(".card-title").html(card.cname);
}
/* discards whole hand to discard[] */
function discardHand(){
  for(var i=0;i<hand.length;i++){
    discard.push(hand[i]);
  }
  hand = [];
  $("#player-cards li").remove();
}
/* end Deck functions */

/* Initial State Functions */
/* This is just 10 random cards to buy
 * I'd like to make this selected w/lots of choices... */
function initCardsInPlay(){
  $("#buy-cards .cards-to-buy li").remove();
  while(cardsInPlay.length < 10){
    var rand = Math.floor(Math.random()*cardList.length), 
      card = cardList[rand], inPlay = false;

    for (j=0;j<cardsInPlay.length;j++){
      var cardP = cardsInPlay[j];
      if (card.cname === cardP.cname)
        inPlay = true;
    }

    if (!inPlay){
      if (card.cname === "Witch")
        addCurse = true;
      card.qty = 10;
      cardsInPlay.push(card);
      var $cb = $("#hidden-cards .card-buy").clone(true);
      $("#buy-cards .cards-to-buy").append($cb);
      $cb.find('.card-title').html(card.cname);
    }
  }
  initTreasureVPCards();
}
/* add the Treasure and VP Cards */
function initTreasureVPCards(){
  $("#buy-cards .vp-cards li,#buy-cards .money-cards li").remove();
  for(var i=0;i<cardListTreasure.length;i++){
    var card = cardListTreasure[i],
      $cb = $("#hidden-cards .card-buy").clone(true);
      $("#buy-cards .money-cards").append($cb);
      $cb.find(".card-title").html(card.cname);
      card.qty = 20;
      cardsInPlay.push(card);
  }
  for(var i=0;i<cardListVP.length;i++){
    var card = cardListVP[i],
      $cb = $("#hidden-cards .card-buy").clone(true);
      if ((card.cname !== cn.C) || (card.cname === cn.C && addCurse)){
        $("#buy-cards .vp-cards").append($cb);
        $cb.find(".card-title").html(card.cname);
        card.qty = 8;
        cardsInPlay.push(card);
      }
  }
}
/* initial deck by loading 7 copper and 3 estates */
/*   also add them to playerCards */
function initDeck(){
  $("#player-cards li").remove();
  for(var i=0;i<7;i++){
    deck.push(cardListTreasure[0]);
    playerCards.push(cardListTreasure[0]);
  }
  for(var i=0;i<3;i++){
    deck.push(cardListVP[0]);
    playerCards.push(cardListVP[0]);
  }
}
/* End Initial State functions */

/* Debug Functions */
/* show pile for debug purposes */
$(".show-pile").click(function(){
  showPile($(this).html());
 
  function showPile(stack){
    var cardz = [];
    if (stack === "Deck"){
      for(var i=0;i<deck.length;i++){
        cardz.push(deck[i].cname);
      }
    } else if (stack === "Discard"){
      for(var i=0;i<discard.length;i++){
        cardz.push(discard[i].cname);
      }
    } else if (stack === "Player Cards"){
      for(var i=0;i<playerCards.length;i++){
        cardz.push(playerCards[i].cname);
      }
    }
    alert(cardz.join(", \n"));
  }
  return false;
});

function newGame(){
  phase="action";
  addCurse=false;
  cardsInPlay=[];
  deck=[];
  discard=[];
  playerCards=[];
  hand=[];
  turn=1;
  initCardsInPlay();
  initDeck();
  shuffleDeck();
  resetPlayerArea();
  dealDeck(5);
  var played = "<li>What to do?</li>";
  $("#events-area .play-card").html(played);
  setupCards("#player-cards .card-title,#buy-cards .card-title");
  depositMoney();
  $(".new-game").hide();
  $(".end-turn").show();
}
$(".end-turn").hide();
});
