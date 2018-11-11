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
        // var msg3 = 'Your health is: ' + Math.max(playerStr[attacker].healthPoints,0) + " ."
        // var msg4 = playerStr[defender].name + "'s health is: " + Math.max(playerStr[defender].healthPoints, 0) + " .";
        msgFnl = msg1 + '<br />' + msg2;
    },

    printMsg: function(type) {
        
        if (type === "player") {
            message = "Choose your player.";
        } else if (type === "opponent"){
            message = "Choose your opponent.";
        } else if (type === "battle") {
            message = "Battle!";
        } else if (type === "stats") {
            message = this.printStats.msgFnl;
        } else if (type === "win") {
            message = "You win the game!";
        } else if (type === "matchWin") {
            message = "You win the match. Choose your next opponent.";
        } else if (type === "lose") {
            message = "You lose! " + playerInfo.playerStats[opponent].name + " wins." 
        }
        $( ".statsArea" ).html( message );
    },

    resetUI: function() {
        $( "#0" ).detach().appendTo( "#characters" );
        $( "#1" ).detach().appendTo( "#characters" );
        $( "#2" ).detach().appendTo( "#characters" );
        $( "#3" ).detach().appendTo( "#characters" );
        this.printMsg("player");
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
            uiController.printMsg("opponent");
        } else if (opponent === "") {
            opponent = id;
            playRole = "opponent";
            divRole = '#' + playRole;
            playerInfo.changeRole(id, playRole);
            uiController.movePlayer(divID, divRole);
            uiController.printMsg("battle");
        } else {
            alert("You've already selected your players.")
        }

    },

    matchWin: function() {
        playerInfo.changeRole(opponent, "defeated");
        uiController.movePlayer( "#"+opponent, "#defeated");
        opponent="";
        uiController.printMsg("matchWin");
    },

    gameWin: function() {
        gameStatus = "won";
        playerInfo.changeRole(player, "won");
        uiController.printMsg( "win" );
        uiController.movePlayer("#"+opponent,"#defeated");    
    },

    gameLose: function() {
        gameStatus = "lose";
        playerInfo.changeRole(player, "defeated");
        uiController.movePlayer("#"+player,"#defeated");
        uiController.printMsg("lose");
    },

    gamePlay: function() {        
        playerInfo.calcPoints(playerInfo.playerStats[player], playerInfo.playerStats[opponent]);
        uiController.printStats(player, opponent);
        //lose game
        if (playerInfo.playerStats[player].healthPoints <= 0) {
            this.gameLose();
        //win match
        } else if (playerInfo.playerStats[opponent].healthPoints <= 0) {
            winCounter++;
            //check for game win
            if (winCounter === 3) {
                this.gameWin();
            } else {
                this.matchWin();
            }               
        }
    },

    newGame: function() {
        //players and messge reset in UI, player stats reset, status and wins reset
        uiController.resetUI();
        playerInfo.init();
        gameStatus = "active";
        winCounter = 0;
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