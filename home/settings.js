
$(document).on('click', '.tab', function() {
  
  if($(this).data("page") == "keys") {
    $(".table-wrapper").load("home/keys.php");
  }
  
});





