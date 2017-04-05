$(document).ready(function(){
  var mouse = { x: -1, y: -1 };
  
  $(document).mousemove(function(event) {
      mouse.x = event.pageX;
      mouse.y = event.pageY;
      
      if(mouse.x > $(document).width()/2){
        $('.king').removeClass('face-left');
        $('.king').addClass('face-right');
      }else{
        $('.king').removeClass('face-right');
        $('.king').addClass('face-left');
      }
    });

});
