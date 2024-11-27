let firstDie = "six";
let secondDie = "four";
let originalLeft, originalTop;
const diceOne = [ "one", "two", "three", "four", "five", "six" ]; 
const diceTwo = [ "one", "two", "three", "four", "five", "six" ]; 
const diceValues = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
}
$(document).ready(function() {
    const $diceRoll = $("#dice-roll");
    originalLeft = $diceRoll.position().left; originalTop = $diceRoll.position().top;

    $diceRoll.click(function(event) {
        if (chosenPlayer == rotation[turn]) { 
            if ($(this).hasClass("rollable")) {
                $("#dice-roll").css("cursor", "default");
                $(this).removeClass("rollable");
                getDiceRoll()
            }
        }
    });
});

function rollDice(playerID, Dice) { 
    function roll() { 
        // Hide previous dice faces 
        $("#dice-1 > div").hide(); 
        $("#dice-2 > div").hide(); 
        // Randomly select new dice faces 
        firstDie = diceOne[Math.floor(Math.random() * diceOne.length)]; 
        secondDie = diceTwo[Math.floor(Math.random() * diceTwo.length)];

        // Show new dice faces 
        $("#dice-1 ." + firstDie + "-die").show();
        $("#dice-2 ." + secondDie + "-die").show(); 
    } 
   // Call roll function multiple times within 3-5 seconds 
   const interval = setInterval(roll, 100); // Roll every 100 milliseconds 
   // Stop rolling after 3-5 seconds 
   setTimeout(function() { 
    clearInterval(interval);
        $("#dice-1 > div").hide(); 
        $("#dice-2 > div").hide(); 
        console.log(Dice["First"]);
        console.log(Dice["Second"]);
        
        $("#dice-1 ." + diceOne[Dice["First"] - 1] + "-die").show();
        $("#dice-2 ." + diceTwo[Dice["Second"] - 1] + "-die").show();

        moves = parseInt(Dice["First"]) + parseInt(Dice["Second"]);
        $("#moves").text(moves);
        $("#dice-text").text("MOVES");
        // Wait for 1 second before showing the moves 
        setTimeout(function() { 
            $("#rolling-area").fadeOut(function(event) {
                if (chosenPlayer != rotation[turn]) {
                    $("#dice-roll div, #dice-roll p").css("opacity", "0.6");  
                }
                $("#moves").css("display", "flex"); 
                $("#dice-text").css("display", "flex"); 

                $("#dice-roll").removeClass("scale-center");
                $("#dice-roll").animate({ 
                    right: '50px', 
                    bottom: '60px'
                }, 1000, function() { $("#dice-roll").removeClass("scale-center"); });
            }); 
        }, 3000); // 5000 milliseconds = 5 second
    }, Math.random() * 2000 + 1000); // Random duration between 3000ms (3s) and 5000ms (5s) 
    // Initial call to roll function to start the process 
    roll();
}

function getDiceRoll() {
    $.ajax({
        url: '/roll/',
        type: 'POST',
        data: {
            csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
        },
        success: function(response) {
            console.log(response.Status);
            if (!response.Status) alert('Not your turn to roll');
        },
        error: function(xhr, status, error) {
            console.error("Error generating code and creating game:", error);
        }
    });
}

function showDiceRoll(playerID, Dice) {
    const $diceRoll = $("#dice-roll");
    var parentWidth = $diceRoll.parent().width(); 
    var parentHeight = $diceRoll.parent().height(); 
    var centerX = (parentWidth - $diceRoll.width()) / 2; 
    var centerY = (parentHeight - $diceRoll.height()) / 2; 
    $diceRoll.addClass("scale-center");
    $diceRoll.animate({
        right: centerX + 'px',
        bottom: centerY + 'px', 
    }, 1000, function() { 
        $("#six-cube, #four-cube, #dice-text").fadeOut(function() {
            if (chosenPlayer != rotation[turn]) {
                $("#dice-roll div, #dice-roll p").css("opacity", "1");  
            }
            $("#rolling-area").css("display", "flex").hide().fadeIn(function(){
                rollDice(playerID, Dice); 
            }); 
        }); 
    });
}