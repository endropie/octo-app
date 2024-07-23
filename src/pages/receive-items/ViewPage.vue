<template>
  <q-page class="column items-center justify-evenly">
    <page-card :title="`RECEIVE ITEM [#${original?.id || '--'}] - DETAIL`">
      <q-card class="min-h-80" v-if="record">
        <pre>{{ record }}</pre>
      </q-card>
      <template v-slot:actions>
        <q-btn label="Back" color="primary" @click="link.back()"/>
        <q-space />
        <q-btn flat label="Edit" color="primary" :to="`/inventory/products/${$route.params.id}/edit`"/>
        <q-btn flat label="Delete" color="negative" @click="remove()"/>
      </template>
      <q-inner-loading :showing="loading">
        <q-spinner-gears color="primary" size="50px" />
      </q-inner-loading>
    </page-card>
  </q-page>
</template>

<script setup lang="ts">
import PageCard from 'src/components/PageCard.vue';
import { useRecord } from 'src/composables/record';
import { ReceiveOrderItemModel } from 'src/types/Receive';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'ProductViewPage',
});
const $router = useRouter()

const {
  record, original, loading, link, onLoad, onDelete
} = useRecord<ReceiveOrderItemModel['response']>(({
  api: ref( {
    resource: '/api/receive-items',
    load: {
      params: {
        includes: ['product', 'receive_order'],
        fields: ['product.name', 'product.sku', 'receive_order.number', 'receive_order.date'],
      }
    },
    delete: {
      confirm: {
        message: 'Are you sure to delete this record ?'
      }
    }
  }),
}));

onMounted(() => {
  onLoad(() => {
    // statement code here...
  });
});

const remove = () => {
  onDelete(() => {
    $router.replace('/products?refresh=true')
  })
};
</script>
