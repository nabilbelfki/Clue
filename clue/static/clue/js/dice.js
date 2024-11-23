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
        if ($(this).hasClass("rollable")) {
            $(this).removeClass("rollable");
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
                     $("#rolling-area").css("display", "flex").hide().fadeIn(function(){
                         rollDice(); 
                    }); 
                }); 
            });
        }
    });
});

function rollDice() { 
    function roll() { 
        // Hide previous dice faces 
        $("#dice-1 ." + firstDie + "-die").hide(); 
        $("#dice-2 ." + secondDie + "-die").hide(); 
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
        moves = parseInt(diceValues[firstDie]) + parseInt(diceValues[secondDie]);
        $("#moves").text(moves);
        $("#dice-text").text("MOVES");
        // Wait for 1 second before showing the moves 
        setTimeout(function() { 
            $("#rolling-area").fadeOut(function(event) {
                $("#moves").css("display", "flex"); 
                $("#dice-text").css("display", "flex"); 

                $("#dice-roll").removeClass("scale-center");
                $("#dice-roll").animate({ 
                    right: '-200px', 
                    bottom: 0
                }, 1000, function() { $("#dice-roll").removeClass("scale-center"); });
            }); 
        }, 3000); // 5000 milliseconds = 5 second
    }, Math.random() * 2000 + 1000); // Random duration between 3000ms (3s) and 5000ms (5s) 
    // Initial call to roll function to start the process 
    roll();
}
