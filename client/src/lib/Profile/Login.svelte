<script>
	import Button from "../Button.svelte";
	import { push } from "svelte-spa-router";
	import { buildURL } from "../../api.js";
	import { jwt } from "../../auth.js";

	let username;
	let password;

	async function handleLogin() {
		if (!username) {
			alert("please enter your username");
			return;
		}
		if (!password){
			alert("please enter your password");
			return;
		}

		const res = await fetch(buildURL("/api/user/login"), {
			headers: { "Content-Type": "application/json" },
			method: "POST",
			body: JSON.stringify({ name: username, password: password }),
		});
		if (res.ok){
			jwt.set(await res.json());
			alert("Your login has been successfully completed.");
			await push("#/user");
		} else {
			alert("A problem occurred during login. please try again");
			throw new Error(`${res.status} (${res.statusText}): ${await res.text()}`);
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

<form method="post">
	<input class="form-field" type="text" bind:value={username} placeholder="Username" />
	<br />
	<input class="form-field" type="password" bind:value={password} placeholder="Password" />
	<br />
	<Button class="form-field" data-sc="Login" variant="primary" on:click={handleLogin}>Login</Button>
</form>
<p>
	Don't have an account?
	<a class="link" data-sc="sign up" href="#/signup">Sign Up</a>
</p>
