<script>



	export let upvotes = 12;
	export let views = 3;
	export let comments = 2;
	export let image;
</script>
<div class="container">
	<div style:background-image="url('{image}')" class="image" />
	<div class="info"><span>⬆️{upvotes} </span><span class="middle">👁️{views}</span><span class="right">🗨️ {comments}</span>
	</div>
</div>

<style>
        .container{
            width: 100%;
            margin-top:0px;
            margin-bottom: 20%;

        }
        span{
            padding-left: 10%;
            padding-right: 10%;
            padding-top: 3%;
        }
        .info{
            display: flex;
            justify-content: center;
            width: 100%;
        }
        .image{
            width:20vw;
            height: 32vh;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            background-color: #F2F9F2;
            border: 1px solid black;

        }

</style>
