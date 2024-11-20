
$(document).ready(function () {
  $("input").on("input", function() { this.value = this.value.toUpperCase(); });
  $("#code-input > input").on("input", function () {
      var inputVal = $(this).val().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
      $(this).val(inputVal);

      if (inputVal) {
          $("#action-button-inner").text("JOIN GAME");
          $("#action-button").data("action", "join");
      } else {
          $("#action-button-inner").text("CREATE GAME");
          $("#action-button").data("action", "create");
      }
  });

  $(".edit").click(function(event) {
    const $player = $(this).parent();
    $player.find("input").attr("readonly", false);
    $player.find("input").focus();
    $player.find(".save").css("display", "flex");
    $(this).hide();
  });

  $(".save").click(function(event) {
    const $player = $(this).parent();
    $player.find("input").attr("readonly", true);
    $player.find(".edit").css("display", "flex");
    $(this).hide();
  });

  $("#action-button").click(function(event) {
    
    if ($(this).data("action") == "create") {
      let code = generateRandomCode()
      $("#code-input input").val(code);
      $("#lobby").css("display", "flex");
      $("#code-input input").attr("readonly", true);
      $("#action-button-inner").text("START GAME");
      $(this).data("action", "start");
    } else if ($(this).data("action") == "start") {
      $("#start-menu").hide()
      $("#player-selection").css("display","flex");
      timer()
    } else if ($(this).data("action") == "join") {
      if ($(this).closest("#lobby").find("#code-input input").length < 4) {
        $("#code-validator").css("display", "flex");
      } else {
        $("#lobby").css("display", "flex");
        $("#code-input input").attr("readonly", true);
        $("#action-button-inner").text("START GAME");
        $(this).data("action", "start");
      }
    }
  });
});

function generateRandomCode() { 
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
  let code = ""; 
  for (let i = 0; i < 4; i++) { 
    const randomIndex = Math.floor(Math.random() * letters.length); 
    code += letters[randomIndex]; 
  } 
  return code; 
}

function timer() {
  $("#timer").animate({
    width: "0%"
  }, 30000, function() {
      // This function will be called when the animation is complete
      // Check your variable and perform some logic here
      if (chosenPlayer == "") {
        let isPlayerChosen = false;
        const availablePlayers = [];
        $(".choose-player").each(function(event) {
            if (!$(this).hasClass("player-already-taken")) {
              availablePlayers.push($(this).attr("id").replace("choose-", ""));
            }
            if ($(this).hasClass("my-chosen-player")) {
                isPlayerChosen = true;
                chosenPlayer = $(this).attr("id").replace("choose-", "");
                return false; // Exit the loop
            }
        });

        if (!isPlayerChosen) {
          const randomIndex = Math.floor(Math.random() * availablePlayers.length);
          chosenPlayer = availablePlayers[randomIndex];
        }

        $("#player-selection").hide();
        $("#boardgame").css("display", "flex");
      }
  });
}