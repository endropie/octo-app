<template>
  <q-list v-if="$q.screen.lt.md">
    <template v-for="(row, key) in list" :key="key">
      <menu-item :item="row"></menu-item>
    </template>
  </q-list>
  <q-list v-else>
    <template v-for="(row, key) in list" :key="key">
      <q-item clickable :to="row.to" class="text-primary" v-show="!row.hide">
        <q-item-section avatar>
          <q-avatar :icon="row.icon" />
        </q-item-section>
        <q-menu v-if="row.children?.length" anchor="top right" self="top left" class="floating">
          <q-list bordered style="min-width: 220px; backdrop-filter: contrast(0.9);">
            <menu-item v-for="(item, i) in row.children" :key="i" :item="item" ></menu-item>
          </q-list>
        </q-menu>
        <q-tooltip>
          {{ row.name }}
        </q-tooltip>
      </q-item>
    </template>
  </q-list>
</template>

<script lang="ts">
import { reactive } from 'vue'

const state = reactive({
  list: [
    {
      name: 'Setting', icon: 'settings', children: [
        { name: 'Company', icon: 'store', to: '/undercontraction' },
        { name: 'Customer', icon: 'groups', to: '/setting/customers' },
      ]
    },
    { name: 'Sales Order', icon: 'shopping_cart', to: '/income/sales-orders' },
    {
      name: 'Receive', icon: 'receipt_long', children: [
        { name: 'Receive', icon: 'receipt', to: '/receive-orders', hide: false },
        { name: 'Pallet', icon: 'trolley', to: '/receive-items' },
        { name: 'Storing', icon: 'pallet', to: '/receive-mounts' },
      ]
    },
    {
      name: 'Delivery', icon: 'local_shipping', children: [
        { name: 'Packing List', icon: 'list_alt', to: '/undercontraction' },
        { name: 'Batching', description: 'open -> picked', icon: 'fact_check', to: '/undercontraction' },
        { name: 'Fetching', description: '(open/picked) -> checked', icon: 'fact_check', to: '/undercontraction' },
        { name: 'Packaging', description: 'checked -> packed', icon: 'view_in_ar', to: '/undercontraction' },
      ]
    },
    {
      name: 'Inventory', icon: 'inventory', children: [
        { name: 'Products', icon: 'widgets', to: '/inventory/products' },
        { name: 'Lockers', icon: 'shelves', to: '/undercontraction' },
      ]
    },
  ],
})
</script>

<script setup lang="ts">
import { toRefs } from 'vue'
import MenuItem from 'components/MenuItem.vue'
import { MenuItemInterface } from 'src/types/app';

defineOptions({
  name: 'MainMenu'
});

const { list } = toRefs<{ list: MenuItemInterface[] }>(state)
</script>

<style>
.q-menu.floating {
  border-radius: 0;
  box-shadow: none;
}
</style>
