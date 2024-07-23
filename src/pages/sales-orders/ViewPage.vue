<template>
  <q-page class="column items-center justify-evenly">
    <page-card :title="`SALES ORDER [${record?.id || '--'}]`"
      route-back="/income/sales-orders"
      :loading="loading"
    >
      <template v-slot:title>
        <div class="row">
          SALES ORDER [{{record?.id || '--'}}]
          <q-space />
          <q-badge v-if="record" color="positive"  :label="record.state" class="py-1 ml-2" />
        </div>
      </template>

      <q-card class="min-h-80" v-if="record">
        <q-card-section class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 column gap-2">
            <q-input readonly
              dense outlined
              search
              label="Customer"
              api-url="/api/customers"
              :api-params="{ limit: '*' }"
              :option-label="(e: SalesOrderModel['response']['customer']) => `${e.name} [#${e.id}]`"
              :model-value="record.customer?.name"
            />
            <div class="flex flex-row gap-2">
              <q-input readonly dense outlined v-model="record.date" type="date" label="Date" class="flex-1" />
              <q-input readonly dense outlined v-model="record.due" type="date" label="Due" class="flex-1" placeholder="date" />
            </div>
          </div>
          <div class="flex-1 column gap-2" v-if="record.option">
            <q-input readonly dense outlined v-model="record.number" type="text" label="SO No." />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section :horizontal="!$q.screen.lt.sm" class="px-0 pt-0">
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
          <div class="flex-1 border-l border-stone-300">
            <q-tab-panels

              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
              style="min-height: 200px;"
              :style="{
                height: $q.screen.lt.sm ? 'calc(100vh - 400px)' : 'calc(100vh - 320px)',
              }"
            >
              <!-- TAB:ITEMS -->
              <q-tab-panel name="items" class="p-0">
                <div v-if="record.items" class="flex flex-col gap-2">
                  <order-list-item v-if="$q.screen.lt.md" :list="record.items" />
                  <q-markup-table v-else  dense flat square separator="vertical" class="q-table--semi-dense">
                    <thead>
                      <tr class="text-uppercase text-grey-8">
                        <th class="text-center w-8">#</th>
                        <th class="text-center w-1/2">Name</th>
                        <th class="text-center">Qty</th>
                        <th class="text-center">Unit</th>
                        <th class="text-center">Price</th>
                        <th class="text-center">Disc</th>
                        <th class="text-center">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="record.items.length === 0">
                        <td colspan="100%" class="text-center text-caption text-grey text-italic" style="height: 50px">
                          No data items
                        </td>
                      </tr>
                      <tr v-else v-for="(item, itemKey) in record.items" :key="itemKey">
                        <td> {{ itemKey+1 }}</td>
                        <td>{{ item.name }}</td>
                        <td class="text-right">{{ item.quantity }}</td>
                        <td>{{ item.unit }}</td>
                        <td class="text-right">{{ nominal(item.price) }}</td>
                        <td class="text-right">{{ nominal(item.discprice) }}</td>
                        <td class="text-right">{{ nominal(SUBITEMS[itemKey]) || '-'}}</td>
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
                      <q-input readonly dense outlined v-model="record.termcode" type="text" label="Payment terms" />
                      <q-input readonly dense outlined v-model="record.reference" type="text" label="Reference SO/DO/MEMO" />
                      <q-input readonly dense outlined autogrow stack-label input-style="min-height: 45px"
                        v-model="record.description"
                        type="textarea"
                        label="Description"
                      />
                    </div>
                    <header-title icon="loupe">Tax Information</header-title>
                    <div class="row gap-2 mb-2" v-if="record.option">
                      <q-checkbox disable left-label :model-value="Boolean(record.option.taxable)" label="Taxable" />
                      <q-checkbox disable left-label :model-value="Boolean(record.option.tax_inclusive)" label="Inclusive Tax" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <header-title icon="receipt_long" class="row">Payment Information</header-title>
                    <div class="column gap-2 mb-2">
                      <div class="flex flex-col md:flex-row gap-2" v-if="record.option?.paycust">
                        <q-input readonly dense outlined v-model="record.option.paycust.name" label="Name" class="flex-1" />
                        <q-input readonly dense outlined v-model="record.option.paycust.phone" label="Phone" class="flex-1" />
                        <q-input readonly dense outlined autogrow stack-label class="w-full" input-style="min-height: 45px"
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
                    <header-title icon="local_shipping" class="row">Shipping Information</header-title>
                    <div class="column gap-2 mb-2">
                      <div class="flex flex-col md:flex-row gap-2" v-if="record.option?.shipcust">
                        <q-input readonly dense outlined v-model="record.option.shipcust.name" label="Name" class="flex-1" />
                        <q-input readonly dense outlined v-model="record.option.shipcust.phone" label="Phone" class="flex-1" />
                        <q-input readonly dense outlined autogrow stack-label class="w-full" input-style="min-height: 45px"
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
      </q-card>
      <template v-slot:left-btn-group>
        <!-- <q-btn label="Change" color="primary" :to="`/income/sales-orders/${$route.params.id}/edit`" />
        <q-separator vertical color="primary" class="opacity-80" /> -->
        <q-btn square icon="label_important" color="primary" class="px-2"
          @click="sheetMenu([
            { label: 'Change', icon: 'edit', color: 'primary', click: () => $router.push(`/income/sales-orders/${$route.params.id}/edit`), disable:!Boolean(record?.state === 'OPEN') },
            { label: 'Approve', icon: 'task_alt', color: 'positive', click: setApproved, hide: record?.state !== 'OPEN' },
            {},
            { label: 'Remove', icon: 'delete', color: 'negative', click:remove, disable: !Boolean(record?.state === 'OPEN') },
          ])"
        />
      </template>
      <template v-slot:right-btn-group>
        <summary-card
          :list="[
            { label: 'Subtotal', value: nominal(SUBTOTAL) },
            { label: 'Discount', value: nominal(DISCOUNT) },
            { label: 'Total', value: nominal(TOTAL) },
          ]"
        />
      </template>
    </page-card>
  </q-page>
</template>

<script setup lang="ts">
import PageCard from 'src/components/PageCard.vue';
import HeaderTitle from 'src/components/HeaderTitle.vue';
import SummaryCard from 'src/components/SummaryCard.vue';
import OrderListItem from 'src/components/OrderListItem.vue';
import { useRecord } from 'src/composables/record';
import { SalesOrderModel } from 'src/types/sales-order';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { Loading } from 'quasar';
import { nominal, sheetMenu } from 'src/boot/system';

defineOptions({
  name: 'SalesOrderViewPage',
});

const $router = useRouter()
const tab = ref('items')

const {
  record, loading, onLoad, onDelete, setConfirm,
} = useRecord<SalesOrderModel['response']>(({
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

const setApproved = () => {
  setConfirm({
    message: 'Are you sure to approved?'
  }).onOk(() => {
    Loading.show()
    api.post(`/api/sales-orders/${record.value?.id}/order-approved`)
      .then(() => onLoad())
      .finally(() => Loading.hide())
  })
}

const remove = () => {
  onDelete(() => {
    $router.replace('/income/sales-orders?refresh=true')
  })
};


const SUBITEMS = computed(() => record.value?.items?.map((e) => ((Number(e.price) - Number(e.discprice)) * Number(e.quantity)), 0) || [])
const SUBTOTAL = computed(() => record.value?.items?.reduce((sum, e) => sum + (Number(e.price) * Number(e.quantity)), 0) || 0)
const DISCOUNT = computed(() => record.value?.items?.reduce((sum, e) => sum + (Number(e.discprice)), 0) || 0)
const TOTAL = computed(() => Number(SUBTOTAL.value) - Number(DISCOUNT.value))

</script>
