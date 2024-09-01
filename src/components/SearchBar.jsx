import React from "react";
import "./searchbar.css"
    
function SearchBar({ setSearchTerm }) {
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <input type="text" placeholder="Search Contacts" onChange={handleSearch} />
  );
}

export default SearchBar;
