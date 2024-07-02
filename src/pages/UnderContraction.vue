<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md column items-center justify-center">
    <q-spinner-gears size="200px" color="blue-3" />
    <div class="pt-12">
      <div class="text-h3" style="opacity:.4">
        Oops.. Under Contraction Page
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'UnderContraction'
});
</script>
