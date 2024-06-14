import React, { useState,useEffect } from "react";
import axios from "axios";
import WeatherData from  "./WeatherData";

const CountryData=({result})=>{

const keys=Object.keys(result.languages)
 const[weather,setWeather]=useState(null)

useEffect(()=>{
    const api_key = import.meta.env.VITE_api_key
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${result.capital[0]}&appid=${api_key}`).then(response=>{
        setWeather(response.data)
        console.log(response.data)
    }).catch(err=>console.log(err))

    
}
,[result.capital]
)
return(
    <>
    <div>
<h1>{result.name.common}</h1>
<p>{result.capital[0]}</p>
<p>{result.area}</p>
<h3>Languages:</h3>
<ul>
    {keys.map(key=><li key={key}>{result.languages[key]}

    </li>)}
</ul>
<img src={result.flags.png} alt="flags" height="200" width="300" />
    </div>

<WeatherData weather={weather}></WeatherData>
</>
)

}

export default CountryData;