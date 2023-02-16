<script>
	export let name;
	export let text;
</script>

<div id="background">
	<p id="name">{name}</p>
	<p id="text">{text}</p>
</div>

<style>
	#background{
		background-color: white;
	}
	p{
		color: black;
		padding-left: 3%;
	}
	#name{
		font-weight: bold;
		background-color: #26ba89;
	}
</style>
