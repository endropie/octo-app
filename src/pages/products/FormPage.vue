<template>
  <q-page padding class="column justify-evenly">
    <page-card :title="`PRODUCT ${getTitleMode()} - FORM`">
      <q-card class="min-h-80" v-if="record">
        <q-card-section class="flex flex-col md:flex-row  gap-8">
          <div class="flex-1 flex flex-col gap-2">
            <q-input outlined v-model="record.name" type="text" label="Name" />
            <div class="flex flex-col md:flex-row gap-2">
              <q-input outlined v-model="record.sku" type="text" label="SKU" class="flex-grow"/>
              <q-select outlined v-model="record.type" :options="['item', 'nonstock', 'service', 'group']" prefix="Type: " class="flex-none" hide-dropdown-icon />
            </div>
            <div class="flex flex-col md:flex-row gap-2">
              <select-resource outlined
                class="flex-grow"

                label="Category"
                api-url="/api/product-categories"
                :api-params="{ limit: '*' }"
                option-label="name"
                v-model="record.category"
                @update:model-value="() => record.category_id = record.category?.id || null"
              />
              <q-input  outlined v-model="record.unit" prefix="Unit: " class="flex-none" />
            </div>
          </div>
          <div class="flex-1 column gap-2">
            <q-input outlined v-model="record.sale_price" type="number" label="Sale Price" />
            <q-input outlined v-model="record.purchase_price" type="number" label="Purchase Price" />
            <div class="flex flex-col md:flex-row gap-2" v-if="record.option">
              <q-input outlined v-model="record.option.taxsen_income" type="number" prefix="Tax (%): " class="flex-1" />
              <q-input outlined v-model="record.option.taxsen_service" type="number" prefix="Service Tax (%): " class="flex-1" />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="flex flex-col md:flex-row gap-8 mb-5">
          <div class="flex-1">
            <product-partial v-model="record.partials" :base-id="record.id" />
          </div>
          <div class="flex-1">
            <product-convertable v-model="record.convertable" :base-id="record.id" :base-unit="record.unit"/>
          </div>
        </q-card-section>
        <q-card-section class="flex flex-col md:flex-row gap-8 mb-5">
          <div class="w-full">
            <q-input v-model="record.description" type="textarea" label="Description" filled />
          </div>
        </q-card-section>
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
const state = reactiveStore('product-form', {
  primarySaving: null as string | null
})
</script>

<script setup lang="ts">
import PageCard from 'src/components/PageCard.vue';
import BtnDropOnce from 'src/components/BtnDropOnce.vue';
import SelectResource from 'src/components/SelectResource.vue';
import ProductPartial from 'src/components/ProductPartial.vue';
import ProductConvertable from 'src/components/ProductConvertable.vue';
import { useRecord } from 'src/composables/record';
import { ProductModel } from 'src/types/product';
import { onMounted, onUpdated, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'ProductFormPage',
});

const $router = useRouter()

const { primarySaving } = toRefs(state)

const {
  record, original, loading, link, meta, onLoad, onSubmit,
} = useRecord<ProductModel['response'], ProductModel['attrs']>(({
  api: ref( {
    resource: '/api/products',
    load: {
      params: {
        includes: ['category', 'partials', 'partials.part'],
        fields: ['convertable', 'partials.*', 'partials.part.name', 'partials.part.unit', 'category.name']
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
    sku: null,
    name: null,
    unit: null,
    sales_price: null,
    purchase_price: null,
    category_id: null,
    category: null,
    convertable: [],
    partials: [],
    option: {
      taxsen_income: null,
      taxsen_service: null,
    }
  }),
}));

const setParseRecord = () => {
  record.value.option = {
      taxsen_income: null,
      taxsen_service: null,
      ...record.value.option,
    }
}

onUpdated(() => {
  onLoad( () => {
    setParseRecord()
  })
})

onMounted(() => {
  onLoad(() => {
    setParseRecord()
  });
});

const save = () => onSubmit((data) => {
  void $router.replace(`/inventory/products/${data.id}`)
})

const saveNew = () => onSubmit(() => {
  void $router.replace('/inventory/products/create')
})


const getTitleMode = () => {
  if (meta.mode === 'create') return 'New';
  return `[${original.value?.sku || '--'}]`
}
</script>
