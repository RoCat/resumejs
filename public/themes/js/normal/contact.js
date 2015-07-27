$(function() {
  $("#displayContact").on("click", function(){
    $("#displayContact").css('visibility',"hidden");
    $("#presentation_contact_shortcuts").css('right',"5vw");
  });
  $("#presentation_summary").on("click", function(){
    setTimeout(function(){
      $("#displayContact").css('visibility',"visible");
    }, 1000);
    $("#presentation_contact_shortcuts").css('right',"-10vw");
  });
});