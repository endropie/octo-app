<template>
  <select-resource />
</template>

<script lang="ts">
import SelectResource from 'src/components/SelectResource.vue';
import { defineComponent } from 'vue';
defineComponent({
  name: 'SelectCustomer',
  mixins: [SelectResource],
  components: { SelectResource },
})
</script>
