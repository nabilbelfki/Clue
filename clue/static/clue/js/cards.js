var myCards = {};
var isChoosingCard = false;
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
            $(this).stop().animate({ bottom: "-150px" }, 300); // Slide down
        }
    );

    $("#cards img").click(function(event) {
        if (isChoosingCard) {
            $("#cards img").removeClass("card-selected");
            $(this).addClass("card-selected");
        }
    });


    $("#show-card").click(function(event) {
        let card;
        $("#cards img").each(function(event) {
            if ($(this).hasClass("card-selected")) {
                card = $(this).attr("id").replace("-card","");
            }
        })
        if (card) showSuggestedCard(card);
        else alert("Please select a card");
    });
    
});

function showMyCards() {
    console.log(myCards);
    myCards.forEach(function(card) {
        let slug = card["Slug"];
        $("#"+slug+"-card").show();
        markDetectiveNotes(slug, colors[chosenPlayer]);
    })
}

function showSuggestedCard(card) {
    $.ajax({
        url: "/cards/show/",
        type: "POST",
        data: {
          csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
          card: card
        },
        success: function (response) {
            $(".card-selected").removeClass("card-selected");
            if (response.Status) {
                console.log(response);
            } else {
                alert(response.Reason)
            }
        },
        error: function (xhr, status, error) {
          console.error("Error generating code and creating game:", error);
        },
      });
}

function showSuggestedCardPopup(card, suggestedID, showerID) {
    let showerColor;
    let suggestedColor;
    let suggestedName;
    let showerName;
    playersOfLobby.forEach(function(player) {
        if (player.id  == suggestedID) {
            suggestedName = player.name;
            suggestedColor = colors[player.character];
        }
        if (player.id  == showerID) {
            showerName = player.name;
            showerColor = colors[player.character];
        }
    });
    $("#no-show").hide();
    $("#card-shown img").hide();
    $("#shown-card").css("background-color", showerColor);
    if (showerColor == "#FFFFFF") {
        $("#shown-title").css("color","#474747");
        $("#close-shown").css("color", "#FFFFFF");
        $("#close-shown").css("background-color", "#474747");
    } else {
        $("#shown-title").css("color","#FFFFFF");
        $("#close-shown").css("color", showerColor);
        $("#close-shown").css("background-color", "#FFFFFF");
    }
    let title = showerName+ " SHOWED " + suggestedName;
    if (myPlayerID == suggestedID) {
        title = showerName + " SHOWED YOU";
        $(`#${card}-shown-card`).show();
        markDetectiveNotes(card , showerColor);
    } else if (myPlayerID == showerID) {
        title = "YOU SHOWED " + suggestedName;
        $(`#${card}-shown-card`).show();
        $("#shown-card").css("background-color", suggestedColor);
        if (suggestedColor == "#FFFFFF") {
            $("#shown-title").css("color","#474747");
            $("#close-shown").css("color", "#FFFFFF");
            $("#close-shown").css("background-color", "#474747");
        } else {
            $("#shown-title").css("color","#FFFFFF");
            $("#close-shown").css("color", suggestedColor);
            $("#close-shown").css("background-color", "#FFFFFF");
        }
    } else {
        $("#no-show").show();
    }

    $("#shown-title").text(title);
    $('#suggested').fadeOut(function(event) {
        $('#shown-card').css("display", "flex");
        $('#shown-card').fadeIn();
        changeTurn();
    });
}