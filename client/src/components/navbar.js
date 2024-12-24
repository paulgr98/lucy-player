import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ setSelectedSeason }) {
    const { darkMode, toggleDarkMode } = useTheme();

    const openRandomEpisode = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/episode/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_API_KEY
                },
                mode: 'cors',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch episodes');
            }
            const episodes = await response.json();
            if (episodes.length === 0) {
                throw new Error('No episodes available');
            }
            const randomEpisode = episodes[Math.floor(Math.random() * episodes.length)];
            window.open(randomEpisode.uri, '_blank');
        } catch (error) {
            console.log('Error getting random episode:', error);
        }
    };

    const handleHomeClick = () => {
        setSelectedSeason(null);
    };

    return (
        <div>
            <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
                <div className="container-fluid">
                    <div className="d-flex align-items-center">
                        <div
                            className="navbar-brand me-4"
                            onClick={handleHomeClick}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                style={{
                                    "width": "7vw",
                                    "maxWidth": "150px",
                                    "minWidth": "100px",
                                    "height": "auto"
                                }}
                                src={process.env.PUBLIC_URL + (darkMode ? '/logo_dark.png' : '/logo_light.png')}
                                alt="logo"
                            />
                        </div>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button
                                    onClick={handleHomeClick}
                                    className={`nav-link ${darkMode ? 'text-light' : 'text-dark'}`}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <i className="bi bi-collection-play me-1"></i>
                                    Seasons
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    data-random-button
                                    onClick={openRandomEpisode}
                                    className={`nav-link ${darkMode ? 'text-light' : 'text-dark'}`}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <i className="bi bi-shuffle me-1"></i>
                                    Random
                                </button>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={toggleDarkMode}
                        className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'} rounded-circle`}
                        style={{
                            transition: 'all 0.3s ease',
                            transform: darkMode ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                    >
                        <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon'}`}></i>
                    </button>
                </div>
            </nav>
        </div>
    );
}
