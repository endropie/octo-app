<template>
  <q-page padding class="column">
    <q-table
      :grid="$q.screen.lt.md"
      card-container-class="grid grid-cols-1 sm:grid-cols-2 gap-2"
      title="Receive Pallets"
      :rows="rows"
      :columns="state.columns"
      v-model:pagination="pagination"
      :loading="loading"
      @request="onRequest"
      rows-per-page-label="LIMIT"
      title-class="text-title"
    >
      <template v-slot:item="{ row }">
        <q-card v-ripple:primary @click="$router.push(`/receive-items/${row.id}`)">
          <q-card-section class="p-3 gap-2">
            <div class="text-title text-bold ellipsis">{{ row.product?.name }}</div>
            <div class="row">
              <div class="col-grow ellipsis" style="max-width: calc(100% - 4rem);">
                <div class="text-xs text-grey ">SKU : {{ row.product?.sku }}</div>
                <div class="mt-2 text-semibold ellipsis">
                  No. Receive: {{ row.receive_order?.number }}
                </div>
                <div class="">
                  Date: {{ row.receive_order?.date }}
                </div>
              </div>
              <div class="col-none ml-4 text-h4 text-semibold text-center">
                {{ row.amount }}
                <div class="text-sm text-grey">{{ row.product.unit }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:top-right>
        <q-btn dense rounded color="title" icon="add" :to="`/receive-items/create`"/>
      </template>
      <template v-slot:body-cell-id="el">
        <q-td :props="el">
          <q-btn flat dense color="title" icon="article" :to="`/receive-items/${el.row.id}`" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import { QTableColumn, QTableProps } from 'quasar';
import useTable from 'src/composables/table';
import { ReceiveOrderItemModel } from 'src/types/Receive';
import { onMounted, reactive, toRefs } from 'vue';

const state = reactive({
  api: {
    resource: '/api/receive-items',
    load: {
      params: {
        includes: ['product', 'receive_order'],
        fields: ['product.name', 'product.sku', 'product.unit', 'receive_order.number', 'receive_order.date'],
      }
    }
  },
  pagination: {
    sortBy: null,
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
  } as QTableProps['pagination'],
  columns: [
    { name: 'id', field: 'id', label: '#', align: 'center', classes: 'text-center w-5' },
    { name: 'date', field: (row) => row.receive_order?.date, label: 'Date', align: 'center', classes: 'w-10', sortable: true},
    { name: 'receive', field: (row) => row.receive_order?.number, label: 'Receive', align: 'center', sortable: true},
    { name: 'product', field: (row) => row.product?.name, label: 'Product', align: 'left', sortable: true},
    { name: 'sku', field: (row) => row.product?.sku, label: 'SKU', align: 'left', sortable: true},
    { name: 'amount', field: 'amount', label: 'QTY', align: 'right', classes:'w-5' },
    { name: 'unit', field: (row) => row.product?.unit, label: 'unit', align: 'left',  classes:'w-5' },
  ] as QTableColumn<ReceiveOrderItemModel['response']>[],
});

</script>
<script setup lang="ts">
defineOptions({
  name: 'ReceiveItemListPage',
});

const { api, pagination } = toRefs(state)
const { rows, loading, onLoad, onRequest } = useTable<ReceiveOrderItemModel['response']>({
  pagination,
  api,
});

onMounted(() => {
  onLoad()
})

</script>

<style>
.receive-item .q-card__section--vert {
  padding: 10px;
}
</style>
