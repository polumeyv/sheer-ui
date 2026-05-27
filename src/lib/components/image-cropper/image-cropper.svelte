<script lang="ts">
	import * as Dialog from '@polumeyv/ui/dialog';
	import { Button } from '@polumeyv/ui/button';
	import { Slider } from '@polumeyv/ui/slider';
	import Upload from '@lucide/svelte/icons/upload';
	import { draggable } from '../../hooks';

	interface Props {
		open?: boolean;
		aspectRatio?: number;
		outputSize?: number;
		initialImage?: string | null;
		onSave?: (dataUrl: string) => void;
		onCancel?: () => void;
	}

	let { open = $bindable(false), aspectRatio = 1, outputSize = 256, initialImage = null, onSave, onCancel }: Props = $props();

	let fileInput = $state<HTMLInputElement | null>(null);
	let imageUrl = $state<string | null>(null);
	let zoom = $state(1);
	let position = $state({ x: 0, y: 0 });
	let containerSize = $state({ width: 300, height: 300 });

	// Load initial image when dialog opens
	$effect(() => {
		if (open && initialImage && !imageUrl) imageUrl = initialImage;
	});

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (ev) => {
			imageUrl = ev.target?.result as string;
			position = { x: 0, y: 0 };
			zoom = 1;
		};
		reader.readAsDataURL(file);
	}

	function cropAndSave() {
		if (!imageUrl) return;

		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = outputSize;
			canvas.height = outputSize / aspectRatio;
			const ctx = canvas.getContext('2d')!;

			// Image is displayed at containerSize.width, scaled by zoom, centered
			const displayedWidth = containerSize.width * zoom;
			const displayedHeight = ((containerSize.width * img.height) / img.width) * zoom;

			const containerCenterX = containerSize.width / 2;
			const containerCenterY = containerSize.height / 2;

			const imgCenterX = containerCenterX + position.x;
			const imgCenterY = containerCenterY + position.y;

			const imgLeft = imgCenterX - displayedWidth / 2;
			const imgTop = imgCenterY - displayedHeight / 2;

			const visibleLeft = 0 - imgLeft;
			const visibleTop = 0 - imgTop;

			const scaleX = img.width / displayedWidth;
			const scaleY = img.height / displayedHeight;

			const cropX = visibleLeft * scaleX;
			const cropY = visibleTop * scaleY;
			const cropWidth = containerSize.width * scaleX;
			const cropHeight = containerSize.height * scaleY;

			ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);

			const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
			onSave?.(dataUrl);
			close();
		};
		img.src = imageUrl;
	}

	function close() {
		open = false;
		imageUrl = null;
		position = { x: 0, y: 0 };
		zoom = 1;
	}

	function handleCancel() {
		onCancel?.();
		close();
	}
</script>

<Dialog.Root bind:open onOpenChange={(o) => !o && close()}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Upload Photo</Dialog.Title>
			<Dialog.Description>Choose an image and adjust the crop area</Dialog.Description>
		</Dialog.Header>

		<div class="py-4 space-y-4">
			{#if !imageUrl}
				<!-- File picker -->
				<button
					type="button"
					class="size-64 aspect-square border-2 border-dashed rounded-full flex flex-col items-center justify-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer mx-auto"
					onclick={() => fileInput?.click()}>
					<Upload class="size-10 text-muted-foreground" />
					<span class="text-sm text-muted-foreground">Click to select image</span>
				</button>
			{:else}
				<!-- Crop area -->
				<div
					class="relative size-64 mx-auto rounded-full overflow-hidden bg-muted border-2 border-border cursor-move"
					bind:clientWidth={containerSize.width}
					bind:clientHeight={containerSize.height}
					role="application"
					aria-label="Drag to reposition image"
					{@attach draggable(
						() => position,
						(p) => (position = p),
					)}>
					<img
						src={imageUrl}
						alt="Preview"
						class="absolute pointer-events-none select-none left-1/2 top-1/2"
						style="
							transform: translate(calc(-50% + {position.x}px), calc(-50% + {position.y}px)) scale({zoom});
							transform-origin: center center;
							max-width: none;
							width: {containerSize.width}px;
							height: auto;
						"
						draggable="false" />
				</div>

				<!-- Zoom control -->
				<div class="flex items-center gap-3 px-4">
					<span class="text-xs text-muted-foreground">Zoom</span>
					<Slider
						type="multiple"
						value={[zoom]}
						min={1}
						max={3}
						step={0.1}
						class="flex-1"
						onValueChange={(v: number[]) => {
							if (v[0] != null) zoom = v[0];
						}} />
					<span class="text-xs text-muted-foreground w-8">{zoom.toFixed(1)}x</span>
				</div>

				<!-- Change image -->
				<button type="button" class="text-sm text-primary hover:underline mx-auto block" onclick={() => fileInput?.click()}> Choose different image </button>
			{/if}

			<!-- Always mounted so "Choose different image" works after an image is loaded -->
			<input bind:this={fileInput} type="file" accept="image/*" class="hidden" onchange={handleFileSelect} />
		</div>

		<Dialog.Footer>
			<Button variant="ghost" onclick={handleCancel}>Cancel</Button>
			<Button onclick={cropAndSave} disabled={!imageUrl}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
