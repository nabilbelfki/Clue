var playersOfLobby = [];
var myPlayerID;
var myPlayerName;
var lobbySocket;
let isAdmin = false;
let winningScreenEnded = false;
$(document).ready(function () {
  $("input").on("input", function () {
    this.value = this.value.toUpperCase();
  });

  $("#code-input > input").on("keypress", function (e) {
    if (e.which === 13) { // 13 is the Enter key
        $("#action-button").click();
    }
  });

  $("#code-input > input").on("input", function () {
    var inputVal = $(this)
      .val()
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 4);
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
    var inputVal = $(this)
      .val()
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, "")
      .slice(0, 25);
    $(this).val(inputVal);
  });

  $("#lobby > div > input").on("keypress", function (e) {
    if (e.which === 13) { // 13 is the Enter key
        $(this).parent().find(".save").click();
    }
  });

  $(".edit").click(function (event) {
    const $player = $(this).parent();
    $player.find("input").attr("readonly", false);
    $player.find("input").focus();
    $player.find(".save").css("display", "flex");
    $(this).hide();
  });

  $(".exit").click(function (event) {
    console.log("Leaving")
    $(".exit").hide();
    leaveGame();
  });

  $(".save").click(function (event) {
    const $player = $(this).parent();
    const $input = $player.find("input");
    $input.attr("readonly", true);
    let newName = $input.val();
    renamePlayer(newName);
    $player.find(".edit").css("display", "flex");
    $(this).hide();
  });

  $(".kick").click(function (event) {
    // const $player = $(this).parent();
    const PlayerID = $(this).parent().attr("data-id");
    kickPlayer(PlayerID);
  });

  $(".ban").click(function (event) {
    const PlayerID = $(this).parent().attr("data-id");
    banPlayer(PlayerID);
  });

  $("#action-button").click(function (event) {
    $(".exit").show();
    const action = $(this).attr("data-action");
    if (action == "create") {
      if (music) $("#arcade")[0].play();
      createGame();
      $(this).attr("data-action", "start");
    } else if (action == "start") {
      if (!$(this).hasClass("is-not-admin")) {
        startGame();
      }
    } else if (action == "join") {
      let code = $("#code-input input").val();
      if (code.length < 4) {
        $("#code-validator").css("display", "flex");
      } else {
        if (music) $("#arcade")[0].play();
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
  var audio = $("#clock-sound")[0];
  $("#timer").show();
  playing = "clock";
  if (music) audio.play();
  $("#timer").animate(
    {
      width: "0%",
    },
    30000,
    function () {
      // This function will be called when the animation is complete
      // Check your variable and perform some logic here
      if (chosenPlayer == "") {
        let playerChosen;
        let isPlayerChosen = false;
        const availablePlayers = [];
        $(".choose-player").each(function (event) {
          if (!$(this).hasClass("player-already-taken")) {
            availablePlayers.push($(this).attr("id").replace("choose-", ""));
          }
          if ($(this).hasClass("my-chosen-player")) {
            isPlayerChosen = true;
            playerChosen = $(this).attr("id").replace("choose-", "");
            return false;
          }
        });

        if (!isPlayerChosen) {
          const randomIndex = Math.floor(
            Math.random() * availablePlayers.length
          );
          playerChosen = availablePlayers[randomIndex];
          choosePlayer(playerChosen);
        }
        $("#choose-player-button").hide();
        audio.pause();
        playing = "";
        // Reset the audio to the beginning
        audio.currentTime = 0;
      }
    }
  );
}

function createGame() {
  $.ajax({
    url: "/game/create/",
    type: "POST",
    data: {
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
    },
    success: function (response) {
      let code = response.game_code;
      myPlayerID = response.player_id;
      myPlayerName = response.player_name;
      let players = JSON.parse(response.players);
      isAdmin = true;
      setupLobby(code, myPlayerID, players);
    },
    error: function (xhr, status, error) {
      console.error("Error generating code and creating game:", error);
    },
  });
}

function joinGame(code) {
  $.ajax({
    url: "/game/join/",
    type: "POST",
    data: {
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
      code: code,
    },
    success: function (response) {
      if (response.Status) {
        myPlayerID = response.player_id;
        myPlayerName = response.player_name;
        let players = JSON.parse(response.players);
        $("#action-button").addClass("is-not-admin");
        isAdmin = false;
        setupLobby(code, myPlayerID, players);
      } else {
        alert(response.Message);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error generating code and creating game:", error);
    },
  });
}

function setupLobby(code, currentPlayerID, players) {
  let currentPlayerIndex;
  console.log(isAdmin)

  $("#player-menu-code-input-value").prop("readonly", false).val(code).prop("readonly", true);

  players.forEach(function (player, index) {
    let ID = player.hasOwnProperty("ID") ? "ID" : "id";
    let Name = player.hasOwnProperty("Name") ? "Name" : "name";
    if (player[ID] == currentPlayerID) currentPlayerIndex = index;
    const $playerElement = $("#lobby > div").eq(index);
    $playerElement.attr("data-id", player[ID]);
    $playerElement.find("input").val(player[Name]);
  });

  let currentPlayer = $("#lobby > div").eq(currentPlayerIndex);
  currentPlayer.find(".edit").show();
  // if (currentPlayerIndex != 0) currentPlayer.find(".exit").show();
  if (isAdmin) {
    $("#lobby input").css("width", "475px");
  } else {
    $("#lobby input").css("width", "500px");
  }

  $("#code-input input").val(code);
  $("#lobby").css("display", "flex");
  $("#code-input input").attr("readonly", true);
  $("#action-button-inner").text("START GAME");
  $(this).data("action", "start");

  console.log(code);
  // Establish WebSocket connection
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const hostname = window.location.hostname;
  if (hostname === "localhost") {
    lobbySocket = new WebSocket(`${protocol}//${hostname}:8001/ws/lobby/${code}/`);
  } else {
    lobbySocket = new WebSocket(`${protocol}//${hostname}/ws/lobby/${code}/`);
  }

  lobbySocket.onopen = function (e) {
    console.log("WebSocket connection opened:", e);
  };

  lobbySocket.onmessage = function (e) {
    try {
      const data = JSON.parse(e.data);
      const action = data.Action;
      const body = data.Body;
      console.log("Received WebSocket message:", data); // Log to see the message content

      if (action === "PlayerAdded") {
        console.log("PlayerAdded");
        console.log(body);
        const players = body.Players;
        updatePlayerList(players);
      }

      if (action == "PlayerLeft") {
        const players = body.Players;
        updatePlayerList(players);
      }

      if (action == "PlayerKicked") {
        if (body.PlayerID == myPlayerID) {
          closeSocket();
          flushSession();
          $("#action-button").removeClass("is-not-admin");
          $("#code-input input").val("");
          $("#lobby").hide();
          $("#code-input input").attr("readonly", false);
          $("#action-button-inner").text("CREATE GAME");
          $(this).data("action", "create");
        }
        const players = body.Players;
        updatePlayerList(players);
      }

      if (action == "PlayerBanned") {
        if (body.PlayerID == myPlayerID) {
          closeSocket();
          flushSession();
          $("#action-button").removeClass("is-not-admin");
          $("#code-input input").val("");
          $("#lobby").hide();
          $("#code-input input").attr("readonly", false);
          $("#action-button-inner").text("CREATE GAME");
          $(this).data("action", "create");
        }
        const players = body.Players;
        updatePlayerList(players);
      }

      if (action === "PlayerNameUpdated") {
        const id = body.ID;
        const newName = body.PlayerName;
        updatePlayerName(id, newName);
      }

      if (action === "GameStarted") {
        playersOfLobby = body.Players;
        getCards();
      }

      if (action == "PlayerChosen") {
        showSelectedPlayer(body.ID, body.Name, body.Slug);
        if (body.Next == null) {
          startPlaying();
        } else if (body.Next == myPlayerID) {
          myTurnToSelectPlayer = true;
          $("#choose-player-button").css("display", "flex");
          timer();
        }
      }

      if (action == "DiceRoll") {
        showDiceRoll(body.ID, body.Dice);
      }

      if (action == "Move") {
        playerMovedTo(body.ID, body.Position);
      }

      if (action == "Suggestion") {
        let playerID = body.ID;
        let slug, name;
        playersOfLobby.forEach(function (player) {
          if (player["id"] == playerID) {
            slug = player["character"];
            name = player["name"];
          }
        });
        
        if (colors[slug] == "#FFFFFF") {
          $("#suggested-title").css("color", "#474747");
          $(".suggested-label").css("color", "#474747");
          $("#show-card").css("background-color", "#474747");
        } else {
          $("#suggested-title").css("color", "#FFFFFF");
          $(".suggested-label").css("color", colors[slug]);
          $("#show-card").css("background-color", "#FFFFFF");
        }
        $("#suggested-title").text(name + " SUGGESTED");
        $("#suggested").css("background-color", colors[slug]);
        $("#show-card").css("color", colors[slug]);
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
        if (body.Shower == myPlayerID) {
          isChoosingCard = true;
          $("#show-card").css("display", "flex");
        } else {
          $("#show-card").hide();
        }
        stopClock();
        $("#suggested").css("display", "flex").css("opacity","1");
        $("#suggested").fadeIn();
        startClock(60000);
        if (!body.Shower) {
          setTimeout(function() {
            $("#suggested").fadeOut();
            changeTurn();
          }, 3000);
        }        
      }

      if (action == "Assumption") {
        let playerID = body.ID;
        let slug, name;
        playersOfLobby.forEach(function (player) {
          if (player["id"] == playerID) {
            slug = player["character"];
            name = player["name"];
          }
        });
        if (colors[slug] == "#FFFFFF") {
          $("#suggested-title").css("color", "#474747");
          $(".suggested-label").css("color", "#474747");
          $("#show-card").css("background-color", "#474747");
        } else {
          $("#suggested-title").css("color", "#FFFFFF");
          $(".suggested-label").css("color", colors[slug]);
          $("#show-card").css("background-color", "#FFFFFF");
        }
        $("#suggested-title").text(name + " SUGGESTED");
        $("#suggested").css("background-color", colors[slug]);
        $(".suggested-label").css("color", colors[slug]);
        let suspect = body.Suspect;
        let weapon = body.Weapon;
        let room = body.Room;
        $("#suspect").attr("data-choice", suspect.Slug);
        $("#weapon").attr("data-choice", weapon.Slug);
        $("#room").attr("data-choice", room.Slug);
        $("#suspect").attr("data-text", suspect.Name.toUpperCase());
        $("#weapon").attr("data-text", weapon.Name.toUpperCase());
        $("#room").attr("data-text", room.Name.toUpperCase());
        $("#show-card").hide();
        suggest("suggested");
        $("#suggested").css("display", "flex").css("opacity","1");
        $("#suggested").fadeIn();

        setTimeout(function() {
          $("#suggested").fadeOut();
          if (body.Correct) {
              wonGame(body.ID, {"Suspect": suspect.Slug, "Weapon": weapon.Slug, "Room": room.Slug}, body.Cards, body.Statistics);
          } else {
              let winningSuspect = body.hasOwnProperty("WinningSuspect") ? body.WinningSuspect : "";
              let winningWeapon = body.hasOwnProperty("WinningWeapon") ? body.WinningWeapon : "";
              let winningRoom = body.hasOwnProperty("WinningRoom") ? body.WinningRoom : "";
              lostGame(body.ID, {"Suspect": winningSuspect, "Weapon": winningWeapon, "Room": winningRoom}, body.Cards, body.Statistics);
          }
        }, 3000);
      }

      if (action == "CardShown") {
        let card = body.Card;
        let showerID = body.ID;
        let suggestedID = body.SuggestedPlayer;
        showSuggestedCardPopup(card, suggestedID, showerID);
      }

      if (action == "TurnEnded") {
        changeTurn();
      }

      if (action == "Message") {
        appendMessage(body.Player, body.Message);
      }

    } catch (err) {
      console.error("Error processing WebSocket message:", err);
    }
  };

  lobbySocket.onerror = function (e) {
    console.error("WebSocket error:", e);
  };

  lobbySocket.onclose = function (e) {
    console.error("Lobby socket closed unexpectedly:", e);
  };
}

function updatePlayerList(players) {
  console.log(players);
  $("#lobby > div").each(function(event) {
    $(this).attr("data-id", "");
    $(this).find("input").val("");
    if (isAdmin) {
      $(this).find(".kick").hide();
      $(this).find(".ban").hide();
    }
  });
  players.forEach(function (player, index) {
    const $playerElement = $("#lobby > div").eq(index);
    $playerElement.attr("data-id", player.ID);
    $playerElement.find("input").val(player.Name);
    if (isAdmin) {
      $playerElement.find(".kick").show();
      $playerElement.find(".ban").show();
    }
  });
}

function updatePlayerName(id, name) {
  $("#lobby > div").each(function (event) {
    const $playerElement = $(this);
    if ($playerElement.attr("data-id") == id)
      $playerElement.find("input").val(name);
  });
}

function renamePlayer(name) {
  $.ajax({
    url: "/player/",
    type: "POST",
    data: {
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
      name: name,
    },
    success: function (response) {
      myPlayerName = name;
      console.log(response);
    },
    error: function (xhr, status, error) {
      console.error("Error generating code and creating game:", error);
    },
  });
}

function startGame() {
  $.ajax({
    url: "/game/start/",
    type: "POST",
    data: {
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
    },
    success: function (response) {
      console.log(response);
      if (response.Status == "Can't start game with only one player") {
        alert(response.Status);
      } else {
        $("#start-menu").hide();
        initializePlayerPositions();
        $("#player-selection").css("display", "flex");
        myTurnToSelectPlayer = true;
        $("#choose-player-button").css("display", "flex");
        // Make this time slight shorter than server-side timer, incase they disable this client side one.
        timer();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error generating code and creating game:", error);
    },
  });
}

function getCards() {
  $.ajax({
    url: "/cards/get/",
    type: "POST",
    data: {
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
    },
    success: function (response) {
      console.log(response.Cards);
      myCards = response.Cards;
      $("#start-menu").hide();
      $("#player-selection").css("display", "flex");
    },
    error: function (xhr, status, error) {
      console.error("Error generating code and creating game:", error);
    },
  });
}

function wonGame(playerID, winningCards, playersCards, statistics) {
  let slug;
  let playerName;
  playersOfLobby.forEach(function(player) {
    if (player.id == playerID) {
      slug = player.character;
      playerName = player.name;
    }
  });

  let resultText = "THE WINNER IS";

  if (chosenPlayer == slug) {
    resultText = "YOU WON"
  }

  $("#won-or-lost-text").text(resultText).css("color", "#474747");
  $("#won-or-lost").css({
    "background-color": "#FF4B4B",
    "animation": "rainbow 20s infinite",
    "width": "100vw",
    "height": "100vh",
    "border-radius": "0px"
  });

  $(".result-picture").each(function(event) {
    if ($(this).attr("id").replace("-result", "") == slug) {
      $(this).css("display", "flex");
    } else {
      $(this).hide();
    }
  });
  $("#won-or-lost-name").text(playerName);
  $("#won-or-lost").css("display", "flex");

  cycleWinningScreen(winningCards, playersCards, statistics, 10000);
}

function lostGame(playerID, winningCards, playersCards, statistics) {
  let slug;
  let playerName;
  playersOfLobby.forEach(function(player) {
    if (player.id == playerID) {
      slug = player.character;
      playerName = player.name;
    }
  });

  let resultText = "THIS PLAYER LOST";

  if (chosenPlayer == slug) {
    resultText = "YOU LOST"
  }

  $("#won-or-lost-text").text(resultText).css("color", "#FF0000");
  $("#won-or-lost").css("background-color", "#000000");

  $(".result-picture").each(function(event) {
    if ($(this).attr("id").replace("-result", "") == slug) {
      $(this).css("display", "flex");
    } else {
      $(this).hide();
    }
  });
  $("#won-or-lost-name").text(playerName);
  $("#won-or-lost").css({
    "display": "flex",
    "width": "700px",
    "height": "550px",
    "border-radius": "25px"
  });
  $("#won-or-lost").fadeIn();
  if (rotation.length > 2) {
    setTimeout(function() {
      rotation = rotation.filter(item => item !== slug);
      $("#won-or-lost").fadeOut();
      turn--;
      changeTurn();
    }, 3000);
  } else {
    setTimeout(function() {
      rotation = rotation.filter(item => item !== slug);
      $("#won-or-lost").fadeOut(function() {
        playersOfLobby.forEach(function(player) {
            if (player.character == rotation[0]) {
                wonGame(player.id, winningCards, playersCards, statistics);
            }
        });
      });
    }, 3000);
  }
}

function nextTurn() {
  $.ajax({
    url: "/game/next/",
    type: "POST",
    data: {
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
    },
    success: function (response) {
      console.log(response);
    },
    error: function (xhr, status, error) {
      console.error("Error generating code and creating game:", error);
    },
  });
}

function leaveGame() {
  $.ajax({
    url: "/game/leave/",
    type: "POST",
    data: {
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
    },
    success: function (response) {
      console.log(response);
      if (response.Status) {
        closeSocket();
        $("#action-button").removeClass("is-not-admin");
        $("#code-input input").val("");
        $("#lobby").hide();
        $("#code-input input").attr("readonly", false);
        $("#action-button-inner").text("CREATE GAME");
        $(this).data("action", "create");
      } else {
        alert(response.Reason)
      }
    },
    error: function (xhr, status, error) {
      console.error("Error generating code and creating game:", error);
    },
  });
}

function kickPlayer(PlayerID) {
  $.ajax({
    url: "/player/kick/",
    type: "POST",
    data: {
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
      player_id: PlayerID
    },
    success: function (response) {
      console.log(response);
      if (!response.Status) { 
        alert(response.Reason);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error generating code and creating game:", error);
    },
  });
}

function banPlayer(PlayerID) {
  $.ajax({
    url: "/player/ban/",
    type: "POST",
    data: {
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
      player_id: PlayerID
    },
    success: function (response) {
      console.log(response);
      if (!response.Status) { 
        alert(response.Reason);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error generating code and creating game:", error);
    },
  });
}

function flushSession() {
  $.ajax({
    url: "/session/flush/",
    type: "POST",
    data: {
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
    },
    success: function (response) {
      console.log(response);
    },
    error: function (xhr, status, error) {
      console.error("Error generating code and creating game:", error);
    },
  });
}

function closeSocket() {
  if (lobbySocket) {
    lobbySocket.onopen = null;
    lobbySocket.onmessage = null;
    lobbySocket.onclose = null;
    lobbySocket.onerror = null;

    if (lobbySocket.readyState === WebSocket.OPEN) {
      lobbySocket.close();
      console.log("WebSocket connection closed");
    } else {
      console.log("No open WebSocket connection to close");
    }

    lobbySocket = null;
  }
}

function cycleWinningScreen(winningCards, playersCards, statistics, time) {
  $("#game-statistics").hide();
  $("#won-or-lost-logo").show();
  $("#won-or-lost-result").fadeIn();
  setTimeout(function() {
    $("#" + winningCards["Suspect"] + "-winning-card").show();
    $("#" + winningCards["Weapon"] + "-winning-card").show();
    $("#" + winningCards["Room"] + "-winning-card").show();
    $("#won-or-lost-result").fadeOut(function() {
      $("#winning-cards").fadeIn();
      setTimeout(function() {
        $("#winning-cards").fadeOut(function() {
          $("#players-cards").css("display", "flex").hide().fadeIn();
          let delay = 0;
          console.log(playersCards);
          $("#won-or-lost-logo").hide();
          playersCards.forEach(function(playerCards) {
            console.log(playerCards);
            playersOfLobby.forEach(function(player) {
              if (player.id == playerCards[0]) {
                setTimeout(function() {
                  console.log("Player: " + player.character + " has card " + playerCards[1]);
                  $("#players-cards-avatar img").hide();
                  $("#" + player.character + "-players-cards-avatar").show();
                  $("#players-cards-title").text(player.name + "'S CARDS");
                  $("#players-cards-display img").hide();
                  JSON.parse(playerCards[1]).forEach(function(card) {
                    $("#" + card.Slug + "-player-card").show();
                  });
                }, delay);
                delay += time;
              }
            });
          });
          statistics.forEach(function(statistic) {
            setTimeout(function() {
              $("#won-or-lost-logo").show();
              $("#players-cards").fadeOut(function() {
                $("#game-statistics-image img").hide();
                if (statistic[0] == "MostSuggestions") {
                  $("#game-statistics-title").text("MOST SUGGESTIONS");
                  $("#most-suggestions").show();
                }
                if (statistic[0] == "MostMoves") {
                  $("#game-statistics-title").text("MOST MOVES");
                  $("#most-moves").show();
                }
                if (statistic[0] == "MostShows") {
                  $("#game-statistics-title").text("MOST CARDS SHOWN");
                  $("#most-cards-shown").show();
                }
    
                playersOfLobby.forEach(function(player) {
                  if (player.id == statistic[1]) {
                    $("#game-statistics-player").text(player.name);
                  }
                });

                if (!$("#game-statistics").is(":visible")) {
                  $("#game-statistics").css("display", "flex").hide().fadeIn();
                }
                
              });
            }, delay);
            delay += time;
          });

          if (!winningScreenEnded) setTimeout(function() {
            cycleWinningScreen(winningCards, playersCards, statistics, time);
          }, delay);
        });
      }, time);
    });
  }, time);
}
