<template>
  <q-expansion-item  v-show="!item.hide" v-if="item && item.children?.length"
    :icon="item.icon"
    :label="item.label || item.name"
    :caption="item.caption"
    class="text-primary"
  >
  <q-list class="pl-3">
    <template  v-for="(row, key) in item.children" :key="key">
      <menu-item :item="row" />
    </template>
  </q-list>
  </q-expansion-item>
  <q-item v-else-if="item" v-show="!item.hide" clickable class="text-primary" :to="item.to">
    <q-item-section avatar>
      <q-icon v-if="item.icon" :name="item.icon" />
    </q-item-section>
    <q-item-section>{{ item.name }}</q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { MenuItemInterface } from 'src/types/app';
import { Prop } from 'vue';

defineOptions({
  name: 'MenuItem'
});

defineProps({
  item: Object as Prop<MenuItemInterface>
})

</script>
