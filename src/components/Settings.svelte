<script lang="ts">
  let successMessage: string = null,
    errorMessage: string = null;
</script>

<div>
  {#if successMessage}<div class="p-2 text-center text-green-500 font-bold">
      {successMessage}
    </div>{/if}
  {#if errorMessage}<div class="p-2 text-center text-red-500 font-bold">
      {errorMessage}
    </div>{/if}
  <div class="overflow-x-auto p-3">
    <!-- TODO -->
    Coming Soon!
  </div>
</div>
