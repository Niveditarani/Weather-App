
/******************************forecast table***********************************/
function openForecast(evt, tabName){
    //declare all variables
    var i, tabcontent, tablinks;

//get all elements with class="tabcontent" & hide them
tabcontent = document.getElementsByClassName("tabcontent");
for(i=0; i<tabcontent.length; i++){
    tabcontent[i].style.display = "none";
}
//get all elements with class="tablinks" & remove the class "active"
tablinks = document.getElementsByClassName("tablinks");
for(i=0; i<tablinks.length; i++){
    tablinks[i].className = tablinks[i].className.replace(" active", "");
}
//show the current tab & add an "active" class to the button that opened the tab
document.getElementById(tabName).style.display = "block";
evt.currentTarget.className += " active";
}
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
