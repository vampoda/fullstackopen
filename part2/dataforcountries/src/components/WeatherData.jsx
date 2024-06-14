import React from "react"
const WeatherData=({weather})=>{

    if(!weather){
        return null
    }
    const{capital,main,weather:weatherData,wind}=weather;
    return(
        <div>
            <h2>{`Weather in ${capital}`}</h2>
            <p>{`Temperature: ${(main.temp-173.5).toFixed(2)} celsius`}</p>
        <img src={`http://openweathermap.org/img/win${weatherData[0].icon}@2x.ping`} alt="" />
    <p>{`wind:${wind.speed} m/s`}</p>

        </div>
    )
}

export default WeatherData