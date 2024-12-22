import React, { useEffect, useState } from "react";
import { ThemeProvider, useTheme } from './context/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Components
import Navbar from "./components/navbar";
import EpisodeList from "./components/episodeList";

const MainContent = () => {
    const [selectedSeason, setSelectedSeason] = useState(null);
    const { darkMode } = useTheme();
    
    useEffect(() => {
        document.body.className = darkMode ? 'bg-dark text-light' : 'bg-light text-dark';
    }, [darkMode]);

    return (
        <div className={`min-vh-100 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            <Navbar setSelectedSeason={setSelectedSeason} />
            <EpisodeList selectedSeason={selectedSeason} setSelectedSeason={setSelectedSeason} />
        </div>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <MainContent />
        </ThemeProvider>
    );
};

export default App;
