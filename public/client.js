function showSearch() {
  let x = document.getElementById("searchBox");
  x.style.display === "none" ? x.style.display = "flex" : x.style.display = "none";
  x.style.display === "flex" ?
    document.getElementById("showSearch").innerHTML = "Hide Search" :
    document.getElementById("showSearch").innerHTML = "Search"; 
}