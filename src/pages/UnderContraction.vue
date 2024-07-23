<template>
  <div class="fullscreen bg-warning text-white text-center q-pa-md column items-center justify-center">
    <q-spinner-gears size="200px" color="white" />
    <div class="pt-12">
      <div class="text-h6 md:text-h2" style="opacity:.4">
        Oops..<br> Under Contraction Page
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="warning"
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
