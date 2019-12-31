'use strict';   // Mode strict du JavaScript

/*************************************************************************************************/
/* *********************************** FONCTIONS UTILITAIRES *********************************** */
/*************************************************************************************************/

function random(min, max){
    return Math.floor(min + Math.random()*(max - min + 1));
}

function askForInt(message){

    var reponse = null;
    do{
        reponse = parseInt(window.prompt(message));
    }while (isNaN(reponse));

    return reponse;
}