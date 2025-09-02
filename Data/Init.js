    

document.addEventListener("DOMContentLoaded", function () {
    
    requireAjax("/aow4db/Data/src/settings.js", function () {
         requireAjax("/aow4db/Data/Search.js", function () {
              requireAjax("/aow4db/Data/Faction.js", function () {
          
      });
          
      });
          
      });
      
       
  
  // Load header
  fetch("/aow4db/HTML/header.html")
    .then((res) => res.text())
    .then((html) => {
       document.body.insertAdjacentHTML("afterbegin", html);
      
      
      requireAjax("/aow4db/Data/Builder.js", function () {
   
           CheckData();
  });
    
    });


    
  
 
});

 function requireAjax(file, callback) {
     
   
     
  jQuery.getScript(file, callback);
}


