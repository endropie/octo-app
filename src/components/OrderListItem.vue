<template>
  <q-card flat >
    <q-list dense separator>
      <q-item v-for="(item, itemKey) in list" :key="itemKey" class="list-items" :clickable="clickable" @click="$emit('itemClickable', itemKey)">
        <q-item-section side class="text-center items-center">
          <p class="ellipsis w-10 leading-none pt-1 pb-1 font-medium">
            {{item.quantity}}
            <span class="block ellipsis text-caption text-xxs">{{ item.unit }}</span>
          </p>
        </q-item-section>
        <q-item-section>
          <p class="w-full ellipsis" style="max-width: calc(100vw - 12rem)">
            {{ item.name }}
          </p>
        </q-item-section>
        <q-item-section side>
          <p class="leading-none text-right pt-2">
            @{{ nominal(item.price) }}
            <span v-if="item.discprice" class="block text-xxs text-warning text-medium">Disc: {{ nominal(item.discprice) }}</span>
          </p>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
import { Prop } from 'vue';
import { nominal } from 'src/boot/system';
import { SalesOrderItemModel } from 'src/types/sales-order';

defineOptions({
  name: 'OrderListItem'
})

defineEmits(['itemClickable'])

defineProps({
  clickable: Boolean,
  list: Array as Prop<SalesOrderItemModel['attrs'][]>
})

</script>

<style>
.q-list--dense > .q-item.list-items {
  padding: 2px 8px
}
</style>
