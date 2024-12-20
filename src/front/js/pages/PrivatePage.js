import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";
import "../../styles/privatePage.css";

export const PrivatePage = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.token) {
            navigate('/');
        }
    }, [store.token]);

    return (
        <div className="private-page">
            <div className="container">
                <h1>Welcome to the Private Page!</h1>
                <p>This page is only accessible to authenticated users.</p>
            </div>
        </div>
    );
};
