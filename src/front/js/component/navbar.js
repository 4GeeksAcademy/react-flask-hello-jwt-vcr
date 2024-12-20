import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/navbar.css";

export const Navbar = () => {
	const { store, actions } = useContext(Context);

	return (
		<nav className="navbar">
			<div className="container">
				<Link to="/" className="navbar-brand">
					React Boilerplate
				</Link>

				<div className="btn-group">
					{ !store.token ? (
						<>
							<Link to="/login">
								<button className="btn btn-login">Log in</button>
							</Link>

							<Link to="/register">
								<button className="btn btn-register">Register</button>
							</Link>
						</>
					) : (
						<button onClick={() => actions.logout()} className="btn btn-logout">Log out</button>
					)}
				</div>
			</div>
		</nav>
	);
};
