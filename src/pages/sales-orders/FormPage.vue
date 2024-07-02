<template>
  <q-page padding>
    <page-card :title="`SALES ORDER ${getTitleMode()} - FORM`">
      <q-card class="min-h-80" v-if="record">
        <q-card-section class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 column gap-2">
            <select-resource
              dense outlined
              search
              label="Customer"
              api-url="/api/customers"
              :api-params="{ limit: '*' }"
              :option-label="(e: SalesOrderModel['response']['customer']) => `${e.name} [#${e.id}]`"
              v-model="record.customer"
              @update:model-value="() => {
                if (record?.customer) record.customer_id = record.customer?.id || null
              }"
            />
            <div class="flex flex-row gap-2">
              <q-input dense outlined v-model="record.date" type="date" label="Date" class="flex-1" />
              <q-input dense outlined v-model="record.due" type="date" label="Due" class="flex-1" />
            </div>
          </div>
          <div class="flex-1 column gap-2" v-if="record.option">
            <q-input dense outlined v-model="record.number" type="text" label="SO No." />
          </div>
        </q-card-section>
        <q-card-section :horizontal="!$q.screen.lt.sm">
          <div class="flex-none">
            <q-tabs dense
              v-model="tab"
              :vertical="!$q.screen.lt.sm"
              active-color="blue-grey"
              active-bg-color="blue-grey-3"
            >
              <q-tab name="items" icon="list_alt" class="bg-grey-3 text-grey-8 text-xxs"  />
              <q-tab name="detail" icon="info_outline" class="bg-grey-3 text-grey-8 text-xs" />
            </q-tabs>
          </div>
          <div class="flex-1 border border-stone-300 rounded-r-md">
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
              style="height: calc(100vh - 360px); min-height: 200px"
            >
              <!-- TAB:ITEMS -->
              <q-tab-panel name="items" class="p-2">
                <div v-if="record.items" class="flex flex-col gap-2">
                  <select-resource dense outlined
                    prefix="Select Product: "
                    search="api"
                    api-url="/api/products"
                    :option-label="(e: any) => `${e.name} [${e.unit}]`"
                    v-model="selectProduct"
                    @update:model-value="setFormItem()"
                    hide-selected
                  />
                  <q-markup-table dense flat square bordered separator="cell">
                    <thead>
                      <tr class="text-uppercase text-grey-8">
                        <th class="text-center w-8">#</th>
                        <th class="text-center">Name</th>
                        <th class="text-center">Qty</th>
                        <th class="text-center">Unit</th>
                        <th class="text-center">Price</th>
                        <th class="text-center">Discount</th>
                        <th class="text-center">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="record.items.length === 0">
                        <td colspan="100%" class="text-center text-caption text-grey text-italic" style="height: 50px">
                          No data items
                        </td>
                      </tr>
                      <tr v-else v-for="(item, itemKey) in record.items" :key="itemKey"
                        @click="setFormItem(itemKey)"
                        class="cursor-pointer"
                      >
                        <td> {{ itemKey+1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.unit }}</td>
                        <td class="text-right">{{ item.quantity }}</td>
                        <td class="text-right">{{ item.price }}</td>
                        <td class="text-right">{{ item.discprice }}</td>
                        <td class="text-right">{{ SUBITEMS[itemKey] || '-'}}</td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
              </q-tab-panel>

              <!-- TAB:DETAIL -->
              <q-tab-panel name="detail">
                <div class="flex flex-col md:flex-row gap-4">
                  <div class="flex-1">
                    <header-title icon="assignment">Detail Information</header-title>
                    <div class="column gap-2 mb-4" v-if="record.option">
                      <q-input dense outlined v-model="record.termcode" type="text" label="Payment terms" />
                      <q-input dense outlined v-model="record.reference" type="text" label="Reference SO/DO/MEMO" />
                      <q-input dense outlined autogrow stack-label input-style="min-height: 45px"
                        v-model="record.description"
                        type="textarea"
                        label="Description"
                      />
                    </div>
                    <header-title icon="loupe">Tax Information</header-title>
                    <div class="row gap-2 mb-2" v-if="record.option">
                      <q-checkbox left-label :model-value="Boolean(record.option.taxable)" @update:model-value="record.option.taxable = !record.option.taxable" label="Taxable" />
                      <q-checkbox left-label :model-value="Boolean(record.option.tax_inclusive)" @update:model-value="record.option.tax_inclusive = !record.option.tax_inclusive" label="Inclusive Tax" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <header-title icon="receipt_long" class="row">Payment Information <q-space />
                      <q-checkbox dense left-label :model-value="Boolean(record.option?.paycust)" label="Change" @update:model-value="setChangePaycust" />
                    </header-title>
                    <div class="column gap-2 mb-2">
                      <div class="flex flex-col md:flex-row gap-2" v-if="record.option?.paycust">
                        <q-input dense outlined v-model="record.option.paycust.name" label="Name" class="flex-1" />
                        <q-input dense outlined v-model="record.option.paycust.phone" label="Phone" class="flex-1" />
                        <q-input dense outlined autogrow stack-label class="w-full" input-style="min-height: 45px"
                          type="textarea"
                          label="Address"
                          :placeholder="record.customer?.address"
                          v-model="record.option.paycust.address"
                        />
                      </div>
                      <div v-else class="text-caption text-italic text-center text-grey mt-2 mb-4">
                        The same as selected customer.
                      </div>
                    </div>
                    <header-title icon="local_shipping" class="row">Shipping Information <q-space />
                      <q-checkbox dense left-label :model-value="Boolean(record.option?.shipcust)" label="Change" @update:model-value="setChangeShipcust" />
                    </header-title>
                    <div class="column gap-2 mb-2">
                      <div class="flex flex-col md:flex-row gap-2" v-if="record.option?.shipcust">
                        <q-input dense outlined v-model="record.option.shipcust.name" label="Name" class="flex-1" />
                        <q-input dense outlined v-model="record.option.shipcust.phone" label="Phone" class="flex-1" />
                        <q-input dense outlined autogrow stack-label class="w-full" input-style="min-height: 45px"
                          type="textarea"
                          label="Address"
                          :placeholder="record.customer?.address"
                          v-model="record.option.shipcust.address"
                        />
                      </div>
                      <div v-else class="text-caption text-italic text-center text-grey mt-2 mb-4">
                        The same as selected customer.
                      </div>
                    </div>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </q-card-section>
        <q-card-section>
          <summary-card class="mb-5"
              :list="[
                { label: 'Subtotal', value: SUBTOTAL },
                { label: 'Discount', value: DISCOUNT },
                { label: 'Total', value: TOTAL },
              ]"
            />
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

  <q-dialog persistent :maximized="$q.screen.lt.sm"
    :model-value="Boolean(keyFormItem !== null)"
    @hide="unsetForm()"
  >
    <q-card v-if="recordItem" class="min-w-80">
      <q-bar dark class="bg-primary text-white">
        <div class="col text-center text-weight-bold">
          Product Detail
        </div>
        <q-btn dense flat round icon="clear" size="8.5px" v-close-popup />
      </q-bar>
      <q-card-section class="grid grid-cols-4 gap-2">
        <div class="pt-3">SKU</div>
        <q-input dense outlined  readonly
          class="col-span-3"
          :model-value="recordItem.product.sku"
        />
        <div class="pt-3">Name</div>
        <q-input dense outlined
          class="col-span-3"
          v-model="recordItem.name"
        />
        <div class="pt-3">Qty</div>
        <div class="col-span-3 flex flex-row justify-end">
          <q-input dense outlined autofocus
            class=""
            input-class="w-16 text-right"
            type="number"
            v-model="recordItem.quantity"
          >
            <template v-slot:append>
              <span class="text-sm text-bold">{{ recordItem.unit }}</span>
            </template>
          </q-input>
        </div>
        <div class="pt-3">Price</div>
        <q-input dense outlined
          class="col-span-3"
          input-class="text-right"
          type="number"
          v-model="recordItem.price"
          @update:model-value="setItemDisc(recordItem)"
        />
        <div class="pt-3">Disc</div>
        <q-input dense outlined
          class="col-span-3"
          input-class="text-right"
          type="number"
          v-model="recordItem.discprice"
          @update:model-value="() => {
            if (recordItem?.option) recordItem.option.discprice_sen = null;
          }"
        >
          <template v-slot:before v-if="recordItem.option">
            <q-input dense outlined
            class="col-span-3"
            input-class="w-16 text-right"
            suffix=" %"
            type="number" max="99"
            v-model="recordItem.option.discprice_sen"
            @update:model-value="setItemDisc(recordItem)"
            />
          </template>
        </q-input>
        <div class="pt-3">Total Price</div>
        <q-input dense outlined readonly
          class="col-span-3"
          input-class="text-right"
          :model-value="Number(recordItem.quantity) * (Number(recordItem.price) - Number(recordItem.discprice))"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Submit" color="primary" :disable="!FORMDETAIL_ALLOWED" @click="setItem()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">

import { reactiveStore } from 'src/composables/utils';
import { Dialog } from 'quasar';
import DialogLoading from 'src/components/DialogLoading.vue';
import SummaryCard from 'src/components/SummaryCard.vue';
const state = reactiveStore('sales-order-form', {
  primarySaving: null as string | null
})
</script>

<script setup lang="ts">
import PageCard from 'src/components/PageCard.vue';
import BtnDropOnce from 'src/components/BtnDropOnce.vue';
import HeaderTitle from 'src/components/HeaderTitle.vue';
import SelectResource from 'src/components/SelectResource.vue';
import { useRecord } from 'src/composables/record';
import { SalesOrderItemModel, SalesOrderModel } from 'src/types/sales-order';
import { QueueRaw, QueueResponse } from 'src/types/resource';
import { computed, onMounted, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'SalesOrderFormPage',
});

const $router = useRouter()

const { primarySaving } = toRefs(state)

const tab = ref('items')
const selectProduct = ref(null as SalesOrderItemModel['attrs']['product'] | null)
const keyFormItem = ref(null as number | null)
const recordItem = ref(null as SalesOrderItemModel['attrs'] | null)

const {
  record, link, meta, loading, onLoad, onQueueSubmit, addQueueList,
} = useRecord<SalesOrderModel['response'], SalesOrderModel['attrs']>(({
  api: ref( {
    resource: '/api/sales-orders',
    load: {
      params: {
        includes: ['customer', 'customer.contact', 'items', 'items.product'],
        fields: [
          'customer.name', 'customer.option', 'customer.contact.phone', 'customer.contact.address',
          'items.*', 'items.product.*'
        ],
      }
    },
    submit: {
      confirm: false,
    },
    delete: {
      confirm: {
        message: 'Are you sure to delete this record ?'
      }
    }
  }),
  default: () => ({
    id: null,
    customer_id: null,
    customer: null,
    number: null,
    date: null,
    due: null,
    reference: null,
    termcode: null,
    description: null,
    option: {
      taxable: false,
      tax_inclusive: false,
      paycust: null,
      shipcust: null,
    },
    items: []
  }),
}));

const newItem = (e: SalesOrderItemModel['response']) => JSON.parse(JSON.stringify({
  id: null,
  type: null,
  product_id: null,
  name: null,
  unit: null,
  quantity: null,
  price: null,
  discprice: null,
  seq: null,
  groupseq: null,
  option: {
    discprice_sen: null,
    taxsen_income: null,
    taxsen_service: null,
  },
  ...e
} as SalesOrderItemModel['attrs']))

const newCustInfo = () => JSON.parse(JSON.stringify({
  name: null,
  phone: null,
  address: null,
}))

// onUpdated(() => {
//   onLoad()
// })

onMounted(() => {
  onLoad(() => {
    // statement code here...
  });
});

const saving = (done: (response: QueueResponse) => void, raw?: QueueRaw) => {

  onQueueSubmit((response) => {
    addQueueList({
      key: response.key,
      message: response.message || 'Unmessage',
      record: JSON.parse(JSON.stringify(record.value)),
      ...raw,
    })
    done(response)
  })
}

const save = () => saving((response) => {

  Dialog.create({
    component: DialogLoading,
    componentProps: {
      title: 'SalesOrder detail submitted',
      action: {
        dense: true,
        flat: true,

        label: 'next',
        to: '/income/sales-orders'
      }
    }
  })

}, { redirect: (e) => String(`/income/sales-orders/${e.id}`) } as QueueRaw)

const saveNew = () => saving((response) => {
  void $router.replace('/income/sales-orders/create')
})

const getTitleMode = () => {
  if (meta.mode === 'create') return 'New';
  return `[${record.value?.id || '--'}]`
}

const setChangePaycust = () => {
  if (typeof record.value?.option?.paycust !== 'undefined') {
    record.value.option.paycust = record.value.option.paycust ? null : newCustInfo()
  }
}

const setChangeShipcust = () => {
  if (typeof record.value?.option?.shipcust !== 'undefined') {
    record.value.option.shipcust = record.value.option.shipcust ? null : newCustInfo()
  }
}

const setFormItem = (key = -1) => {
  if (record.value?.items) {
    if (key >= 0) {
      keyFormItem.value = key
      recordItem.value = JSON.parse(JSON.stringify(record.value.items[key]));
    }
    else {
      keyFormItem.value = -1
      const v = JSON.parse(JSON.stringify(selectProduct.value));
      recordItem.value = newItem({
        product_id: v.id,
        product: v,
        name: v.name,
        unit: v.unit,
      })
    }
  }
}

const setItem = () => {
  if (record.value?.items && recordItem.value && keyFormItem.value !== null) {
    const v = JSON.parse(JSON.stringify(recordItem.value))
    if (keyFormItem.value >= 0) {
      record.value.items[keyFormItem.value] = v;
    }
    else record.value.items.push(v);

    unsetForm()
  }
}

const setItemDisc = (item: SalesOrderItemModel['attrs']) => {
  if (item.option) item.discprice = Number(item.option.discprice_sen) / 100 * Number(item.price)
}

const unsetForm = () => {
  keyFormItem.value = null
  selectProduct.value = null
  recordItem.value = null
}

const FORMDETAIL_ALLOWED = computed(() => {
  if (!recordItem.value) return false;
  if (!recordItem.value.name)  return false;
  if (!recordItem.value.quantity)  return false;
  if (!recordItem.value.price)  return false;
  return true
})
const SUBITEMS = computed(() => record.value?.items?.map((e) => ((Number(e.price) - Number(e.discprice)) * Number(e.quantity)) ,0) || [])
const SUBTOTAL = computed(() => record.value?.items?.reduce((sum, e) => sum + (Number(e.price) * Number(e.quantity)) ,0))
const DISCOUNT = computed(() => record.value?.items?.reduce((sum, e) => sum + (Number(e.discprice)) ,0))
const TOTAL = computed(() => Number(SUBTOTAL.value) - Number(DISCOUNT.value))

</script>
