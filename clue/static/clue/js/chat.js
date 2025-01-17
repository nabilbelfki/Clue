$(document).ready(function() {
    $("#collapse-chat").click(function() {
        if (music) $("#pop-sound")[0].play();
        collapseChat();
    });

    $("#expand-chat").click(function() {
        if (music) $("#pop-sound")[0].play();
        expandChat();
    });

    // Listen for the "Enter" key press in the #type textarea
    $('#type').on('keydown', function(event) {
        // Check if the "Enter" key was pressed (key code 13)
        if (event.keyCode === 13) {
            // Prevent the default behavior (new line in the textarea)
            event.preventDefault();

            // Store the textarea value in the chatMessage variable
            let message = $(this).val();

            // Optionally, you can log the message or do something with it
            console.log("Stored message:", message);

            chat(message);

            // Clear the textarea after storing the message
            $(this).val('');
        }
    });
})

function expandChat() {
    // slide to the right until the width is only 30px
    $("#chat").animate({ width: "300px" }, 300);
    $("#messages, #type").fadeIn();
    $("#collapse-chat").show();
    $("#expand-chat").hide();
    $("#new-notification-indicator").hide();
}

function collapseChat() {
    $("#messages, #type").fadeOut();
    // slide to the right until the width is only 30px
    $("#chat").animate({ width: "30px" }, 300);
    $("#collapse-chat").hide();
    $("#expand-chat").show();
}

function chat(message) {
    $.ajax({
        url: "/message/",
        type: "POST",
        data: {
          csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
          message: message,
        },
        success: function (response) {
          console.log(response);
        },
        error: function (xhr, status, error) {
          console.error("Error generating code and creating game:", error);
        },
      });
}

function appendMessage(PlayerID, message) {

    var currentTime = new Date();
    var hours = currentTime.getHours().toString().padStart(2, '0');
    var minutes = currentTime.getMinutes().toString().padStart(2, '0');

    let timestamp = `${hours}:${minutes}`;
    let hasTimeStamp = false;
    $(".simple").each(function(){
        if ($(this).text().trim() == timestamp) hasTimeStamp = true;
    })
    let slug;
    playersOfLobby.forEach(function(player) {
        if (PlayerID == player.id) slug = player.character;
    });

    let color = slug == "mrs-white" ? "#474747" : colors[slug];
    let styles = `background-color:${color};`
    if (PlayerID == myPlayerID) styles += "align-self:flex-end; border-radius: 10px 10px 0 10px;"
    else styles += "align-self:flex-start; border-radius: 10px 10px 10px 0;"
    if (!hasTimeStamp) 
    $("#messages").append("<div class='simple'>" + timestamp + "</div>");
    $("#messages").append(`<div class="message" style="${styles}">${message}</div>`);
    if (music) $("#message-sound")[0].play();
    if ($("#expand-chat").is(":visible")) $("#new-notification-indicator").show();
}

function appendSuggestionNotification(playerName) {
    var currentTime = new Date();
    var hours = currentTime.getHours().toString().padStart(2, '0');
    var minutes = currentTime.getMinutes().toString().padStart(2, '0');

    let timestamp = `${hours}:${minutes}`;
    $("#messages").append("<div class='simple'>" + playerName + " SUGGESTED AT " + timestamp + "</div>");
    if ($("#expand-chat").is(":visible")) $("#new-notification-indicator").show();
}