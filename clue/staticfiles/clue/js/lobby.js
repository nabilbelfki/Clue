var playersOfLobby = [];
var myPlayerID;
var myPlayerName;
$(document).ready(function () {
  $("input").on("input", function() { this.value = this.value.toUpperCase(); });
  $("#code-input > input").on("input", function () {
      var inputVal = $(this).val().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
      $(this).val(inputVal);

      if (inputVal) {
          $("#action-button-inner").text("JOIN GAME");
          $("#action-button").attr("data-action", "join");
      } else {
          $("#action-button-inner").text("CREATE GAME");
          $("#action-button").attr("data-action", "create");
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
    const action = $(this).attr("data-action");
    if (action == "create") {
      $("#arcade")[0].play();
      createGame();
      $(this).attr("data-action", "start");
    } else if (action == "start") {
      if (!$(this).hasClass("is-not-admin")) {
        startGame()
      }
    } else if (action == "join") {
      let code = $("#code-input input").val();
      if (code.length < 4) {
        $("#code-validator").css("display", "flex");
      } else {
        $("#arcade")[0].play();
        $(this).attr("data-action", "start");
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
      myPlayerID = response.player_id;
      myPlayerName = response.player_name
      let players = JSON.parse(response.players);
        setupLobby(code, myPlayerID, players);
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
        myPlayerID = response.player_id;
        myPlayerName = response.player_name
        let players = JSON.parse(response.players);
        $("#action-button").addClass("is-not-admin");
        setupLobby(code, myPlayerID, players);
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
    const $playerElement = $("#lobby > div").eq(index);  
    $playerElement.attr("data-id", player.ID)
    $playerElement.find("input").val(player.Name);
  });

  let currentPlayer = $("#lobby > div").eq(currentPlayerIndex);
  currentPlayer.find(".edit").show();
  if (currentPlayerIndex != 1) currentPlayer.find(".exit").show();
  $("#code-input input").val(code);
  $("#lobby").css("display", "flex");
  $("#code-input input").attr("readonly", true);
  $("#action-button-inner").text("START GAME");
  $(this).data("action", "start");

  console.log(code)
  // Establish WebSocket connection
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const lobbySocket = new WebSocket(`${protocol}//${window.location.hostname}:8001/ws/lobby/${code}/`);

  lobbySocket.onopen = function(e) {
    console.log('WebSocket connection opened:', e);
  };

  lobbySocket.onmessage = function(e) {
    try {
        const data = JSON.parse(e.data);
        const action = data.Action;
        const body = data.Body;
        console.log("Received WebSocket message:", data);  // Log to see the message content

        if (action === 'PlayerAdded') {
          console.log("PlayerAdded")
          console.log(body);
          const players = body.Players;
          updatePlayerList(players)
        }

        if (action === 'PlayerNameUpdated') {
          const id = body.ID;
          const newName = body.PlayerName;
          updatePlayerName(id, newName)
        }

        if (action === 'GameStarted') {
          playersOfLobby = body.Players;
          getCards()
        }

        if (action == 'PlayerChosen') {
          showSelectedPlayer(body.ID, body.Name, body.Slug);
          if (body.Next == null) {
            startPlaying();
          }else if (body.Next == myPlayerID) {
            myTurnToSelectPlayer = true;
            $("#choose-player-button").css("display","flex");
          }
        }

        if (action == 'DiceRoll') {
          showDiceRoll(body.ID, body.Dice);
        }

        if (action == 'Move') {
          playerMovedTo(body.ID, body.Position);
        }

        if (action == 'Suggestion') {
          let playerID = body.ID;
          let slug, name;
          playersOfLobby.forEach(function(player) {
            if (player['id'] == playerID) {
              slug = player['character'];
              name = player['name'];
            }
          });
          $("#suggested-title").text(name + " SUGGESTED");
          $("#suggested").css("background-color", colors[slug])
          $(".suggested-label").css("color", colors[slug])
          let suspect = body.Suspect;
          let weapon = body.Weapon;
          let room = body.Room;
          $("#suspect").attr("data-choice", suspect.Slug);
          $("#weapon").attr("data-choice", weapon.Slug);
          $("#room").attr("data-choice", room.Slug);
          $("#suspect").attr("data-text", suspect.Name.toUpperCase());
          $("#weapon").attr("data-text", weapon.Name.toUpperCase());
          $("#room").attr("data-text", room.Name.toUpperCase());
          suggest("suggested");
          $("#suggested").fadeIn();
        }
    } catch (err) {
        console.error("Error processing WebSocket message:", err);
    }
  };

  lobbySocket.onerror = function(e) {
    console.error('WebSocket error:', e);
  };

  lobbySocket.onclose = function(e) {
    console.error('Lobby socket closed unexpectedly:', e);
  };
}

function updatePlayerList(players) {
  console.log(players);
  players.forEach(function(player, index) {
    const $playerElement = $("#lobby > div").eq(index);  
    $playerElement.attr("data-id", player.ID)
    $playerElement.find("input").val(player.Name);
  });
}

function updatePlayerName(id, name) {
  $("#lobby > div").each(function(event) {
    const $playerElement = $(this);  
    if ($playerElement.attr("data-id") == id)
    $playerElement.find("input").val(name);
  });
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
          myPlayerName = name;
          console.log(response);
      },
      error: function(xhr, status, error) {
          console.error("Error generating code and creating game:", error);
      }
  });
}

function startGame() {
  $.ajax({
    url: '/game/start/',
    type: 'POST',
    data: {
        csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
    },
    success: function(response) {
        console.log(response);
        $("#start-menu").hide()
        $("#player-selection").css("display","flex");
        myTurnToSelectPlayer = true;
        $("#choose-player-button").css("display","flex");
        timer();
    },
    error: function(xhr, status, error) {
        console.error("Error generating code and creating game:", error);
    }
});
}

function getCards() {
  $.ajax({
      url: '/cards/get/',
      type: 'POST',
      data: {
          csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
      },
      success: function(response) {
          console.log(response.Cards);
          myCards = response.Cards;
          $("#start-menu").hide()
          $("#player-selection").css("display","flex");
          timer();
      },
      error: function(xhr, status, error) {
          console.error("Error generating code and creating game:", error);
      }
  });
}