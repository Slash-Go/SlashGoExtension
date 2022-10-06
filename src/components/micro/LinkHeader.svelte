<script lang="ts">
  export let value;
  export let label;

  export let choice;
  export let updateChoice;
</script>

<div
  class={`${
    choice === value
      ? "text-white bg-red-500  cursor-default font-semibold"
      : "hover:text-red-600 hover:underline hover:underline-offset-4 hover:cursor-pointer pr-4"
  } px-4 py-2 `}
  on:click={() => updateChoice(value)}
>
  {label}
</div>
