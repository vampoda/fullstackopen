
import React from 'react';
import CountriesList from './CountriesList';
import CountryData from './CountryData';

const CountrySearch = ({ country, result }) => {
    let filtered = [];

    if (country.length > 0) {
        filtered = result.filter(item =>
            item.name.common.toLowerCase().includes(country.toLowerCase())
        );
    } else {
        filtered = result;
    }

    if (filtered.length > 10) {
        return <p>Too many matches, specify another filter</p>;
    } else if (filtered.length === 1) {
        return filtered.map(item => <CountryData key={item.name.common} result={item} />);
    } else {
        return filtered.map(item => <CountriesList key={item.name.common} result={item} />);
    }
};

export default CountrySearch;
