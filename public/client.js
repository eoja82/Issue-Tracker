function showSearch() {
  let x = document.getElementById("searchBox");
  x.style.display === "none" ? x.style.display = "block" : x.style.display = "none";
  x.style.display === "block" ?
    document.getElementById("showSearch").innerHTML = "Hide Search" :
    document.getElementById("showsearch").innerHTML = "Search"; 
}