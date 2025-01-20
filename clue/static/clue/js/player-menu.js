function createPlayerMenu() {
    let $playersInGame = $("#players-in-game");
    $playersInGame.empty();
    playersOfLobby.forEach(function(player , index) {
        const character = player.character;
        const color = colors[character];
        const opacity = index == 0 ? "1" : "0.6";
        const $playerInGame = $("<div>", {
            class: "player-in-game",
            id: "player-" + character
        }).append(
            $("<div>", {
                class: "character-display",
            }).append(
                $("<div>", {
                    class: "character-container"
                }).append(
                    $("<img>", {
                        class: "player-menu-avatar",
                        src: staticUrl + `images/Avatars/${character}.jpg`
                    })
                )
            ).css("background-color", color),
            $("<div>", {
                class: "character-name-and-turn"
            }).append(
                $("<div>", {
                    class: "character-name",
                }).text(player.name).css("color", color)
            )
        ).css("opacity", opacity);

        $playersInGame.append($playerInGame);
    }); 
}