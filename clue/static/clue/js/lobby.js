$(document).ready(function () {
  $("#code-input > input").on("input", function () {
    var inputVal = $(this).val();
    if (inputVal) {
      $("#action-button-inner").text("JOIN GAME");
    } else {
      $("#action-button-inner").text("CREATE GAME");
    }
  });
});
