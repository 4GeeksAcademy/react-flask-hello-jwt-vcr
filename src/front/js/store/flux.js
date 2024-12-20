const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			/**
			 * Example function to change color
			 */
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			syncTokenFromSessionStore: async () => {
				const token = sessionStorage.getItem("token");
				console.log("Application just loaded, synching the session storage token");
			
				if (token && token != "" && token != undefined) {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/validate-token`, {
						method: 'POST',
						headers: { "Authorization": `Bearer ${token}` }
					});
			
					if (!resp.ok) {
						console.log("Token inválido. Redirecionando para a home.");
						setStore({ token: null });
						sessionStorage.removeItem("token");
					} else {
						console.log("Token válido.");
						setStore({ token });
					}
				}
			},
			

			logout: () => {
				sessionStorage.removeItem("token");
				console.log("Logging out");
				setStore({ token: null });
			},

			register: async (email, password) => {
				const opts = {
					method: 'POST',
					headers: { 
						"Content-Type": "application/json" 
					},
					body: JSON.stringify({ email, password }) 
				};
			
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/register`, opts);
					
					if (!resp.ok) {
						const errorMessage = await resp.json();
						console.error("Register error:", errorMessage);
						alert("There has been an error: " + (errorMessage.msg || 'Unknown error'));
						return false;
					}
					
					const data = await resp.json();
					console.log("This came from the backend", data);
					
					if (data.access_token) {
						sessionStorage.setItem("token", data.access_token);
						setStore({ token: data.access_token });
						return true;
					} else {
						console.error("No access token received");
						alert("Error: No access token received");
						return false;
					}
			
				} catch (error) {
					console.error("There has been an error registering", error);
					alert("Network error: Could not connect to server");
					return false;
				}
			},
			

			login: async (email, password) => {
				const BACKEND_URL = process.env.BACKEND_URL;
				
				const opts = {
					method: 'POST',
					headers: { 
						"Content-Type": "application/json" 
					},
					body: JSON.stringify({ email, password }) 
				};

				try {
					const resp = await fetch(`${BACKEND_URL}/api/token`, opts);
					
					if (!resp.ok) {
						const errorMessage = await resp.json();
						console.error("Login error:", errorMessage);
						alert("There has been some error: " + (errorMessage.message || 'Unknown error'));
						return false;
					}
					
					const data = await resp.json();
					console.log("This came from the backend", data);
					
					if (data.access_token) {
						sessionStorage.setItem("token", data.access_token);
						setStore({ token: data.access_token });
						return true;
					} else {
						console.error("No access token received");
						alert("Error: No access token received");
						return false;
					}

				} catch (error) {
					console.error("There has been an error logging in", error);
					alert("Network error: Could not connect to server");
					return false;
				}
			},

			/**
			 * Get message from backend
			 */
			getMessage: () => {
				const store = getStore();
				const opts = {
					headers: {
						"Authorization": "Bearer " + store.token
					}
				};
				// fetching data from the backend
				fetch("https://symmetrical-pancake-4jq4jqgp4w74cjvrx-3001.app.github.dev/api/hello", opts)
					.then(resp => resp.json())
					.then(data => setStore({ message: data.message }))
					.catch(error => console.log("Error loading message from backend", error));
			},
			changeColor: (index, color) => {
				const store = getStore();

				const updatedDemo = store.demo.map((element, i) => {
					if (i === index) {
						return { ...element, background: color };
					}
					return element;
				});

				setStore({ demo: updatedDemo });
			}
		}
	};
};

export default getState;
