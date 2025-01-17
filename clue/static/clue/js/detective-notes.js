$(document).ready(function() {
    $("#collapse").click(function() {
        if (music) $("#pop-sound")[0].play();
        collapseDetectiveNotes();
    });

    $("#expand").click(function() {
        if (music) $("#pop-sound")[0].play();
        expandDetectiveNotes();
    });

    $(".checkbox").click(function() {
        var ID = $(this).find("rect").eq(1).attr("id");
        markDetectiveNotes(ID.replace("-checkbox",""), "#000000");
    });
    
})

function markDetectiveNotes(id, color) {
    if (color == "#000000") {
        if ($(`#${id}-checkbox`).css('fill')) {
            if ($(`#${id}-checkbox`).css('fill') == "rgb(0, 0, 0)" || $(`#${id}-checkbox`).css('fill') == "#000000") {
                $(`#${id}-checkbox`).css("fill", "");
                $(`#${id}-checkbox`).siblings('rect').css('stroke', "");
                $(`#${id}-checkbox`).show();
            }
        } else {
            $(`#${id}-checkbox`).css("fill", color);
            $(`#${id}-checkbox`).siblings('rect').css('stroke', color);
            $(`#${id}-checkbox`).show();
        }
    } else {

    }
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