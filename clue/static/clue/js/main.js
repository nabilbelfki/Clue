const characters = {
  "miss-scarlet": "Miss Scarlet",
  "mrs-white": "Mrs. White",
  "mrs-peacock": "Mrs. Peacock",
  "colonel-mustard": "Colonel Mustard",
  "professor-plum": "Professor Plum",
  "mr-green": "Mr. Green",
};

const colors = {
  "miss-scarlet": "#872427",
  "mrs-white": "#FFFFFF",
  "mrs-peacock": "#1A9D9F",
  "colonel-mustard": "#C5A12F",
  "professor-plum": "#6C3C89",
  "mr-green": "#618547",
};

const players = {
  "miss-scarlet": "miss-scarlet-start",
  "mrs-white": "mrs-white-start",
  "mrs-peacock": "mrs-peacock-start",
  "colonel-mustard": "colonel-mustard-start",
  "professor-plum": "professor-plum-start",
  "mr-green": "mr-green-start",
};

const gamePlayers = {
  "colonel-mustard": "NABIL",
  "professor-plum": "LAYLA",
  "mrs-white": "KRISTALLIA",
  "mr-green": "GERASIMOS",
  "miss-scarlet": "SANDY",
  "mrs-peacock": "SUNNY",
};

const rooms = {
  study: true,
  lounge: true,
  library: true,
  kitchen: true,
  "dining-room": true,
  assumption: true,
  conservatory: true,
  "billiard-room": true,
  ballroom: true,
  hall: true
};

const startingPositions = {
  "mrs-white-start": true,
  "mr-green-start": true,
  "mrs-peacock-start": true,
  "professor-plum-start": true,
  "miss-scarlet-start": true,
  "colonel-mustard-start": true,
};

const secretPassages = {
  study: "kitchen",
  lounge: "conservatory",
  kitchen: "study",
  conservatory: "lounge"
}

var turn = 0;
var moves = 0;
var rotation = [];

let previous = 0;
let chosenPlayer = "";

let myTurnToSelectPlayer = false;
let music = true;
let playing = "";
$(document).ready(function () {
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const csrftoken = getCookie("csrftoken");

  $.ajaxSetup({
    beforeSend: function (xhr, settings) {
      if (
        !/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type) &&
        !this.crossDomain
      ) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    },
  });

  $("#spooky-sound")[0].volume = 0.5
  $("#volume").click(function(event) {
    if (music) {
      $("#play").hide();
      $("#mute").show();
      if (playing != "") $("#" + playing + "-sound")[0].pause();
      music = false;
    } else {
      $("#play").show();
      $("#mute").hide();
      if (playing != "") $("#" + playing + "-sound")[0].play();
      music = true;
    }
  })
  
  // $("#gameplay").on("load", function () {
  //   $(".room").each(function (event) {
  //     let room = $(this).attr("id");
  //     var bbox = document.getElementById(room).getBBox();
  //     // console.log("Width: " + bbox.width);
  //     // console.log("Height: " + bbox.height);
  //     rooms[room]["height"] = bbox.height;
  //     rooms[room]["width"] = bbox.width;
  //   });
  // });

  $(document).keydown(function (event) {
    switch (event.which) {
      case 37: // left arrow key
        move(rotation[turn], "LEFT");
        // Add your code here
        break;
      case 38: // up arrow key
        move(rotation[turn], "UP");
        // Add your code here
        break;
      case 39: // right arrow key
        move(rotation[turn], "RIGHT");
        // Add your code here
        break;
      case 40: // down arrow key
        move(rotation[turn], "DOWN");
        // Add your code here
        break;
      default:
        return; // exit this handler for other keys
    }
    event.preventDefault(); // prevent the default action (scroll / move caret)
  });
});

function move(player, direction) {
  if (moves > 0 && chosenPlayer == rotation[turn]) {
    if (board[players[player]].hasOwnProperty(direction)) {
      let id = board[players[player]][direction];
      let blocked = false;
      for (const playerName in players) {
        console.log(players[playerName]);
        if (id == players[playerName] && !rooms.hasOwnProperty(id)) {
          blocked = true;
          break;
        }
      }
      if (!blocked) {
        movePlayer(direction);
      }
    } else {
      console.log("Can't go " + direction.toLowerCase());
    }
  }
}

function position(player, tile) {
  var $pathElement = $(tile);
  var $playerElement = $(player);

  var bbox = $pathElement[0].getBBox(); // Get the bounding box of the path
  if (music) $("#move-sound")[0].play();
  var x = bbox.x;
  var y = bbox.y;
  
  // Check if the pathId corresponds to a room
  let name = tile.replace("#","");
  if (rooms.hasOwnProperty(name)) {
    // Center the player within the room
    x += (bbox.width / 2);
    y += (bbox.height / 2);
    console.log(x);
    console.log(y);
  }

  // Set the position of the foreignObject
  $playerElement.attr("x", x);
  $playerElement.attr("y", y);
}

function highlightPossibleMoves(id) {
  console.log("ID: " + id);
  const possibleMoves = board[id];
  //   console.log(possibleMoves);
  for (let i = 0; i < possibleMoves.length; i++) {
    $("#" + possibleMoves[i]).css({
      stroke: "yellow",
      "stroke-width": "8px",
      "stroke-dasharray": "12",
    });
  }
}

function changeTurn() {
  $("#moves").hide();
  $("#dice-text").text("MOVES");
  $("#dice-text").text("ROLL DICE");
  $("#six-cube, #four-cube").fadeIn();
  $("#dice-roll").addClass("rollable");

  if (turn == rotation.length - 1) {
    turn = 0;
  } else {
    turn++;
  }
  let character = rotation[turn];
  changeAvatar(character);
  console.log("Chosen Player ", chosenPlayer);
  console.log("Turn ", rotation[turn]);
  if (chosenPlayer == rotation[turn]) {
    console.log("Its my turn")
    $("#your-turn-sound")[0].play();
    myTurnToSelectPlayer = true;
    $("#dice-roll div, #dice-roll p").css("opacity", "1");
    $("#six-cube").css("opacity", "1");
    $("#four-cube").css("opacity", "1");
    $("#dice-roll").css("cursor", "pointer");
  } else {
    $("#other-turn-sound")[0].play();
    $("#dice-roll div, #dice-roll p").css("opacity", "0.6");
    $("#six-cube, #four-cube").css("opacity", "0.6");
    $("#dice-roll").css("cursor", "default");
  }

  if (
    chosenPlayer == rotation[turn] &&
    rooms.hasOwnProperty(players[rotation[turn]])
  ) {
    toggleOpacity("#suggestion", "1", "pointer");
  } else {
    toggleOpacity("#suggestion", "0.6", "default");
  }

  if (
    chosenPlayer == rotation[turn] &&
    secretPassages.hasOwnProperty(players[rotation[turn]])
  ) {
    toggleOpacity("#secret-passage", "1", "pointer");
  } else {
    toggleOpacity("#secret-passage", "0.6", "default");
  }
}

function startPlaying() {
  turn = 0;

  playersOfLobby.forEach(function (player) {
    rotation.push(player["character"]);
  });

  let character = rotation[turn];

  changeAvatar(character);

  if (chosenPlayer == rotation[turn]) {
    $("#dice-roll div, #dice-roll p").css("opacity", "1");
    $("#dice-roll").css("cursor", "pointer");
  } else {
    $("#dice-roll div, #dice-roll p").css("opacity", "0.6");
    $("#dice-roll").css("cursor", "default");
  }

  $("#player-selection").hide();

  // Get the current local time
  var currentTime = new Date();
  var hours = currentTime.getHours().toString().padStart(2, '0');
  var minutes = currentTime.getMinutes().toString().padStart(2, '0');

  // Create the message
  var message = "GAME STARTED AT " + hours + ":" + minutes;

  // Append the message to the #messages div
  $("#messages").append("<div class='simple'>" + message + "</div>");

  $(
    "#boardgame, #suggestion, #avatar, #dice-roll, #secret-passage, #secret-passage, #detective-notes, #cards, #chat"
  ).css("display", "flex");
  initializePlayerPositions();
  if (music) $("#spooky-sound")[0].play();
  playing = "spooky";
}

function changeAvatar(slug) {
  let name;
  playersOfLobby.forEach(function (player) {
    if (player["character"] == slug) name = player["name"];
  });
  $(".avatar-picture").hide();

  $("#" + slug + "-avatar").show();
  $("#avatar-name").text(name);
  $("#avatar").css("background-color", colors[slug]);
  if (slug == "mrs-white") {
    $("#avatar-name").css("color", "#474747");
  } else {
    $("#avatar-name").css("color", "#FFFFFF");
  }
}

function movePlayer(direction) {
  $.ajax({
    url: "/move/",
    type: "POST",
    data: {
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
      direction: direction,
    },
    success: function (response) {
      console.log(response);
    },
    error: function (xhr, status, error) {
      console.error("Error generating code and creating game:", error);
    },
  });
}

function playerMovedTo(playerID, id) {
  let slug;
  playersOfLobby.forEach(function (player) {
    if (player["id"] == playerID) slug = player["character"];
  });
  position("#" + slug, "#" + id);
  players[slug] = id;
  if (
    chosenPlayer == rotation[turn] &&
    rooms.hasOwnProperty(players[rotation[turn]])
  ) {
    toggleOpacity("#suggestion", "1", "pointer");
  } else {
    toggleOpacity("#suggestion", "0.6", "default");
  }

  if (
    chosenPlayer == rotation[turn] &&
    secretPassages.hasOwnProperty(players[rotation[turn]])
  ) {
    toggleOpacity("#secret-passage", "1", "pointer");
  } else {
    toggleOpacity("#secret-passage", "0.6", "default");
  }
  highlightPossibleMoves(id);
  moves--;
  $("#moves").text(moves);
  if (moves == 0) {
    if (!rooms.hasOwnProperty(players[rotation[turn]])) {
      changeTurn();
    } else {
      $("#moves").hide();
      $("#dice-roll").css("cursor", "pointer");
      $("#dice-text").text("END TURN");
    }
  }
}


function initializePlayerPositions() {
  console.log(rotation)
  for (const slug in characters) {
    position("#" + slug, ".start." + slug);
    console.log(rotation.includes(slug));
    if (!rotation.includes(slug)) {
      $("#" + slug).hide();
    } else {
      $("#" + slug).show();
    }
  }
}

function toggleOpacity(selector, opacity, cursor) {
  $(selector).css({
    opacity: opacity,
    cursor: cursor,
  });
}