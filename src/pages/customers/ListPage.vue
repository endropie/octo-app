<template>
  <q-page padding class="column">
    <q-table
      title="Customers"
      :rows="rows"
      :columns="state.columns"
      v-model:pagination="pagination"
      :loading="loading"
      @request="onRequest"
      table-header-class="font-semibold"
    >
      <template v-slot:top-right>
        <q-btn dense rounded color="faded" icon="add" :to="`/setting/customers/create`"/>
      </template>
      <template v-slot:body-cell-id="el">
        <q-td :props="el" class="w-5 text-center">
          <q-btn flat dense color="faded" icon="article" :to="`/setting/customers/${el.row.id}`" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import { QTableColumn, QTableProps } from 'quasar';
import useTable from 'src/composables/table';
import { CustomerModel } from 'src/types/customer';
import { onMounted, reactive, toRefs } from 'vue';
const state = reactive({
  api: {
    resource: '/api/customers',
  },
  pagination: {
    sortBy: null,
    descending: false,
    page: 1,
    rowsPerPage: 5,
    rowsNumber: 0,
  } as QTableProps['pagination'],
  columns: [
    { name: 'id', field: 'id', label: '#', align: 'center' },
    { name: 'code', field: 'code', label: 'Code', align: 'left' },
    { name: 'name', field: 'name', label: 'Name', align: 'left', sortable: true},
  ] as QTableColumn<CustomerModel['response']>[],
});

</script>

<script setup lang="ts">
defineOptions({
  name: 'CustomerListPage',
});

const { api, pagination } = toRefs(state)
const { rows, loading, onLoad, onRequest } = useTable<CustomerModel['response']>({
  pagination,
  api,
});

onMounted(() => {
  onLoad()
})

</script>
