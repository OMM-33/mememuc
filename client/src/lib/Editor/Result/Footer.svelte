<script>
	import prettyBytes from "pretty-bytes";
	import { mimeToFileType } from "../../../util";

	export let type;
	export let size;
</script>

<div class="metadata">
	<div class="filetype">
		🖼️ {type && mimeToFileType(type)}
	</div>
	<div class="size">
		💾 {size && prettyBytes(size)}
	</div>
</div>

<style>
	.metadata {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		gap: 1.5em;
	}
</style>
