var turn = "miss-scarlet";

const board = {
    1: {
        "DOWN": "2",
        "RIGHT": "4",
        "LEFT": "163"
    }
    , 2: {
        "UP": "1",
        "DOWN": "3",
        "RIGHT": "5",
        "LEFT": "164"
    }
    , 3: {
        "UP": "2",
        "RIGHT": "6",
        "LEFT": "165"
    }
    , 4: {
        "LEFT": "1",
        "DOWN": "5",
        "RIGHT":"7",
        "UP": "dining-room"
    }
    , 5: {
        "LEFT": "2",
        "UP": "4",
        "DOWN": "6",
        "RIGHT": "8"
    }
    , 6: {
        "LEFT": "3",
        "UP": "5",
        "RIGHT": "9",
        "DOWN": "lounge"
    }
    , 7: ["4", "8", "118"]
    , 8: ["5", "7", "9", "21"]
    , 9: {"LEFT": "6", "UP": "8", "DOWN": "10", "RIGHT": "20"}
    , 10: {
        "UP": "9",
        "DOWN": "11",
        "RIGHT": "19"
    }
    , 11: {
        "UP": "10",
        "DOWN": "12",
        "RIGHT": "18"
    }
    , 12: {
        "UP": "11",
        "DOWN": "13",
        "RIGHT": "17"
    }
    , 13: {
        "UP": "12",
        "DOWN": "14",
        "RIGHT": "16"
    }
    , 14: {
        "UP": "13",
        "RIGHT": "15",
        "DOWN": "miss-scarlet-start"
    }
    , 15: {
        "LEFT": "14",
        "UP": "16"
    }
    , 16: {
        "LEFT": "13",
        "DOWN": "15",
        "UP": "17"

    }
    , 17: {
        "LEFT": "12",
        "DOWN": "16",
        "UP": "18"
    }
    , 18: {
        "LEFT": "11",
        "DOWN": "17",
        "UP": "19"
    }
    , 19: {
        "LEFT": "10",
        "DOWN": "18",
        "UP": "20"
    }
    , 20: {
        "LEFT":"9",
        "DOWN": "19",
        "UP": "21"
    }
    , 21: ["8", "20", "22", "118"]
    , 22: ["21", "23", "154"]
    , 23: ["22", "24"]
    , 24: ["23", "25", "hall"]
    , 25: ["24", "26"]
    , 26: ["25", "27"]
    , 27: ["26", "28"]
    , 28: ["27", "29", "48", "73"]
    , 29: ["28", "30", "74"]
    , 30: ["29", "31", "75"]
    , 31: ["30", "32", "76"]
    , 32: ["31", "33", "77"]
    , 33: ["32", "34", "92"]
    , 34: ["33", "35", "78"]
    , 35: ["34", "36", "79"]
    , 36: ["35", "37", "47", "80"]
    , 37: ["36", "38", "81"]
    , 38: ["37", "39", "47"]
    , 39: ["38", "40", "46", "ballroom"]
    , 40: ["39", "41", "45"]
    , 41: ["40", "42", "44"]
    , 42: ["41", "43", "162", "ballroom"]
    , 43: ["42", "44", "161"]
    , 44: ["41", "43", "45", "assumption"]
    , 45: ["40", "44", "46", "assumption"]
    , 46: ["39", "45", "47", "assumption"]
    , 47: ["36", "38", "46"]
    , 48: ["28", "49", "71"]
    , 49: ["48", "50", "70"]
    , 50: ["49", "51", "57"]
    , 51: ["50", "52", "56"]
    , 52: ["51", "53", "55"]
    , 53: ["52", "54"]
    , 54: ["53", "55"]
    , 55: ["52", "54", "56"]
    , 56: ["51", "55", "57"]
    , 57: ["50", "56", "58", "70"]
    , 58: ["57", "59", "69", "study"]
    , 59: ["58", "60", "68"]
    , 60: ["59", "61", "67"]
    , 61: ["60", "62", "66"]
    , 62: ["61", "63", "65"]
    , 63: ["62", "64"]
    , 64: ["63", "65", "professor-plum-start"]
    , 65: ["62", "64", "66"]
    , 66: ["61", "65", "67"]
    , 67: ["60", "66", "68"]
    , 68: ["59", "67", "69"]
    , 69: ["58", "68", "70", "72"]
    , 70: ["49", "57", "69", "71"]
    , 71: ["48", "70", "72", "73"]
    , 72: ["69", "71"]
    , 73: ["28", "71", "74"]
    , 74: ["29", "73", "75", "library"]
    , 75: ["30", "74", "76"]
    , 76: ["31", "75", "77", "117"]
    , 77: ["32", "76", "92", "93"]
    , 78: ["34", "79", "92", "95"]
    , 79: ["35", "78", "80", "96"]
    , 80: ["36", "79", "81", "97"]
    , 81: ["37", "80", "82", "98"]
    , 82: ["81", "83", "99"]
    , 83: ["82", "84", "110", "ballroom"]
    , 84: ["83", "85", "111"]
    , 85: ["84", "86", "88"]
    , 86: ["85", "87", "89"]
    , 87: ["86", "88"]
    , 88: ["85", "87", "111"]
    , 89: ["86", "90"]
    , 90: ["89", "91"]
    , 91: ["90", "mr-green-start"]
    , 92: ["33", "77", "78", "94"]
    , 93: ["77", "94", "112", "117"]
    , 94: ["92", "93", "95"]
    , 95: ["78", "94", "96"]
    , 96: ["79", "95", "97"]
    , 97: ["80", "96", "98", "billiard-room"]
    , 98: ["81", "97", "99"]
    , 99: ["82", "98", "100", "110"]
    , 100: ["99", "101", "109"]
    , 101: ["100", "102", "108"]
    , 102: ["101", "103", "107"]
    , 103: ["102", "104", "106"]
    , 104: ["103", "105", "mrs-peacock-start"]
    , 105: ["104", "106"]
    , 106: ["103", "105", "107"]
    , 107: ["102", "106", "108"]
    , 108: ["101", "107", "109"]
    , 109: ["100", "108", "110", "conservatory"]
    , 110: ["83", "99", "109", "111"]
    , 111: ["84", "88", "110"]
    , 112: ["93", "133"]
    , 113: ["112", "114"]
    , 114: ["113", "115"]
    , 115: ["114", "116", "billiard-room"]
    , 116: ["115"]
    , 117: ["76", "93"]
    , 118: ["7", "21", "119", "154"]
    , 119: ["118", "120", "155"]
    , 120: ["119", "121", "156"]
    , 121: ["120", "122", "157"]
    , 122: ["121", "123", "158", "dining-room"]
    , 123: ["122", "124", "159"]
    , 124: ["123", "125", "160"]
    , 125: ["124", "126", "129", "161"]
    , 126: ["125", "127", "130"]
    , 127: ["126", "128", "131"]
    , 128: ["127", "132"]
    , 129: ["125", "130", "162"]
    , 130: ["126", "129", "131", "152"]
    , 131: ["127", "130", "132", "141"]
    , 132: ["128", "131", "133", "140"]
    , 133: ["132", "134", "139"]
    , 134: ["133", "135", "138"]
    , 135: ["134", "136"]
    , 136: ["135", "137", "138"]
    , 137: ["136"]
    , 138: ["134", "136", "139"]
    , 139: ["133", "138", "140"]
    , 140: ["132", "139", "141", "kitchen"]
    , 141: ["131", "140", "142", "152"]
    , 142: ["141", "143", "153"]
    , 143: ["142", "144", "151"]
    , 144: ["143", "145", "150"]
    , 145: ["144", "146"]
    , 146: ["145", "147", "150"]
    , 147: ["146", "148"]
    , 148: ["147", "149"]
    , 149: ["148", "mrs-white-start"]
    , 150: ["144", "146", "151"]
    , 151: ["143", "150", "153"]
    , 152: ["130", "141", "153"]
    , 153: ["142", "151", "152", "ballroom"]
    , 154: ["22", "118", "155"]
    , 155: ["119", "154", "156"]
    , 156: ["120", "155", "157"]
    , 157: ["121", "156", "158"]
    , 158: ["122", "157", "159"]
    , 159: ["123", "158", "160"]
    , 160: ["124", "159", "161"]
    , 161: ["43", "125", "160", "162"]
    , 162: ["42", "129", "161"]
    , 163: ["1", "164", "166"]
    , 164: ["2", "163", "165", "167"]
    , 165: ["3", "164", "168"]
    , 166: ["163", "167", "169"]
    , 167: ["164", "166", "168", "170"]
    , 168: ["165", "167", "171"]
    , 169: ["166", "170", "172"]
    , 170: ["167", "169", "171", "173"]
    , 171: ["168", "170", "174"]
    , 172: ["169", "173"]
    , 173: ["170", "172", "174", "colonel-mustard-start"]
    , 174: ["171", "173"]
    , "mrs-white-start": ["149"]
    , "mr-green-start": ["91"]
    , "mrs-peacock-start": ["104"]
    , "professor-plum-start": ["64"]
    , "miss-scarlet-start": {
        "UP": "14"
    }
    , "colonel-mustard-start": ["173"]
    , "study": ["58"]
    , "lounge": {
        "UP": "6"
    }
    , "library": ["74"]
    , "kitchen": ["140"]
    , "dining-room": {
        "DOWN": "4",
        "RIGHT": "122"
    }
    , "assumption": ["44", "45", "46"]
    , "conservatory": ["109"]
    , "billiard-room": ["97", "115"]
    , "ballroom": ["39", "42", "83", "153"]
    , "hall": ["24"]
}

const characters = {
    "miss-scarlet": "Miss Scarlet",
    "mrs-white": "Mrs. White",
    "mrs-peacock": "Mrs. Peacock",
    "colonel-mustard": "Colonel Mustard",
    "professor-plum": "Professor Plum",
    "mr-green": "Mr. Green",
}

const colors = {
    "miss-scarlet": "#872427",
    "mrs-white": "#FFFFFF",
    "mrs-peacock": "#1A9D9F",
    "colonel-mustard": "#C5A12F",
    "professor-plum": "#6C3C89",
    "mr-green": "#618547",
}

const players = {
    "miss-scarlet": "miss-scarlet-start",
    "mrs-white": "mrs-white-start",
    "mrs-peacock": "mrs-peacock-start",
    "colonel-mustard": "colonel-mustard-start",
    "professor-plum": "professor-plum-start",
    "mr-green": "mr-green-start",
}

let previous = 0;
$(document).ready(function () {

    highlightPossibleMoves("miss-scarlet-start")

    for (const slug in characters) {
        // console.log(slug);
        initialize(slug);
    }

    $(document).keydown(function(event) {
        switch(event.which) {
            case 37: // left arrow key
                move(turn, "LEFT");
                // Add your code here
                break;
            case 38: // up arrow key
                move(turn, "UP");
                // Add your code here
                break;
            case 39: // right arrow key
                move(turn, "RIGHT");
                // Add your code here
                break;
            case 40: // down arrow key
                move(turn, "DOWN");
                // Add your code here
                break;
            default:
                return; // exit this handler for other keys
        }
        event.preventDefault(); // prevent the default action (scroll / move caret)
    });    

    $(".choose-player").click(function (event) {
        if (!$(this).hasClass("player-already-taken")) {
            if ($(this).hasClass("my-chosen-player")) {
                $(".choose-player").removeClass("my-chosen-player");
            } else {
                $(".choose-player").removeClass("my-chosen-player");
                $(this).addClass("my-chosen-player");
            }
        }
    })

    $(".choose-player").hover(
        function (event) {
            let slug = $(this).attr("id").replace("choose-", "");

            let text = "Choose " + characters[slug];
            if ($(this).hasClass("player-already-taken")) {
                let player = $(this).data("player");
                text = player + " has chosen " + characters[slug];
            }
            let color = slug == "mrs-white" ? "#474747" : "#FFFFFF";
            var tooltip = $('<div class="tooltip" style="background-color:' + colors[slug] + '; color:' + color + '">' + text + '</div>');
            $("body").append(tooltip);
            tooltip.css({ top: event.pageY - tooltip.outerHeight() - 10, left: event.pageX + 10 }).fadeIn("fast");
        },
        function () {
            $(".tooltip").remove();
        }
    );

    $(".choose-player").mousemove(function (event) {
        $(".tooltip").css({ top: event.pageY - $(".tooltip").outerHeight() - 10, left: event.pageX + 10 });
    });
});

function initialize(slug) {
    var $startElement = $(".start." + slug);
    var $playerElement = $("#" + slug);

    var parentOffset = $startElement.parent().offset();
    var startOffset = $startElement.offset();
    var startWidth = $startElement.outerWidth();
    var startHeight = $startElement.outerHeight();

    var playerWidth = $playerElement.outerWidth();
    var playerHeight = $playerElement.outerHeight();

    var topPosition = startOffset.top - parentOffset.top + (startHeight / 2) - (playerHeight / 2);
    var leftPosition = startOffset.left - parentOffset.left + (startWidth / 2) - (playerWidth / 2);
    topPosition += 18;
    leftPosition += 18;
    $playerElement.css({
        top: topPosition + 'px',
        left: leftPosition + 'px'
    });
}

function move(player, direction) {
    if (board[players[player]].hasOwnProperty(direction)) {
        let id = board[players[player]][direction];
        position(player, id)
        players[player] = id;
        highlightPossibleMoves(id);
    } else {
        console.log("Can't go " + direction.toLowerCase());
    }
}

function position(player, tile) {
    const rooms = {
        "study": {
            width: 359.83,
            height: 231.12
        }, 
        "lounge": {
            width: 358.8,
            height: 337.29
        },
        "library": {
            width: 387.48,
            height: 237.27
        },
        "kitchen": {
            width: 306.57,
            height: 316.13
        },
        "dining-room": {
            width: 442.44,
            height: 351.29
        },
        "assumption": {
            width: 232.15,
            height: 348.22
        },
        "conservatory": {
            width: 307.93,
            height: 264.92
        },
        "billiard-room": {
            width: 319.54,
            height: 249.56
        },
        "ballroom": {
            width: 411.03,
            height: 299.4
        },
        "hall": {
            width: 289.5,
            height: 369.38
        }
    }

    const startingPositions = {
        "mrs-white-start": true
        , "mr-green-start": true
        , "mrs-peacock-start": true
        , "professor-plum-start": true
        , "miss-scarlet-start": true
        , "colonel-mustard-start": true
    }

    var $tileElement = $("#" + tile);
    var $playerElement = $("#" + player);

    var parentOffset = $tileElement.parent().offset();
    var startOffset = $tileElement.offset();
    var startWidth = $tileElement.outerWidth();
    var startHeight = $tileElement.outerHeight();

    var playerWidth = $playerElement.outerWidth();
    var playerHeight = $playerElement.outerHeight();

    var topPosition = startOffset.top - parentOffset.top + (startHeight / 2) - (playerHeight / 2);
    var leftPosition = startOffset.left - parentOffset.left + (startWidth / 2) - (playerWidth / 2);

    if (rooms.hasOwnProperty(tile)) {
        console.log("Room")
        console.log("Height: " + $tileElement.height())
        console.log("Width: " + $tileElement.width())
        topPosition += rooms[tile]["height"] / 2;
        leftPosition += rooms[tile]["width"] / 2;
    } else if (startingPositions.hasOwnProperty(tile)) {
        console.log("not number")
        topPosition += 18;
        leftPosition += 18;
    } else {
        topPosition -= 8;
        leftPosition -= 8;
        console.log("number")
    }
    
    $playerElement.css({
        top: topPosition + 'px',
        left: leftPosition + 'px'
    });
}

function highlightPossibleMoves(id) {
    console.log("ID: " + id);
    const possibleMoves = board[id];
    console.log(possibleMoves);
    for (let i = 0; i < possibleMoves.length; i++) {
        $("#" + possibleMoves[i]).css({
            "stroke": "yellow",
            "stroke-width": "8px",
            "stroke-dasharray": "12"
        });
    }
}
