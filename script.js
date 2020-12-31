setInterval(() => {
  var now = moment();
  var viewTime = now.format("dddd, MMMM Do YYYY");
  clock.textContent = viewTime;
}, 1000);

$(document).ready(function () {
  $("#form-sub").submit(function (event) {
    performSearch(event);
  });
});

function performSearch(event) {
  var request;
  event.preventDefault();
  $("#city-name").text("Searching ...");
  $("#city-temp").text("");
  $("img").attr('src', "");
  $("#city-weather").text("");

  // Send the request
  request = $.ajax({
    url: 'https://api.openweathermap.org/data/2.5/weather',
    type: "GET",
    data: {
      q: $("#city").val(),
      appid: '8277073365ce9c599a53449cd47d6225',
      units: 'metric'
    }
  });

  // Callback handler for success
  request.done(function (response) {
    formatSearchResults(response);
  });

  // Callback handler for failure
  request.fail(function () {
    $("#city-name").text("Please try again, incorrect input!");
    $("#city-temp").text("");
    $("img").attr('src', "");
    $("#city-weather").text("");
  });

}
updateSearch();
function updateSearch(city_name) {
  searchList = localStorage.getItem("searchlist");
  searchList = searchList == null ? "" : searchList;
  searchList = searchList.split(",");
  if (city_name)
    searchList.push(city_name);
  $("#search").html("");
  searchList.forEach(element => {
    $("#search").append("<p class='serchitem'>" + element + "</p>");
  });

  searchList = searchList.join(",");
  localStorage.setItem("searchlist", searchList);
}

function formatSearchResults(jsonObject) {
  var city_name = jsonObject.name;
  updateSearch(city_name);
  city_name = city_name + ", " + jsonObject.sys.country;
  var city_weather = jsonObject.weather[0].main;
  var city_temp = jsonObject.main.temp;
  var imgurl = 'http://openweathermap.org/img/wn/' + jsonObject.weather[0].icon + '.png';
  $("#we_img").attr('src', imgurl);
  var now = moment();
  var viewTime = now.format("MM/DD/YY");
  $("#city-name").text(city_name + "( " + viewTime + ")");
  $("#temperature").text("Temperature : " + (city_temp * (9 / 5) + 32) + " °F");
  $('#hum').text("Humidity : " + jsonObject.main.humidity + "%");
  $("#wind").text("Wind Speed : " + jsonObject.wind.speed + " MPH");

  request = $.ajax({
    url: 'https://api.openweathermap.org/data/2.5/uvi/forecast',
    type: "GET",
    data: {
      lat: jsonObject.coord.lat,
      appid: '8277073365ce9c599a53449cd47d6225',
      lon: jsonObject.coord.lon
    }
  });
  request.done(function (res) {

    $("#uv1").text("UV Index : ");
    col = "green";
    if (res[0].value > 1) {
      col = "red";
    }
    $("#uv2").text(res[0].value);
    $("#uv2").css("background", col);


    request = $.ajax({
      url: 'https://api.openweathermap.org/data/2.5/forecast',
      type: "GET",
      data: {
        q: $("#city").val(),
        appid: '8277073365ce9c599a53449cd47d6225',
        units: 'metric'
      }
    });
    request.done(function (response) {
      $("#fivedayforecast").html("");
      $("#fivedayforecast").append("<h2>Five Day Forecast</h2>");
      let resp = response.list;
      console.log(resp)
      for (let i = 0; i < resp.length; i += 8) {
        let d = moment.unix(resp[i].dt).format("MM/DD/YY");
        $("#fivedayforecast").append("<div class='we-tile'><h2>" + d + "</h2><span>Temperature : " + Math.round((resp[i].main.temp * (9 / 5) + 32)) + " °F </span><br><span>Humidity : " + resp[i].main.humidity + "%</span> </div>");
      }
    });
  });

}