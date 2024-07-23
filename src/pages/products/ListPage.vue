<template>
  <q-page padding class="column">
    <q-table
      title="Product"
      :rows="rows"
      :columns="state.columns"
      v-model:pagination="pagination"
      :loading="loading"
      @request="onRequest"
      rows-per-page-label="LIMIT"
      title-class="text-title"
    >
      <template v-slot:top-right>
        <q-btn dense rounded color="primary" icon="add" :to="`/inventory/products/create`"/>
      </template>
      <template v-slot:body-cell-id="el">
        <q-td :props="el">
          <q-btn flat dense color="primary" icon="article" :to="`/inventory/products/${el.row.id}`" />
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
    resource: '/api/products',
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
    { name: 'name', field: 'name', label: 'Name', align: 'left', sortable: true},
    { name: 'sku', field: 'sku', label: 'SKU', align: 'left', classes: 'text-grey', sortable: true},
  ] as QTableColumn<ProductModel['response']>[],
});

</script>
<script setup lang="ts">
defineOptions({
  name: 'ProductListPage',
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
