import React from 'react';
import '../../assets/styles/SearchBar.css';

const SearchBar = ({ searchTerm, setSearchTerm, placeholder = "이름으로 검색..." }) => {
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="search-bar-container">
            <span className="search-icon">🔍</span>
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
            {searchTerm && (
                <button
                    onClick={() => setSearchTerm('')}
                    className="clear-button"
                >
                    ✕
                </button>
            )}
        </div>
    );
}

export default SearchBar; 