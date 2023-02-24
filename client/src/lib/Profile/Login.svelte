<script>
	import Button from "../Button.svelte";
	import { push } from "svelte-spa-router";
	import { buildURL } from "../../api.js";
	import { loginUser } from "../../auth.js";
	import Error from "../Error.svelte";

	let username;
	let password;

	let error = null;
	const onError = detail => error = detail;

	async function handleLogin() {
		if (!username) {
			onError("Please enter your username.");
			return;
		}
		if (!password){
			onError("Please enter your password.");
			return;
		}

		const res = await fetch(buildURL("/api/user/login"), {
			headers: { "Content-Type": "application/json" },
			method: "POST",
			body: JSON.stringify({ name: username, password: password }),
		});
		if (res.ok){
			const { token: jwt, userId: id, userName: name } = await res.json();
			loginUser({ jwt, id, name });
			await push("#/user");
		} else {
			onError(`${await res.text()}` + ". Please try again.");
		}
	}
</script>

<style>
	input {
		width: 30%;
		padding: 20px 20px;
		margin: 8px 0;
		box-sizing: border-box;
		border: 2px solid #ccc;
		border-radius: 4px;
		font-size: 15px;
	}

	a {
		color: #26B784;
		font-weight: bold;
	}
</style>

<Error {error} />
<form method="post">
	<input class="form-field" type="text" bind:value={username} placeholder="Username" />
	<br />
	<input class="form-field" type="password" bind:value={password} placeholder="Password" />
	<br />
	<Button variant="primary" data-sc="Login"  on:click={handleLogin}>Login</Button>
</form>
<p>
	Don't have an account?
	<a class="link" data-sc="sign up" href="#/signup">Sign Up</a>
</p>
