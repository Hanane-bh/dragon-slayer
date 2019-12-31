'use strict';   // Mode strict du JavaScript

/*************************************************************************************************/
/* **************************************** DONNEES JEU **************************************** */
/*************************************************************************************************/

// La variable générale du jeu
var game = new Object();
game.dragon = new Object();
game.player = new Object();

// Constantes pour identifier le joueur et le dragon
const DRAGON = "dragon";
const PLAYER ="player";


const EASY = 1;
const NORMAL = 2;
const HARD = 3;


/**************************************************************************************************
 * ***************************** FONCTIONS D'AFFICHAGE DU JEU ************************************
 *************************************************************************************************/
 

 /*****************************************
  * Affiche le message: le combat commence
  * 
  *********************************/
 function showStart(){
    document.write('<li class="title">Que le combat commence !!</li>');
 }


 /********************************
  * Affiche le message: game over
  * 
  *********************************/
 function showGameOver(){

    if(game.HPPlayer<1){
        document.write('<li class="game-end">'+'<p class="title">Fin de la partie</p>'
        +'<p>Vous avez perdu le combat, le dragon vous a carbonisé !</p>'
        +'<img src="images/dragon-winner.png" alt="Dragon">'+'</li>');
    }


    if(game.HPDragon <1){
        document.write('<li class="game-end">'+'<p class="title">Fin de la partie</p>'
        +'<p>Vous avez gagné le combat, vous avez carbonisé le dragon !</p>'
        +'<img src="images/knight-winner.png" alt="Knight">'+'</li>');
    }
    
 }


 /********************************
  * Affiche l'état des deux joueurs
  * 
  *********************************/
 function showHPs(){
    document.write('<li class="game-state">'+'<figure>'+'<img src="images/knight-wounded.png" alt="Chevalier">'
    +'<figcaption>'+game.HPPlayer+' PV</figcaption>'+'</figure>'+'<figure>'+'<img src="images/dragon-wounded.png" alt="Dragon">'
    +'<figcaption>'+game.HPDragon+' PV</figcaption>'+'</figure>'+'</li>');
 }

 /********************************
  * Affiche l'attaque du joueur
  * 
  *********************************/
 function showPlayerAttack(damages){
    document.write('<li class="round-log player-attacks">'+
    '<h2 class="subtitle">Tour n° '+game.turn+'</h2>'+
    '<img src="images/knight-winner.png" alt="Chevalier">'+
    '<p>Vous êtes le plus rapide, vous attaquez le dragon et lui infligez '+damages+' de dommage !</p>'+'</li>');
 }


 /********************************
  * Affiche l'attaque du dragon
  * 
  *********************************/
 function showDragonAttack(damages){
    document.write('<li class="round-log dragon-attacks">'+'<h2 class="subtitle">Tour n° '+game.turn+'</h2>'+
    '<img src="images/dragon-winner.png" alt="Dragon">'+
    "<p>Le dragon prend l'initiative, vous attaque et vous inflige "+damages+" de dommage !</p>"+'</li>');
 }

/*************************************************************************************************/
/* *************************************** FONCTIONS JEU *************************************** */
/*************************************************************************************************/


 /********************************
  * Fonction de lancé de dés
  * 
  *********************************/
function nDx (n,x){
   var res = 0;

   //Fonction random dans utilities.js

   for(let i=0; i<n; i++){
      res += random(1, x);
   }

   return res;
}




 /********************************
  * Initialise la partie
  * 
  *********************************/

game.init = function(){

   //Demande à l'utilisateur le niveau de difficulté
   var difficulty = askForInt("Veuillez saisir une difficulté (1 = facile - 2 = moyen - 3 = difficile");

   switch (difficulty) {
      case 1:
         game.difficulty = EASY;
         break;

      case 2:
         game.difficulty = NORMAL;
         break;

      default:
         game.difficulty = HARD;
         break;
   }


   //Calcul le bonus aux PVs
   var bonusPlayer = nDx(10,10);
   var bonusDragon = nDx(10,10);

   //En facile le dragon a moins de PVs
   if ( game.difficulty==EASY)
      bonusDragon = nDx(5,10);
   
   // En difficile le joueur a moins de PVs
   if ( game.difficulty==HARD)
      bonusPlayer = nDx(7,10);

   //Initialise les PVs du joueur et du dragon
    game.HPPlayer = 100 + bonusPlayer;
    game.HPDragon = 100 + bonusDragon;

    // Initialise le tour de jeu
    game.turn=1;

     
}


 /********************************
  * Boucle principale du jeu
  * 
  *********************************/
game.loop =function (){

   //TANT QU'ON N'EST PAS GAMEOVER: ON JOUE
   while (!gameOver()){

      // Qui attaque?
      if(game.getAttaquer() == DRAGON)
      game.dragon.attack();
      else
      game.player.attack();

      //Affiche les PVs de chacun des joueurs
      showHPs();

      // Passe au tour suivant
      game.turn++;
   }

}

/****************************
 * La mécanique lorsque le joueur attaque
 * 
 ***************************/
game.player.attack = function (){
   //Calcul le bonus / malus au dégats
   var bonus = 0;

   if(game.difficulty==EASY)
      bonus = nDx(2,6);

   if(game.difficulty==HARD)
      bonus=-nDx(1,6);

   // Calcul des dommages infligés
   var damages = nDx(3,6);
   damages += (damages*bonus/100);
   damages = Math.floor(damages);

   // Inflige les dommages au dragon
   game.HPDragon -= damages;
   if (game.HPDragon<0)
      game.HPDragon = 0;

   // Affiche l'attaque du joueur sur le dragon
   showPlayerAttack(damages)
}

/****************************
 * La mécanique lorsque le dragon attaque
 * 
 ***************************/
game.dragon.attack = function(){

   // Calcul le bonus / malus au dégats
   var bonus = 0;
   if (game.difficulty == EASY)
      bonus = nDx(2,6);
   if (game.difficulty == HARD)
      bonus = -nDx(1,6);
   
   // Calcul des dommages infligés
   var damages = nDx(3,6);
   damages += damages * bonus/100;
   damages = Math.floor(damages);

   // Inflige les dommages au player
   game.HPPlayer -= damages;
   if (game.HPPlayer<0)
   game.HPPlayer = 0;

   // Affiche l'attaque du dragon sur le joueur
   showDragonAttack(damages)
}

 /********************************
  * Oui (true) si game over
  * Non (false) si pas game over
  *********************************/
function gameOver(){

   // on est game over si les PVs du joueur ou du dragon atteignent 0
   return (game.HPPlayer < 1 || game.HPDragon < 1);
}



/********************************
  * Nous dit qui est l'attaquant
  * Retourne:
  * DRAGON si le dragon attaque
  * PLAYER si le joeur attaque
  *********************************/
game.getAttaquer = function(){

   do {
      // Je demande les scores du joueur  et du dragon
      var scorePlayer = nDx(10, 6);
      var scoreDragon = nDx(10, 6);

      // Tant qu'ils sont égaux, on recommence
   } while (scorePlayer == scoreDragon);

   // Si le joueur a le meilleur score,
   //Il attaque
   if (scorePlayer > scoreDragon)
      return PLAYER;

   //Sinon, c'est le dragon qui attaque
   return DRAGON;
}

game.run = function()
{
   game.init();
   showStart();
   game.loop();
   showGameOver();
}

/*************************************************************************************************/
/* ************************************** CODE PRINCIPAL *************************************** */
/*************************************************************************************************/

game.run();