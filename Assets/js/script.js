$(document).ready(function() {

var gameStatus = "active";
var winCounter = 0;
var player = "";
var opponent = "";
    

var playerInfo = {

    playerStats: [
        {
            name: "Kylo Ren",
            role: "waiting",
            origHealth: 110,
            counterAttack: 11,
            healthPoints: 110,
            attackPoints: 11,
        },
        {
            name: "Luke Skywalker",
            role: "waiting",
            origHealth: 100,
            counterAttack: 7,
            healthPoints: 100,
            attackPoints: 7,
        },
        {
            name: "Snoke",
            role: "waiting",
            origHealth: 135,
            counterAttack: 8,
            healthPoints: 135,
            attackPoints: 8,
        },
        {
            name: "Rey",
            role: "waiting",
            origHealth: 145,
            counterAttack: 10,
            healthPoints: 145,
            attackPoints: 10,
        },   
    ],
    
    calcPoints: function(attacker, defender) {
       attacker.healthPoints -= defender.counterAttack;       
       defender.healthPoints -= attacker.attackPoints;
       attacker.attackPoints += attacker.counterAttack;
    },

    changeRole: function(player, newRole) {
        this.playerStats[player].role = newRole;
    },

    init: function() {
     
        $.each(this.playerStats, resetPoints);
        
        function resetPoints(key, character) {
           character.healthPoints = character.origHealth;
           character.attackPoints = character.counterAttack;
           character.role = "waiting";
           player = "";
           opponent = "";
        };    
    },
    

};



var uiController = {

    movePlayer: function(id, playRole) {
        $( id ).detach().appendTo( playRole );
    },


    printStats: function(attacker, defender) {
        var playerStr = playerInfo.playerStats;
        var msg1 = "You attacked " + playerStr[defender].name + " for " + playerStr[attacker].attackPoints + " damage.";
        var msg2 = playerStr[defender].name + " attacked you" + " for " + playerStr[defender].counterAttack + " damage.";
        var msg3 = 'Your health is: ' + Math.max(playerStr[attacker].healthPoints,0) + " ."
        var msg4 = playerStr[defender].name + "'s health is: " + Math.max(playerStr[defender].healthPoints, 0) + " .";
        $( ".statsArea" ).html( msg1 + '<br />' + msg2 + '<br />' + msg3 + '<br />' + msg4);
    },

    printMsg: function(message) {
        $( ".statsArea" ).html( message );
    },

    resetUI: function() {
        $( "#0" ).detach().appendTo( "#characters" );
        $( "#1" ).detach().appendTo( "#characters" );
        $( "#2" ).detach().appendTo( "#characters" );
        $( "#3" ).detach().appendTo( "#characters" );
        $( ".statsArea" ).html( "Choose your player." );
    },

};


var gameController = {

    selectPlayers: function(id) {
        var playRole;
        var divID = '#' + id;
        var divRole; 
        if (player === "") {
            player = id;
            playRole = "player";
            divRole = '#' + playRole;
            playerInfo.changeRole(id, playRole);
            uiController.movePlayer(divID, divRole);
            uiController.printMsg( "Choose your opponent.")
        } else if (opponent === "") {
            opponent = id;
            playRole = "opponent";
            divRole = '#' + playRole;
            playerInfo.changeRole(id, playRole);
            uiController.movePlayer(divID, divRole);
            uiController.printMsg( "Battle!")
        } else {
            alert("You've already selected your players.")
        }

    },

    matchWin: function() {
        playerInfo.changeRole(opponent, "defeated");
        uiController.movePlayer( "#"+opponent, "#defeated");
        opponent="";
        uiController.printMsg( "You win the match. Choose your next opponent." );
    },

    gameWin: function() {
        gameStatus = "won";
        playerInfo.changeRole(player, "won");
        uiController.printMsg( "You win the game!" );
        //battle button is made inactive
    },

    gameLose: function() {
        gameStatus = "lose";
        playerInfo.changeRole(player, "lost");
        console.log("You Lose");
        uiController.printMsg( "You lose!" );
        //battle button is made inactive

    },

    gamePlay: function() {
        uiController.printStats(player, opponent);
        playerInfo.calcPoints(playerInfo.playerStats[player], playerInfo.playerStats[opponent]);
        
        //lose game
        if (playerInfo.playerStats[player].healthPoints <= 0) {
            this.gameLose();
        //win match
        } else if (playerInfo.playerStats[opponent].healthPoints <= 0) {
            winCounter++;
            //check for game win
            if (winCounter === 3) {
                gameController.gameWin();
            } else {
                gameController.matchWin();
            }               
        }
    },

    newGame: function() {
        uiController.resetUI();
        playerInfo.init();
        gameStatus = "active";
        winCounter = 0;
        //all characters move to selector area
    }
};

//Choose players
$( ".playerCard" ).on("click", function(event) {
    var id = $( this ).attr("id");    
    gameController.selectPlayers(id);
    console.log(playerInfo.playerStats);
});
   
//battle
$( "#battleBtn" ).on("click", function() {
    if (gameStatus === "active") {
        gameController.gamePlay();
    }
});

//new game
$( "#newGame" ).on("click", function() {
    gameController.newGame();
});


});