<script>
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";

	export let labels = [];
	export let datasets = [];
	export let type = "bar";
	export let options = {};
	export let height = "max(33vh, 320px)";

	let chart = null;
	let canvasEl = null;

	$: if (chart) {
		chart.data.labels = labels;
		chart.data.datasets = datasets;
		chart.update("none");
	}

	onMount(() => {
		Chart.defaults.font.family = getComputedStyle(document.documentElement).getPropertyValue("--font-ui");
		Chart.defaults.font.size = 16;
		chart = new Chart(canvasEl, {
			type: type,
			options: {
				elements: {
					point: {
						radius: 6,
						hoverRadius: 8,
					},
				},
				maintainAspectRatio: false,
				scales: {
					x: {
						offset: labels.length > 1 ? undefined : true,
					},
					y: {
						beginAtZero: true,
					},
				},
				plugins: {
					legend: {
						onClick: null,
					},
				},
				...options,
			},
		});
	});
</script>

<div class="chart" style:height>
	<canvas bind:this={canvasEl} />
</div>

<style>
	.chart {
		position: relative;
	}

	canvas {
		width: 100%;
	}
</style>
