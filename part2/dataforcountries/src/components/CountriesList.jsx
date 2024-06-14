import React,{useState} from "react";
import CountryData from "./CountryData";
const CountriesList=({result})=>{
    const[show,setShow]=useState(false)
    const handleShowClick=()=>{
        setShow(show=>!show)
    }
    return(
        <li>
            {result?.name.common} <button
            onClick={handleShowClick}>
                show
            </button>
            {show && <CountryData  result={result} />}
        </li>
    )
}

export default CountriesList;