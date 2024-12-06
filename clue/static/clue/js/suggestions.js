$(document).ready(function(event) {
    $("#suspects-choice > div").click(function(event) {
        if ($(this).hasClass("suspect-selected")) {
            $(this).removeClass("suspect-selected");

        } else {
            $("#suspects-choice > div").removeClass("suspect-selected");
            $(this).addClass("suspect-selected");
        }
    });

    $("#weapons-choice > div").click(function(event) {

        if ($(this).hasClass("weapon-selected")) {
        
            $(this).removeClass("weapon-selected");
        } else {
            $("#weapons-choice > div").removeClass("weapon-selected");
            $(this).addClass("weapon-selected");
        }
    });

    $("#rooms-choice > div").click(function(event) {
        if ($("#suggest").attr("data-type") == "assumption") {
            if ($(this).hasClass("room-selected")) {
                $(this).removeClass("room-selected");
            } else {
                $("#rooms-choice > div").removeClass("room-selected");
                $(this).addClass("room-selected");
            }
        }
    });

    $("#suspect > .value").click(function(event) {
        changeSuggestionPage("suspects")
    });

    $("#weapon > .value").click(function(event) {
        changeSuggestionPage("weapons")
    });

    $("#room > .value").click(function(event) {
        changeSuggestionPage("rooms")
    });

    $("#choose").click(function(event){
        if (music) $("#pop-sound")[0].play();
        if ($("#suggest").attr("data-page") == "confirmation") {
            if ($("#suggest").attr("data-type") == "assumption") {
                makeAssumption();
            } else {
                makeSuggestion()
            }
            $("#suggest").fadeOut();
            // suggest("suggested");
            // $("#suggest").fadeOut(function(event) {
            //     $("#suggested").fadeIn();
            // })
        } else {
            select($("#suggest").attr("data-page"));
        }
    })

    $("#cancel").click(function(event){
        if (music) $("#pop-sound")[0].play();
        collapseDetectiveNotes()
        $("#suggest").hide();
    });

    $("#suggestion").click(function(event){
        if (chosenPlayer == rotation[turn] && rooms.hasOwnProperty(players[rotation[turn]])) {
            if (music) $("#pop-sound")[0].play();
            $("#selections").css("display", "flex");
            changeSuggestionPage("suspects")
            $("#confirmation-title").hide();
            $("#confirmation").hide();
            if (players[rotation[turn]] == "assumption") {
                $("#suggest").attr("data-type", "assumption");
            } else {
                $("#suggest").attr("data-type", "suggestion");
            }
            clearSuggestionPopup();
            expandDetectiveNotes();
            let room = players[rotation[turn]];
            $(`#rooms-choice > div`).each(function(event) {
                if ($(this).attr("id").replace("-choice","") == room) {
                    let selectedText = $(this).find(".choice-text").text();
                    $(`#room .value`).text(selectedText);
                    $(`#room`).attr("data-text", selectedText);
                    $(`#room`).attr("data-choice", room);
                    $(this).addClass("room-selected");
                }
            });
            $("#suggest").css("display", "flex");
        }
    });

    $("#secret-passage").click(function(event) {
        if (chosenPlayer == rotation[turn] && secretPassages.hasOwnProperty(players[rotation[turn]])) {
            if (moves == 0) {
                if ($("#dice-text").text() == "END TURN") {
                    alert("You don't have enough moves.");
                } else {
                    alert("Must roll first");
                }
            } else {
                if (music) $("#pop-sound")[0].play();
                movePlayer("SECRET");
            }
        }
    });
});

function changeSuggestionPage(page) {
    console.log(page)
    $("#suspects-choice").hide();
    $("#weapons-choice").hide(); 
    $("#rooms-choice").hide();
    $("#choices").css("display", "flex");
    $("#choose").text("CHOOSE");

    $("#suspect .value").removeClass("page-selected");
    $("#weapon .value").removeClass("page-selected");
    $("#room .value").removeClass("page-selected");

    $("#suggest").css("height", "");
    $("#suggest").css("width", "");

    if (page == "suspects") {
        $("#suspects-choice").css("display","grid");
        $("#suggest").attr("data-page", "suspect");
        $("#suspect .value").addClass("page-selected");
    }
    if (page == "weapons") {
        $("#weapons-choice").css("display","grid"); 
        $("#suggest").attr("data-page", "weapon");
        $("#weapon .value").addClass("page-selected");
    }
    if (page == "rooms") {
        $("#suggest").height("600px");
        // Custom Height and Width for Rooms
        // $("#choices").height("570px");
        // $("#choices").width("820px");

        $("#rooms-choice").css("display","grid");
        $("#suggest").attr("data-page", "room");
        $("#room .value").addClass("page-selected");
    }
    if (page == "confirmation") {
        $("#suggest").attr("data-page", "confirmation");
        $("#choose").text("CONFIRM");

        // Custom Height and Width for Rooms
        $("#choices, #selections").fadeOut(function(event) {

            $("#confirmation").css("display","flex");
            $("#confirmation, #confirmation-title").fadeIn();
        });
    }
}

function select(option) {
    const nextPage = {
        "suspect": "weapons",
        "weapon": "rooms",
        "room": "confirmation"
    }
    let selectedText = "";
    let selectedSlug = "";
    $(`#${option}s-choice > div`).each(function(event) {
        if ($(this).hasClass(`${option}-selected`)) {
            selectedText = $(this).find(".choice-text").text();
            selectedSlug = $(this).attr("id").replace("-choice","");
        }
    });
    if (selectedText != "") {
        $(`#${option} .value`).text(selectedText);
        $(`#${option}`).attr("data-text", selectedText);
        $(`#${option}`).attr("data-choice", selectedSlug);
        if (option == "room") suggest("chosen");
        changeSuggestionPage(nextPage[option]);
    } else {
        console.log(`${option[0].toUpperCase() + option.substring(1)} Not Selected`)
    }
}

function suggest(view) {
    let suspect = $("#suspect").attr("data-choice");
    let weapon = $("#weapon").attr("data-choice");
    let room = $("#room").attr("data-choice");
    let suspectText = $("#suspect").attr("data-text");
    let weaponText = $("#weapon").attr("data-text");
    let roomText = $("#room").attr("data-text");
    roomText = roomText == "CONSERVATORY" ? "CON- SERVATORY" : roomText
    $(`.${view}-value img`).hide();
    
    $(`#${suspect}-${view}`).show();
    $(`#${weapon}-${view}`).show();
    $(`#${room}-${view}`).show();

    $(`#suspect-${view} .${view}-text`).text(suspectText);
    $(`#weapon-${view} .${view}-text`).text(weaponText);
    $(`#room-${view} .${view}-text`).text(roomText);
}

function makeSuggestion() {
    $.ajax({
        url: '/suggest/',
        type: 'POST',
        data: {
            csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
            suspect: $("#suspect").attr("data-choice"),
            weapon: $("#weapon").attr("data-choice"),
            room: $("#room").attr("data-choice")
        },
        success: function(response) {
            console.log(response);
        },
        error: function(xhr, status, error) {
            console.error("Error generating code and creating game:", error);
        }
    });
}

function makeAssumption() {
    $.ajax({
        url: '/assume/',
        type: 'POST',
        data: {
            csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
            suspect: $("#suspect").attr("data-choice"),
            weapon: $("#weapon").attr("data-choice"),
            room: $("#room").attr("data-choice")
        },
        success: function(response) {
            console.log(response);
        },
        error: function(xhr, status, error) {
            console.error("Error generating code and creating game:", error);
        }
    });
}

function clearSuggestionPopup() {
    ["suspect", "weapon", "room"].forEach(function(option) {
        $(`#${option}s-choice > div`).removeClass(`${option}-selected`);
        $(`#${option} .value`).text("");
        $(`#${option}`).attr("data-text", "");
        $(`#${option}`).attr("data-choice", "");
    });
}