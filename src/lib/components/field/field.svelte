<script lang="ts" module>
  import { fieldVariants, type FieldOrientation } from "./variants";
  export { fieldVariants, type FieldOrientation };
</script>
<script lang="ts">
  import { cn, type WithElementRef } from "../../vendor/utils";
  import type { HTMLAttributes } from "svelte/elements";
  let {
    ref = $bindable(null),
    class: className,
    orientation = "vertical",
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    orientation?: FieldOrientation;
  } = $props();
</script>
<div
  bind:this={ref}
  role="group"
  data-slot="field"
  data-orientation={orientation}
  class={cn(fieldVariants({ orientation }), className)}
  {...restProps}
>
  {@render children?.()}
</div>