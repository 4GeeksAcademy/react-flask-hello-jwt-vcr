import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/login.css";

export const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (store.token && store.token !== "" && store.token !== undefined) {
            console.log("Token exists, navigating to /private");
            navigate("/private");
        }
    }, [store.token]);

    const handleClick = async () => {
        const success = await actions.login(email, password);
        console.log(success);
        if (!success) {
            setErrorMessage("Error logging in");
        } else {
            navigate('/private');
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <h2 className="login-title">Sign In</h2>
                {store.token && store.token !== "" && store.token !== undefined ? (
                    <p className="login-message">You are logged in with this token: {store.token}</p>
                ) : (
                    <>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                name="email"
                                id="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button onClick={handleClick} type="button" className="btn btn-login">Login</button>

                        <button type="button" onClick={() => navigate('/register')} className="btn btn-register">
                            Register
                        </button>

                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </>
                )}
            </div>
        </div>
    );
};