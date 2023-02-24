<script>
	import Button from "../Button.svelte";
	import { push } from "svelte-spa-router";
	import { buildURL, jsonHeaders } from "../../api.js";
	import Error from "../Error.svelte";

	let password;
	let confirmPassword;
	let name;

	let error = null;
	const onError = detail => error = detail;

	async function handleSignUp() {
		if (!name){
			onError("Please enter your username.");
			return;
		}
		if (!password){
			onError("Please enter your password.");
			return;
		}
		if (!confirmPassword){
			onError("Please enter your password again.");
			return;
		}
		if (password !== confirmPassword){
			onError("Passwords must be the same.");
			return;
		}

		const res = await fetch(buildURL("/api/user/register"), {
			headers: jsonHeaders,
			method: "POST",
			body: JSON.stringify({ name: name, password: password }),
		});
		if (res.ok) {
			alert("Your registration has been successfully completed. Please log in to continue.");
			await push("#/login");
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
	<input class="form-field" data-sc="Enter username" type="text" bind:value={name} placeholder="Username" />
	<br />
	<input class="form-field" data-sc="Enter password" type="password" bind:value={password} placeholder="Password" />
	<br />
	<input class="form-field" data-sc="Confirm password" type="password" bind:value={confirmPassword} placeholder="Confirm password" />
	<br />
	<Button data-sc="Sign up" variant="primary" on:click={handleSignUp}>Sign up</Button>
</form>
<p>
	Already have an account?
	<a class="link" data-sc="login" href="#/login">Login</a>
</p>
