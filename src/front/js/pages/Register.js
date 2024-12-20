import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/register.css";

export const Register = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); 
    const navigate = useNavigate();

    const handleClick = async () => {
        const success = await actions.register(email, password);
        if (!success) {
            setErrorMessage("Error registering new user");
        } else {
            navigate('/private');
        }
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <h2 className="register-title">Create an Account</h2>
                {store.token && store.token !== "" && store.token !== undefined ? (
                    <p className="register-message">You are already registered with this token: {store.token}</p>
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

                        <button onClick={handleClick} type="button" className="btn btn-register">
                            Register
                        </button>

                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </>
                )}
            </div>
        </div>
    );
};