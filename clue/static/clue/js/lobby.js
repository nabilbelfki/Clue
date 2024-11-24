
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

  $("#lobby > div > input").on("input", function () {
    var inputVal = $(this).val().toUpperCase().replace(/[^A-Z0-9 ]/g, '').slice(0, 25);
    $(this).val(inputVal);
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
    const $input = $player.find("input");
    $input.attr("readonly", true);
    let newName = $input.val();
    renamePlayer(newName);
    $player.find(".edit").css("display", "flex");
    $(this).hide();
  });

  $("#action-button").click(function(event) {
    $("#arcade")[0].play();
    if ($(this).data("action") == "create") {
      createGame();
    } else if ($(this).data("action") == "start") {
      $("#start-menu").hide()
      $("#player-selection").css("display","flex");
      timer()
    } else if ($(this).data("action") == "join") {
      let code = $("#code-input input").val();
      if (code.length < 4) {
        $("#code-validator").css("display", "flex");
      } else {
        joinGame(code);
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
        showMyCards();
        $("#player-selection").hide();
        $("#boardgame").css("display", "flex");
      }
  });
}


function createGame() {
  $.ajax({
    url: '/game/create/',
    type: 'POST',
    data: {
        csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
    },
    success: function(response) {
        let code = response.game_code;
        let playerID = response.player_id;
        let players = JSON.parse(response.players);
        setupLobby(code, playerID, players);
    },
    error: function(xhr, status, error) {
        console.error("Error generating code and creating game:", error);
    }
});
}

function joinGame(code) {
  $.ajax({
    url: '/game/join/',
    type: 'POST',
    data: {
        csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
        code: code
    },
    success: function(response) {
        let playerID = response.player_id;
        let players = JSON.parse(response.players);
        setupLobby(code, playerID, players);
    },
    error: function(xhr, status, error) {
        console.error("Error generating code and creating game:", error);
    }
});
}

function setupLobby(code, currentPlayerID, players) {
  let currentPlayerIndex;
  players.forEach(function(player, index) {
    if (player.ID == currentPlayerID) currentPlayerIndex = index;
    $("#lobby > div").eq(index).find("input").val(player.Name);
  });
  let currentPlayer = $("#lobby > div").eq(currentPlayerIndex);
  currentPlayer.find(".edit").show();
  if (currentPlayerIndex != 1) currentPlayer.find(".exit").show();
  $("#code-input input").val(code);
  $("#lobby").css("display", "flex");
  $("#code-input input").attr("readonly", true);
  $("#action-button-inner").text("START GAME");
  $(this).data("action", "start");

  // Establish WebSocket connection
  const lobbySocket = new WebSocket(`ws://${window.location.host}/ws/lobby/${code}/`);

  lobbySocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if (data.action === 'PlayerAdded') {
      const players = JSON.parse(data.players);
      // Update the lobby UI with the new players
      players.forEach(function(player, index) {
        $("#lobby > div").eq(index).find("input").val(player.Name);
      });
    }
  };

  lobbySocket.onclose = function(e) {
    console.error('Lobby socket closed unexpectedly');
  };
}


function renamePlayer(name) {
  $.ajax({
      url: '/player/',
      type: 'POST',
      data: {
          csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
          name: name
      },
      success: function(response) {
          console.log(response);
      },
      error: function(xhr, status, error) {
          console.error("Error generating code and creating game:", error);
      }
  });
}