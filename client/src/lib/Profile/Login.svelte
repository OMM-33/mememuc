<script>
	import { user } from "../../stores.js";

	let userValue;
	let email;
	let password;

	user.subscribe((value) => (userValue = value));

	function handleUser(u, email, password){
		u.email = email;
		u.password = password;
		return u;
	}

	function handleLogin() {
		if (!email) {
			alert("please enter your Email");
			return;
		}
		if (!password){
			alert("please enter your password");
			return;
		}
		user.update((u) => handleUser(u, email, password));
	}

	$: console.log(userValue);
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

	button{
		background-color: #26B784;
		color: white;
		font-size: 15px;
		font-weight: bold;
		width: 30%;
		padding: 20px 20px;
		margin: 8px 0;
		box-sizing: border-box;
		border: 2px solid #26B784;
		border-radius: 4px;
		cursor: pointer;
	}

	a {
		color: #26B784;
		font-weight: bold;
	}
</style>

<form>
	<input class="form-field" type="email" bind:value={email} placeholder="Email" />
	<br />
	<input class="form-field" type="password" bind:value={password} placeholder="Password" />
	<br />
	<button class="form-field" on:click={handleLogin}>Login</button>
</form>
<p>
	Don't have an account?
	<a class="link" href="#/signup">Sign Up</a>
</p>
