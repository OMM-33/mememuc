<script>
	import Button from "../Button.svelte";
	import Error from "../Error.svelte";

	let username;
	let password;
	let isLoggedIn = false;
	let error = null;

	async function handleLogin() {
		if (!username) {
			alert("please enter your username");
			return;
		}
		if (!password){
			alert("please enter your password");
			return;
		}

		const response = await fetch("/api/login",
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

		isLoggedIn = JSON.stringify(json);

		if (json.success){
			window.location.href = "#/user";
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
	<Button class="form-field" data-sc="login" variant="primary" on:click={() => handleLogin}>Login</Button>
</form>
<p>
	Don't have an account?
	<a class="link" data-sc="sign up" href="#/signup">Sign Up</a>
</p>
