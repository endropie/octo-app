<template>
  <q-list>
    <template  v-for="(row, key) in list" :key="key">
      <menu-item :item="row"></menu-item>
    </template>
  </q-list>
</template>

<script lang="ts">
import { reactive } from 'vue'
import MenuItem from './MenuItem.vue'

const state = reactive({
  list: [
    {
      name: 'Setting', icon: 'settings', children: [
        { name: 'Company', icon: 'store', to: '/undercontraction' },
        { name: 'Customer', icon: 'groups', to: '/setting/customers' },
      ]
    },
    {
      name: 'Order', icon: 'local_mall', children: [
        { name: 'Sales Order', icon: 'shopping_cart', to: '/income/sales-orders' },
      ]
    },
    {
      name: 'Warehouse', icon: 'warehouse', children: [
        { name: 'Packing List', icon: 'trolley', to: '/undercontraction' },
        { name: 'Shipping', icon: 'local_shipping', to: '/undercontraction' },
      ]
    },
    {
      name: 'Inventory', icon: 'inventory', children: [
        { name: 'Products', icon: 'view_in_ar', to: '/inventory/products' },
      ]
    },
  ]
})
</script>

<script setup lang="ts">
import { toRefs } from 'vue'

defineOptions({
  name: 'MainMenu'
});

const { list } = toRefs(state)
</script>
