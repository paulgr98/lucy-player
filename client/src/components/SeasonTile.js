import React from 'react';
import { useTheme } from '../context/ThemeContext';

const SeasonTile = ({ seasonNumber, episodeCount, onClick }) => {
    const { darkMode } = useTheme();

    return (
        <div
            onClick={onClick}
            className={`card ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}
            style={{
                width: '18rem',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                border: darkMode ? '1px solid #6c757d' : '1px solid #dee2e6',
                margin: '0.5rem',
                boxShadow: darkMode ? '0 0 10px rgba(255,255,255,0.1)' : '0 0 10px rgba(0,0,0,0.1)'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
            <div className="card-body text-center">
                <h2 className="card-title">Season {seasonNumber}</h2>
                <p className="card-text">{episodeCount} Episodes</p>
            </div>
        </div>
    );
};

export default SeasonTile;
