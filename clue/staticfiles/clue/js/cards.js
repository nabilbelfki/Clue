var myCards = {};
let cards = ["miss-scarlet", "mrs-white", "colonel-mustard", "mrs-peacock", "professor-plum", "mr-green", "wrench", "revolver", "lead-pipe", "candlestick", "rope", "knife", "ballroom", "hall", "conservatory", "kitchen", "billiard-room", "study", "library", "dining-room", "lounge"];

$(document).ready(function() {

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

function showMyCards() {
    console.log(myCards);
    myCards.forEach(function(card) {
        let slug = card["slug"];
        $("#"+slug+"-card").show();
        markDetectiveNotes(slug, colors[chosenPlayer]);
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