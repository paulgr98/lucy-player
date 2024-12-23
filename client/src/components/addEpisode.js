import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useTheme } from '../context/ThemeContext';

export default function Add() {
    const [form, setForm] = useState({
        title: "",
        season: 0,
        episode: 0,
        uri: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { darkMode } = useTheme();

    function validateForm() {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = 'Title is required';
        if (form.season < 1) newErrors.season = 'Season must be greater than 0';
        if (form.episode < 1) newErrors.episode = 'Episode must be greater than 0';
        if (!form.uri.trim()) newErrors.uri = 'URL is required';
        if (!form.uri.match(/^https?:\/\/.+/)) newErrors.uri = 'Invalid URL format';
        return newErrors;
    }

    function updateForm(value) {
        setForm((prev) => {
            return { ...prev, ...value };
        });
        // Clear errors when user starts typing
        setErrors({});
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError(null);
        
        // Validate form
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsSubmitting(true);

        const newEpisode = {
            title: form.title,
            season: Number(form.season),
            episode: Number(form.episode),
            uri: form.uri
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/episode/add`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_API_KEY
                },
                body: JSON.stringify(newEpisode),
                mode: 'cors',
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('Failed to add episode');
            }
            
            setForm({ title: "", season: 0, episode: 0, uri: "" });
            navigate("/");
        } catch (error) {
            console.log('Error adding episode:', error);
            setError('Failed to add episode. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="d-flex align-items-center mb-4">
                        <button
                            className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'} me-3`}
                            onClick={() => navigate('/')}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Back
                        </button>
                        <h3 className="m-0">Add New Episode</h3>
                    </div>

                    {error && (
                        <div 
                            className={`alert ${darkMode ? 'alert-danger bg-dark border border-danger' : 'alert-danger'}`} 
                            style={{ color: darkMode ? '#ff8080' : '' }}
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className={`card ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}>
                        <div className="card-body">
                            <div className="form-group mb-3">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''} ${errors.title ? 'is-invalid' : ''}`}
                                    id="title"
                                    value={form.title}
                                    onChange={(e) => updateForm({ title: e.target.value })}
                                />
                                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="season">Season</label>
                                    <input
                                        type="number"
                                        className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''} ${errors.season ? 'is-invalid' : ''}`}
                                        id="season"
                                        value={form.season}
                                        onChange={(e) => updateForm({ season: e.target.value })}
                                    />
                                    {errors.season && <div className="invalid-feedback">{errors.season}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="episode">Episode</label>
                                    <input
                                        type="number"
                                        className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''} ${errors.episode ? 'is-invalid' : ''}`}
                                        id="episode"
                                        value={form.episode}
                                        onChange={(e) => updateForm({ episode: e.target.value })}
                                    />
                                    {errors.episode && <div className="invalid-feedback">{errors.episode}</div>}
                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="uri">URL Link</label>
                                <input
                                    type="text"
                                    className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''} ${errors.uri ? 'is-invalid' : ''}`}
                                    id="uri"
                                    value={form.uri}
                                    onChange={(e) => updateForm({ uri: e.target.value })}
                                />
                                {errors.uri && <div className="invalid-feedback">{errors.uri}</div>}
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className={`btn ${darkMode ? 'btn-outline-light' : 'btn-primary'} px-4`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <><span className="spinner-border spinner-border-sm me-2" /> Saving...</>
                                    ) : (
                                        <><i className="bi bi-plus-circle me-2"></i>Add Episode</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
