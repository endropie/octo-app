<template>
  <q-page class="column items-center justify-evenly">
    <page-card :title="`PRODUCT [${original?.sku || '--'}] - DETAIL`">
      <q-card class="min-h-80" v-if="record">
        <q-card-section class="flex flex-col md:flex-row  gap-8">
          <div class="flex-1 flex flex-col gap-2">
            <q-input readonly outlined v-model="record.name" type="text" label="Name" />
            <div class="flex flex-col md:flex-row gap-2">
              <q-input readonly outlined v-model="record.sku" type="text" label="SKU" class="flex-grow"/>
              <q-select readonly outlined v-model="record.type" :options="['item', 'nonstock', 'service', 'group']" prefix="Type: " class="flex-none prefix-label" hide-dropdown-icon />
            </div>
            <div class="flex flex-col md:flex-row gap-2">
              <q-input readonly outlined
                class="flex-grow"
                search
                label="Category"
                :model-value="record.category?.name || '--'"
              />
              <q-input readonly outlined v-model="record.unit" prefix="Unit: " class="flex-none prefix-label" />
            </div>
          </div>
          <div class="flex-1 column gap-2">
            <q-input readonly outlined v-model="record.sale_price" type="number" label="Sale Price" />
            <q-input readonly outlined v-model="record.purchase_price" type="number" label="Purchase Price" />
            <div class="flex flex-col md:flex-row gap-2" v-if="record.option">
              <q-input readonly outlined v-model="record.option.taxsen_income" type="number" prefix="Tax (%): " class="flex-1 prefix-label" />
              <q-input readonly outlined v-model="record.option.taxsen_service" type="number" prefix="Service Tax (%): " class="flex-1 prefix-label" />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="flex flex-col md:flex-row gap-8 mb-5">
          <div class="flex-1">
            <product-partial bordered readonly v-model="record.partials" :base-id="record.id" />
          </div>
          <div class="flex-1">
            <product-convertable bordered readonly v-model="record.convertable" :base-id="record.id" :base-unit="record.unit"/>
          </div>
        </q-card-section>
        <q-card-section class="flex flex-col md:flex-row gap-8 mb-5">
          <div class="w-full">
            <q-input readonly outlined v-model="record.description" type="textarea" label="Description" />
          </div>
        </q-card-section>
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
import ProductPartial from 'src/components/ProductPartial.vue';
import ProductConvertable from 'src/components/ProductConvertable.vue';
import { useRecord } from 'src/composables/record';
import { ProductModel } from 'src/types/product';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'ProductViewPage',
});
const $router = useRouter()

const {
  record, original, loading, link, onLoad, onDelete
} = useRecord<ProductModel['response']>(({
  api: ref( {
    resource: '/api/products',
    load: {
      params: {
        includes: ['category', 'partials', 'partials.part'],
        fields: ['convertable', 'partials.*', 'partials.part.name', 'partials.part.unit', 'category.name'],
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
