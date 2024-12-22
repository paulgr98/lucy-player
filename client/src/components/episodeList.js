import React, { useEffect, useState } from "react";
import { useTheme } from '../context/ThemeContext';
import SeasonTile from './SeasonTile';
import EpisodeTile from './EpisodeTile';


export default function EpisodeList({ selectedSeason, setSelectedSeason }) {
    const [episodes, setEpisodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { darkMode } = useTheme();

    useEffect(() => {
        async function getEpisodes() {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/episode/`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch episodes. Status: ${response.status}`);
                }
                const episodes = await response.json();
                setEpisodes(episodes);
            } catch (error) {
                console.log('Detailed Error:', error);
                setError(`Connection failed: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
        getEpisodes();
    }, []);

    if (error) {
        return (
            <div className="container mt-4">
                <div className={`alert ${darkMode ? 'alert-danger bg-dark border border-danger' : 'alert-danger'}`} style={{ color: darkMode ? '#ff8080' : '' }} role="alert">
                    {error}
                </div>
            </div>
        );
    }

    const seasonGroups = episodes.reduce((groups, episode) => {
        const season = episode.season;
        if (!groups[season]) {
            groups[season] = [];
        }
        groups[season].push(episode);
        groups[season].sort((a, b) => a.episode - b.episode);
        return groups;
    }, {});

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className={`spinner-border ${darkMode ? 'text-light' : 'text-dark'}`} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {selectedSeason ? (
                <>
                    <div className="d-flex align-items-center mb-4">
                        <button
                            className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'} me-3`}
                            onClick={() => setSelectedSeason(null)}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Back to Seasons
                        </button>
                        <h2 className="m-0">Season {selectedSeason}</h2>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        {seasonGroups[selectedSeason].map((episode) => (
                            <EpisodeTile key={episode._id} episode={episode} />
                        ))}
                    </div>
                </>
            ) : (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    {Object.keys(seasonGroups)
                        .sort((a, b) => Number(a) - Number(b))
                        .map((season) => (
                            <SeasonTile
                                key={season}
                                seasonNumber={season}
                                episodeCount={seasonGroups[season].length}
                                onClick={() => setSelectedSeason(season)}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}
