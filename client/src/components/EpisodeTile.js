import { useTheme } from '../context/ThemeContext';

const EpisodeTile = ({ episode }) => {
    const { darkMode } = useTheme();

    const handleEpisodeClick = (e) => {
        e.preventDefault();
        const secureUri = episode.uri.replace('http://', 'https://');
        window.open(secureUri, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <div
                className={`card ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}
                style={{
                    width: '18rem',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    border: darkMode ? '1px solid #6c757d' : '1px solid #dee2e6',
                    margin: '0.5rem',
                    boxShadow: darkMode ? '0 0 10px rgba(255,255,255,0.1)' : '0 0 10px rgba(0,0,0,0.1)'
                }}
            >
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                        <div role="button" onClick={handleEpisodeClick}>
                            <h5 className="card-title">{episode.title}</h5>
                            <p className="card-text">Episode {episode.episode}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EpisodeTile;
