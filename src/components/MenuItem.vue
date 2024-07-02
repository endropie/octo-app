<template>
  <q-expansion-item v-if="item && item.children?.length"
    :icon="item.icon"
    :label="item.label || item.name"
    :caption="item.caption"
    class="text-faded"
  >
  <q-list class="pl-3">
    <template  v-for="(row, key) in item.children" :key="key">
      <menu-item :item="row" />
    </template>
  </q-list>
  </q-expansion-item>
  <q-item v-else-if="item" clickable class="text-faded" :to="item.to">
    <q-item-section avatar>
      <q-icon v-if="item.icon" :name="item.icon" />
    </q-item-section>
    <q-item-section>{{ item.name }}</q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MenuItem'
});

defineProps({
  item: Object
})

</script>
