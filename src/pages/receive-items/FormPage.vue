<template>
  <q-page padding class="column justify-evenly">
    <page-card :title="`RECEIVE PALLET ${getTitleMode()} - FORM`">
      <q-card class="min-h-80" v-if="record">
        <pre>{{ record }}</pre>
      </q-card>
      <template v-slot:actions>
        <q-btn label="Back" color="primary" @click="link.back()"/>
        <q-space />
        <btn-drop-once
          v-model:primary="primarySaving"
          :data="[
            { name: 'save', label: 'Save', click: save },
            { name: 'save-new', label: 'Save & New', click: saveNew },
          ]"
        />
      </template>
      <q-inner-loading :showing="loading">
        <q-spinner-gears color="primary" size="50px" />
      </q-inner-loading>
    </page-card>
  </q-page>
</template>

<script lang="ts">

import { reactiveStore } from 'src/composables/utils';
import { ReceiveOrderItemModel } from 'src/types/Receive';
const state = reactiveStore('product-form', {
  primarySaving: null as string | null
})
</script>

<script setup lang="ts">
import PageCard from 'src/components/PageCard.vue';
import BtnDropOnce from 'src/components/BtnDropOnce.vue';
import { useRecord } from 'src/composables/record';
import { onMounted, onUpdated, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'ProductFormPage',
});

const $router = useRouter()

const { primarySaving } = toRefs(state)

const {
  record, original, loading, link, meta, onLoad, onSubmit,
} = useRecord<ReceiveOrderItemModel['response'], ReceiveOrderItemModel['attrs']>(({
  api: ref( {
    resource: '/api/products',
    load: {
      params: {
        includes: ['product', 'receive_order'],
        fields: ['product.name', 'product.sku', 'receive_order.number', 'receive_order.date'],
      }
    },
    delete: {
      confirm: {
        message: 'Are you sure to delete this product ?'
      }
    }
  }),
  default: () => ({
    id: null,
    receive_order_id: null,
    receive_order: null,
    product_id: null,
    product: null,
    pallet: null,
    amount: null,
    mounts: null,
  }),
}));


onUpdated(() => {
  onLoad()
})

onMounted(() => {
  onLoad();
});

const save = () => onSubmit((data) => {
  void $router.replace(`/receive-items/${data.id}`)
})

const saveNew = () => onSubmit(() => {
  void $router.replace('/receive-items/create')
})


const getTitleMode = () => {
  if (meta.mode === 'create') return 'New';
  return `[${original.value?.id || '--'}]`
}
</script>
