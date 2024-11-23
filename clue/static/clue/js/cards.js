const playerCards = {};
let cards = ["miss-scarlet", "mrs-white", "colonel-mustard", "mrs-peacock", "professor-plum", "mr-green", "wrench", "revolver", "lead-pipe", "candlestick", "rope", "knife", "ballroom", "hall", "conservatory", "kitchen", "billiard-room", "study", "library", "dining-room", "lounge"];

$(document).ready(function() {
    dealCards();

    $("#close-shown").click(function(event) {
        $("#shown-card").fadeOut();
    })

    $("#cards").hover(
        function() {
            // On mouse enter
            $(this).stop().animate({ bottom: "0" }, 300); // Slide up
        },
        function() {
            // On mouse leave
            $(this).stop().animate({ bottom: "-250px" }, 300); // Slide down
        }
    );
    
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function dealCards() {
    let currentPlayer = 0;
    // Shuffle the cards array
    shuffle(cards);

    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        if (!playerCards.hasOwnProperty(rotation[currentPlayer])) {
            playerCards[rotation[currentPlayer]] = [];
        }
        playerCards[rotation[currentPlayer]].push(card);
        if (currentPlayer == rotation.length - 1) {
            currentPlayer = 0;
        } else {
            currentPlayer++;
        }
    }
}

function showMyCards() {
    let myCards = playerCards[chosenPlayer];
    console.log(chosenPlayer);
    console.log(myCards);
    myCards.forEach(function(card) {
        $("#"+card+"-card").show();
        markDetectiveNotes(card, colors[chosenPlayer]);
    })
}

function showSuggestedCard(card, playerName, color) {
    $("#shown-title").text(playerName.toUpperCase() + " SHOWED YOU");
    $("#shown-card").css("background-color", "#"+color);
    $("#close-shown").css("color", "#"+color);
    $("#card-shown img").hide();
    console.log(`#${card}-shown-card`)
    $(`#${card}-shown-card`).show();
    $('#shown-card').css("display", "flex");
    $('#shown-card').fadeIn();
}