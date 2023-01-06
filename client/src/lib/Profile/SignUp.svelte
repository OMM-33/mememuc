<script>
	import { user } from "../../stores.js";

	let userValue;
	let email;
	let password;
	let confirmPassword;
	let username;

	const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

	user.subscribe((value) => (userValue = value));

	function handleUser(u, username, email, password){
		u.username = username;
		u.email = email;
		u.password = password;
		return u;
	}

	function handleSignUp() {
		if (!username){
			alert("please enter your username");
			return;
		}
		if (!email) {
			alert("please enter your Email");
			return;
		}
		if (!(email.match(validEmail))) {
			alert("please enter valid Email");
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
		user.update((u) => handleUser(u, username, email, password));
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
	<input class="form-field" type="text" bind:value={username} placeholder="Username" />
	<br />
	<input class="form-field" type="email" bind:value={email} placeholder="Email" />
	<br />
	<input class="form-field" type="password" bind:value={password} placeholder="Password" />
	<br />
	<input class="form-field" type="password" bind:value={confirmPassword} placeholder="Confirm password" />
	<br />
	<button class="form-field" on:click={handleSignUp}>Sign up</button>
</form>
<p>
	Already have an account?
	<a class="link" href="#/login">Login</a>
</p>
