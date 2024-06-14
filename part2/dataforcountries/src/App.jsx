import { useState,useEffect } from "react";

import CountrySearch from "./components/CountrySearch";
import axios from "axios"
const App=()=>{
  
  const[country, setCountry] = useState("")
  const[result, setResult] = useState([])

useEffect(()=>{
  axios.get("https://studies.cs.helsinki.fi/restcountries/api/all").then(response=>{
    setResult(response.data)
  }).catch(err=>console.log(err))
},[])

const api_key = import.meta.env.VITE_api_key
console.log(api_key)
const handleCountryChnage=(event)=>{
  setCountry(event.target.value)

}

return(
  <div>
    <form >
      Find countries <input value={country} onChange={handleCountryChnage} />


    </form>
  <CountrySearch key={result.id} result={result}
  country={country}>

  </CountrySearch>
  
  </div>
)
}

export default App;