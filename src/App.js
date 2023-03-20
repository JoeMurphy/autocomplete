import React, { useEffect, useState } from 'react';
import Keyword from "./Keyword";
//import logo from './logo.svg';
//https://www.youtube.com/watch?v=U9T6YkEDkMo&t=2837s&ab_channel=developedbyed
import './App.css';

const App = () => {
  const [keywords, setKeywords] = useState([]);
  const [search, setSearch] = useState('');
  const [query,setQuery] = useState("chicken")

  useEffect(() =>{
    getKeywords();
  }, [query]);

  async function getKeywords() {
      const response = await fetch(`https://www.walmart.com/typeahead/v3/complete?term=${query}`
      );
      const data = await response.json();
      setKeywords(data.queries);
      console.log(data.queries);
    };

    const updateSearch = e => {
      setSearch(e.target.value);
    };

    const getSearch = e => {
      e.preventDefault();
      setQuery(search);
    }

    return (
      <div classname="App">
        <form onSubmit={getSearch} className="search-form">
          <input className="search-bar" type="text" value={search} onChange={updateSearch}/>
          <button className="search-button" type="submit">
            Search
          </button>
        </form>
          <div className='results'>
            <h3>Walmart</h3>
            {keywords.map(keyword =>(
                <Keyword title={keyword.displayName}/>
            ))}
           </div>
      </div>
    );
};

export default App;
