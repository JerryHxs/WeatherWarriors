/* location-search.js
Interacts with the GeoNames API to help find location names based on input
in the search bar of the location finder window.
*/

const geonamesId = "rvishwajith";

function findLocationNames(input) {
    const queryURL = "http://api.geonames.org/searchJSON" +
        "?q=" + input +
        "?name_startsWith=" + input +
        "?continentCode=NA" +
        "?username=" + geonamesId;
    
    fetch(queryURL, {}).then(response => {
        // Handle Fetch response here.
        console.log(response);
        return response;
    }).catch(error => {
        // If there's an error, handle it here
        console.log("Error in findLocationNames().");
    });
};

findLocationNames("nashvil");