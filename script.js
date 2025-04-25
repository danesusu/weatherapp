const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.seach-btn');

const apiKey = '9ab02c1e482ed1f77c28387358ead6ad'


const notFoundSelection = document.querySelector('.not-found');
const searchCitySelection = document.querySelector('.search-city');
const weatherInfoSelection = document.querySelector('.weather-info');
const cityText = document.querySelector('.city-txt');
const conditionText = document.querySelector('.condition-txt');
const humidityText = document.querySelector('.humidity-value-txt');
const tempText = document.querySelector('.temp-txt');
const windText = document.querySelector('.wind-value-txt');
const weatherSumeryImg = document.querySelector('.weather-summery-img');
const currentDateText = document.querySelector('.current-date-txt');

//counntry and time
const countryText = document.querySelector('.country-txt');
const clockText = document.querySelector('.current-time-txt');

//tojtoj
const forecastItemContainer = document.querySelector('.forecast-item-container');



searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim()!= '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
})
cityInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter' && cityInput.value.trim()!= '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
})
async function getFetchData(endPoint ,city) {
    const apiUrl =`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

function getweatherIconId(id) {
    if(id<=232 ) {
        return 'thunderstorm.svg';
    }else if(id<=321 )  {
            return 'drizzle.svg';

    }else if(id<=531 ){
            return 'rain.svg';
  }else if (id<=622 ){
            return 'snow.svg';
    }else if (id<=781 ){
            return 'atmosphere.svg' ; 
        }else if (id<=800 ){
            return 'clear.svg';
        }else{
            return 'clouds.svg';
        }
    }
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    if (weatherData.cod !=200) {
        showDisplaySelection(notFoundSelection);
        return;
    }
    function getcurrentDate() {
        const currentDate = new Date();
        const options = { weekday: 'short', month: 'short', day: '2-digit' };
        return currentDate.toLocaleDateString('en-GB', options);
    }
    // function getcurrentDate
    forecastItemContainer.innerHTML = '' ; 
    const {

        name: countryName,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed},
        sys: {country: countryCode},
    } = weatherData

    cityText.textContent = countryName;
    countryText.textContent = countryCode;
    clockText.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    tempText.textContent = Math.round(temp) + '°C';
    conditionText.textContent = main;
    humidityText.textContent = humidity + '%';
    windText.textContent = Math.round(speed) + 'km/h';
    currentDateText.textContent = getcurrentDate();
    
    weatherSumeryImg.src =`assets/weather/${getweatherIconId(id)}`;
    // weathertojtoj
    await updateForecastInfo(city)

    showDisplaySelection(weatherInfoSelection);
}
// functio weathertojtoj
async function updateForecastInfo(city){
    const forecastData = await getFetchData('forecast', city);
    const itemTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    
    forecastData.list.forEach(forecastweather=> {  
        if(forecastweather.dt_txt.includes(itemTaken) && !forecastweather.dt_txt.includes(todayDate)) {
            updateForecastInfoItem(forecastweather);
        }
    } )
}
// function updateForecastInfoItem
function updateForecastInfoItem(weatherData){
    console.log(weatherData)
    const{
        dt_txt:date,
        weather: [{id}],
        main: {temp},
    }= weatherData

    const dateTaken = new Date(date)
    const dateOption = { month: 'short', day: '2-digit'}
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);

    const forecastItem = `
    <div class="forecast-item">
        <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
        <img src="assets/weather/${getweatherIconId(id)}"  class="forecast-item-img">
        <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
    </div>
    
    `
    forecastItemContainer.insertAdjacentHTML('beforeend', forecastItem)
} 

function showDisplaySelection(selection) {
  [searchCitySelection,weatherInfoSelection,notFoundSelection]
  .forEach((section =>section.style.display = 'none'))
    selection.style.display = 'flex';
}