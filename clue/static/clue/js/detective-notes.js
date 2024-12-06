$(document).ready(function() {
    $("#collapse").click(function() {
        if (music) $("#pop-sound")[0].play();
        collapseDetectiveNotes();
    });

    $("#expand").click(function() {
        if (music) $("#pop-sound")[0].play();
        expandDetectiveNotes();
    });
})

function markDetectiveNotes(id, color) {
    if (color == "#FFFFFF") {
        color = "#474747"
    }
    $(`#${id}-checkbox`).css("fill", color);
    $(`#${id}-checkbox`).siblings('rect').css('stroke', color);
    $(`#${id}-checkbox`).show();
}

function collapseDetectiveNotes() {
    $("#folders, #detective-note-logo").fadeOut();
    // slide to the right until the width is only 30px
    $("#detective-notes").animate({ width: "30px" }, 300);
    $("#collapse").hide();
    $("#expand").show();
}

function expandDetectiveNotes() {
    // slide to the right until the width is only 30px
    $("#detective-notes").animate({ width: "300px" }, 300);
    $("#folders, #detective-note-logo").fadeIn();
    $("#collapse").show();
    $("#expand").hide();
}