function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event){
  if (!event.target.matches(".dropbtn")){
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (var i = 0; i < dropdowns.length; i++) {
      dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show")
      }
    }
  }
}
