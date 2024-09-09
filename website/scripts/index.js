/* index.js
Handles functions unique to index.html such as
the location finder window.
*/

const locationFinderElem = document.getElementById("location-finder");

// When the "Add a location" button is clicked, this
// function makes the location finder window visible.
function openLocationFinder() {
    locationFinderElem.style.visibility = "visible";
    // alert("openLocationFinder() called.");
}

// When the "X"/close button in the location finder
// window is pressed, this function is called to hide
// the window.
function closeLocationFinder() {
    locationFinderElem.style.visibility = "hidden";
    // alert("closeLocationFinder() called.");
}