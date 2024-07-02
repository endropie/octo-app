<template>
  <q-page padding class="column">
    <q-table
      title="Sales Order"
      :rows="rows"
      :columns="state.columns"
      v-model:pagination="pagination"
      :loading="loading"
      @request="onRequest"
    >
      <template v-slot:top-right>
        <q-btn dense rounded color="faded" icon="add" :to="`/income/sales-orders/create`"/>
      </template>
      <template v-slot:body-cell-id="el">
        <q-td :props="el">
          <q-btn flat dense color="faded" icon="article" :to="`/income/sales-orders/${el.row.id}`" />
        </q-td>
      </template>
      <template v-slot:body-cell-state="el">
        <q-td :props="el">
          <q-badge :color="getOrderStateColor(el.value)" :label="el.value" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import { QTableColumn, QTableProps } from 'quasar';
import useTable from 'src/composables/table';
import { SalesOrderModel } from 'src/types/sales-order';
import { onMounted, reactive, toRefs } from 'vue';
const state = reactive({
  api: {
    resource: '/api/sales-orders',
    load: {
      params: {
        includes: ['customer'],
        fields: ['customer.name'],
      }
    }
  },
  pagination: {
    sortBy: null,
    descending: false,
    page: 1,
    rowsPerPage: 5,
    rowsNumber: 0,
  } as QTableProps['pagination'],
  columns: [
    { name: 'id', field: 'id', label: '#', align: 'center', sortable: true },
    { name: 'number', field: 'number', label: 'No', align: 'left' },
    { name: 'date', field: 'date', label: 'Date', align: 'center' },
    { name: 'customer', field: (e) => e.customer?.name || '--', label: 'Customer', align: 'left' },
    { name: 'state', field: 'state', label: '', align: 'center' },
  ] as QTableColumn<SalesOrderModel['response']>[],
});
</script>
<script setup lang="ts">
defineOptions({
  name: 'SalesOrderListPage',
});

const { api, pagination } = toRefs(state)
const { rows, loading, onLoad, onRequest } = useTable<SalesOrderModel['response']>({
  pagination,
  api,
});

onMounted(() => {
  onLoad()
})

const getOrderStateColor = (s: string) => {
  const colors = {
    OPEN: 'blue-grey',
    APPROVED: 'positive',
    PACKED: 'warning',
    DELIVERED: 'warning',
    CLOSE: 'negative',
    CANCEL: 'negative',
  }

  return colors[s as unknown as keyof typeof colors] || 'black'
}

</script>
