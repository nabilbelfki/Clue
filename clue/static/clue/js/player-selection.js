$(document).ready(function(event) {
    $("#choose-player-button").click(function(event) {
        if (myTurnToSelectPlayer) {
            $("#choose-player-button").hide();
            let playerChosen;
            let isPlayerChosen = false;
            $(".choose-player").each(function(event) {
                if ($(this).hasClass("my-chosen-player")) {
                    isPlayerChosen = true;
                    playerChosen = $(this).attr("id").replace("choose-", "");
                    return false; // Exit the loop
                }
            });
            
            if (isPlayerChosen) {
                choosePlayer(playerChosen);
                // showMyCards();
                // $("#player-selection").hide();
                // $("#boardgame").css("display", "flex");
        
            } else {
                // Handle the case where no player is chosen
                alert("Please choose a player.");
                $("#choose-player-button").css("display", "flex");
            }
        }
    });
    
    $(".choose-player").click(function (event) {
        if (myTurnToSelectPlayer) {
            if (!$(this).hasClass("player-already-taken")) {
                if ($(this).hasClass("my-chosen-player")) {
                $(".choose-player").removeClass("my-chosen-player");
                } else {
                $(".choose-player").removeClass("my-chosen-player");
                $(this).addClass("my-chosen-player");
                }
            }
        }
    });

    $(".choose-player").hover(
        function (event) {
            let slug = $(this).attr("id").replace("choose-", "");

            let text = "CHOOSE " + characters[slug].toUpperCase();
            if ($(this).hasClass("player-already-taken")) {
            let player = $(this).data("player");
            text = player + " HAS CHOSEN " + characters[slug].toUpperCase();
            }
            let color = slug == "mrs-white" ? "#474747" : "#FFFFFF";
            var tooltip = $(
            '<div class="tooltip" style="background-color:' +
                colors[slug] +
                "; color:" +
                color +
                '">' +
                text +
                "</div>"
            );
            $("body").append(tooltip);
            tooltip
            .css({
                top: event.pageY - tooltip.outerHeight() - 10,
                left: event.pageX + 10,
            })
            .fadeIn("fast");
        },
        function () {
            $(".tooltip").remove();
        }
    );


    $(".choose-player").mousemove(function (event) {
    $(".tooltip").css({
        top: event.pageY - $(".tooltip").outerHeight() - 10,
        left: event.pageX + 10,
    });
    });
})

function choosePlayer(player) {
    $.ajax({
        url: '/player/choose/',
        type: 'POST',
        data: {
            csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
            slug: player
        },
        success: function(response) {
            console.log(response);
            if (response.Status) {
                chosenPlayer = player;
                showMyCards();
                showSelectedPlayer(myPlayerID, myPlayerName, player)
                $(".my-chosen-player").removeClass("my-chosen-player");
            } else {
                alert("Player Already Taken");
                $("#choose-player-button").css("display","flex");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error generating code and creating game:", error);
        }
    });
}

function showSelectedPlayer(playerID, name, slug) {
    playersOfLobby.forEach(function(player) {
        if (player.id == playerID) {
            player['character'] = slug
        }
    });

    $(".choose-player").each(function(event) {
        let character = $(this).attr("id").replace("choose-", "");
        if (slug == character) {
            $(this).attr("data-player", name);
            $(this).addClass("player-already-taken");
        }
    });
}