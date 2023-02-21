<script>
	import Button from "../Button.svelte";
	import Error from "../Error.svelte";
	import { push } from "svelte-spa-router";

	let userValue;
	let email;
	let password;
	let confirmPassword;
	let username;
	let isRegistered = false;
	let error = null;

	async function handleSignUp() {
		if (!username){
			alert("please enter your username");
			return;
		}
		if (!password){
			alert("please enter your password");
			return;
		}
		if (!confirmPassword){
			alert("please enter your password again");
			return;
		}
		if (password !== confirmPassword){
			alert("passwords must be same");
			return;
		}

		const response = await fetch("/api/signUp",
			{
				method: "POST",
				body: JSON.stringify({ user: username, pw: password }),
				headers: {
					"content-type": "multipart/form-data",
				},
			});

		if (!response.ok) {
			error = (await response.json()).message;
			return;
		}

		const json = await response.json();

		isRegistered = JSON.stringify(json);

		if (json.success){
			await push("#/login");
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
	<input class="form-field" data-sc="Enter username" type="text" bind:value={username} placeholder="Username" />
	<br />
	<input class="form-field" data-sc="Enter password" type="password" bind:value={password} placeholder="Password" />
	<br />
	<input class="form-field" data-sc="Confirm password" type="password" bind:value={confirmPassword} placeholder="Confirm password" />
	<br />
	<Button class="form-field" data-sc="Sign up" variant="primary" on:click={handleSignUp}>Sign up</Button>
</form>
<p>
	Already have an account?
	<a class="link" data-sc="login" href="#/login">Login</a>
</p>
