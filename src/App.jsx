import { useState } from "react";
import "./App.css";

import checkEqualPassword from "./utils/CheckEqualPassword";

function App() {
	return (
		<div className="Main-container">
			<div className="Card-container">
				<Information />
				<CreateUser />
			</div>
		</div>
	);
}

const Information = () => {
	return (
		<div className="Card Blue-gradient">
			<h2 className="Title">Informasjon</h2>
			<p className="Paragraph">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Maecenas a lectus ut enim aliquam porta. Nulla et eros ac velit
				sagittis lacinia non vel sem.
			</p>
			<p className="Paragraph">
				<span className="Bold">Donec eu augue est. </span>
				Quisque ut urna quis dolor commodo aliquam sed in nibh. Quisque
				sit amet vulputate elit. Aliquam nec est ut mi dignissim tempor
				a eu massa. Vivamus porta finibus velit, at sagittis elit
				hendrerit vitae. Sed laoreet sapien augue, eget rhoncus risus
				mollis et.
			</p>
			<button className="Button">Jeg har konto</button>
		</div>
	);
};

const CreateUser = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [identicalPass, setIdenticalPass] = useState(true);
	const [missingFields, setMissingFields] = useState(false);

	return (
		<div className="Card Card-gap">
			<h2 className="Title Blue">Opprett bruker</h2>
			<div className="Form-container">
				<div className="Column">
					<label htmlFor="firstname" className="Label">
						Fornavn
					</label>
					<input
						type="text"
						id="firstname"
						name="firstname"
						className="Input"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
					/>
				</div>
				<div className="Column">
					<label htmlFor="lastname" className="Label">
						Etternavn
					</label>
					<input
						type="text"
						id="lastname"
						name="lastname"
						className="Input"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
					/>
				</div>
			</div>
			<div className="Form-container">
				<div className="Column">
					<label htmlFor="email" className="Label">
						E-postadresse
					</label>
					<input
						type="text"
						id="email"
						name="email"
						className={
							!(missingFields && email === "") ? "Input" : "Input Input-wrong"
						}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
			</div>
			<div className="Form-container">
				<div className="Column">
					<label htmlFor="password" className="Label">
						Passord
					</label>
					<input
						type="password"
						id="password"
						name="password"
						className={
							!((missingFields && password === "") || !identicalPass) ? "Input" : "Input Input-wrong"
						}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{!identicalPass && (
						<label className="Input-wrong-text">Feil passord</label>
					)}
				</div>
				<div className="Column">
					<label htmlFor="password-repeat" className="Label">
						Gjenta passord
					</label>
					<input
						type="password"
						id="password-repeat"
						name="password-repeat"
						className={
							!((missingFields && repeatPassword === "") || !identicalPass) ? "Input" : "Input Input-wrong"
						}
						value={repeatPassword}
						onChange={(e) => setRepeatPassword(e.target.value)}
					/>
				</div>
			</div>
			<div className="Checkbox-container">
				<label htmlFor="policy" className="Bold">
					Jeg godtar <a href="/">Databehandlingsavtalen</a>
				</label>
				<input
					type="checkbox"
					id="policy"
					name="policy"
					className="Input Checkbox"
				/>
			</div>
			<button
				className="Button Blue-gradient Text-white"
				onClick={() =>
					RegisterUser(
						firstName,
						lastName,
						email,
						password,
						repeatPassword,
						setIdenticalPass,
						setMissingFields
					)
				}
			>
				Registrer
			</button>
		</div>
	);
};

// register a user to the backend database
async function RegisterUser(
	firstName,
	lastName,
	email,
	password,
	repeatPassword,
	setIdenticalPass,
	setMissingFields
) {
	// check that email and passwords are not empty
	if (email === "" || password === "") {
		setMissingFields(true);
		if (!checkEqualPassword(password, repeatPassword)) {
			setIdenticalPass(false);
			return;
		}
		setIdenticalPass(true);
		return;
	}
	setMissingFields(false);

	// check that the passwords are not different
	if (!checkEqualPassword(password, repeatPassword)) {
		setIdenticalPass(false);
		return;
	}
	setIdenticalPass(true);

	console.log("trying to register user...")

	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			firstName: firstName,
			lastName: lastName,
			email: email,
			secret: password,
		}),
	};

	// does a post request to register the user with the credentials in the form fields.
	fetch("https://localhost:8080/register", requestOptions)
		.then(async (response) => {
			const isJson = response.headers
				.get("content-type")
				?.includes("application/json");
			const data = isJson && (await response.json());

			// check for error response 4xx and 5xx
			if (!response.ok) {
				// get error message from body or default to response status
				const error = (data && data.message) || response.status;
				return Promise.reject(error);
			}

			console.log("Registered user successfully!");
		})
		.catch((error) => {
			console.error("There was an error!", error);
		});
}

export default App;
