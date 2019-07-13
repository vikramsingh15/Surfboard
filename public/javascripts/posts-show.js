mapboxgl.accessToken = mapboxToken;
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center:post.geometry.coordinates,
  zoom: 4
});



  // create a HTML element for each feature
  var el = document.createElement('div');
  el.className = 'marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el)
    .setLngLat(post.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + post.title + '</h3><p>' +post.location + '</p>'))

    .addTo(map);

/*toggle form*/
    const toggle=document.querySelectorAll(".toggle");
    toggle.forEach((toggle)=>{
        toggle.addEventListener("click",()=>{
          toggle.value==="Edit"?toggle.value="Cancel":toggle.value="Edit"
          toggle.nextElementSibling.classList.toggle("toggle-form")
        });
    })
    
