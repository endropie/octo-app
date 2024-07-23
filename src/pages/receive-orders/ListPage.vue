<template>
  <q-page padding class="column">
    <q-table
      title="RECEIVE ORDER"
      :rows="rows"
      :columns="state.columns"
      v-model:pagination="pagination"
      :loading="loading"
      @request="onRequest"
      rows-per-page-label="LIMIT"
      title-class="text-title"
    >
      <template v-slot:body-cell-id="el">
        <q-td :props="el">
          <q-btn flat dense color="primary" icon="article" :to="`/receive-orders/${el.row.id}`" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import { QTableColumn, QTableProps } from 'quasar';
import useTable from 'src/composables/table';
import { ProductModel } from 'src/types/product';
import { onMounted, reactive, toRefs } from 'vue';

const state = reactive({
  api: {
    resource: '/api/receive-orders',
  },
  pagination: {
    sortBy: null,
    descending: false,
    page: 1,
    rowsPerPage: 5,
    rowsNumber: 0,
  } as QTableProps['pagination'],
  columns: [
    { name: 'id', field: 'id', label: '#', align: 'center', classes: 'text-center w-5' },
    { name: 'date', field: 'date', label: 'Date', align: 'center', classes: 'w-10', sortable: true },
    { name: 'number', field: 'number', label: 'No. Receive', align: 'left', sortable: true },
    { name: 'state', field: 'state', label: 'Status', align: 'left', classes: 'w-10' },
    { name: 'reference', field: 'reference', label: 'Reference', align: 'left', classes: '' },
  ] as QTableColumn<ProductModel['response']>[],
});

</script>
<script setup lang="ts">
defineOptions({
  name: 'ReceiveOrderListPage',
});

const { api, pagination } = toRefs(state)
const { rows, loading, onLoad, onRequest } = useTable<ProductModel['response']>({
  pagination,
  api,
});

onMounted(() => {
  onLoad()
})

</script>
