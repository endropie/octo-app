<template>
  <q-page padding class="column justify-evenly">
    <page-card :title="`Customer [${original?.code || '--'}] - FORM`">
      <q-card class="min-h-80" v-if="record">
        <q-card-section class="flex flex-col md:flex-row  gap-8 mb-5">
          <div class="flex-1">
            <div class="text-subtitle2 text-grey">General Information</div>
            <q-separator  />
            <q-input v-model="record.name" type="text" label="Name" class="flex-1"/>
            <q-input v-model="record.code" type="text" prefix="Internal Code: " class="flex-1" input-class="text-grey"/>
          </div>
          <div class="flex-1">
            <div class="text-subtitle2 text-grey">Taxes</div>
            <q-separator  />
            <div v-if="record.option">
              <q-input v-model="record.option.tax_no" type="text" prefix="No. Tax: " class="flex-1"/>
              <q-checkbox v-model="record.option.tax_inclusive" left-label label="Tax Inclusive" />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="flex flex-col md:flex-row  gap-8 mb-5">
          <div class="flex-1">
            <div class="text-subtitle2 text-grey">Contact Information</div>
            <q-separator  />
            <div v-if="record.contact">
              <q-input v-model="record.contact.phone" type="text" label="Phone" />
              <q-input v-model="record.contact.mobile" type="text" label="Mobile" />
              <q-input autogrow v-model="record.contact.street" type="textarea" label="Street" input-class="h-6" />
              <div class="flex flex-row gap-2">
                <q-input v-model="record.contact.city" type="text" label="City" class="flex-grow"/>
                <q-input v-model="record.contact.zipcode" type="text" label="Zipcode" class="w-20"/>
              </div>
            </div>
          </div>

          <div class="flex-1">
            <div class="row">
              <span  class="text-subtitle2 text-grey">Payment Contact Information</span>
              <q-space />
              <q-toggle dense v-if="record.option" :model-value="PaymentContactable" @update:model-value="setPaymentContactable" color="green" />
            </div>
            <q-separator  />
            <div v-if="record.payment_contact">
              <q-input v-model="record.payment_contact.phone" type="text" label="Phone" />
              <q-input v-model="record.payment_contact.mobile" type="text" label="Mobile" />
              <q-input autogrow v-model="record.payment_contact.street" type="textarea" label="Street" input-class="h-6" />
              <div class="flex flex-row gap-2">
                <q-input v-model="record.payment_contact.city" type="text" label="City" class="flex-grow"/>
                <q-input v-model="record.payment_contact.zipcode" type="text" label="Zipcode" class="w-20"/>
              </div>
            </div>
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
const state = reactiveStore('customer-form', {
  primarySaving: null as string | null
})

const newContact = () => JSON.parse(JSON.stringify({
  phone: null,
  mobile: null,
  street: null,
  city: null,
  zipcode: null,
})) as ContactAttribute

const newOption = () => JSON.parse(JSON.stringify({
  tax_no: null,
  tax_inclusive: false,
}));
</script>

<script setup lang="ts">
import PageCard from 'src/components/PageCard.vue';
import BtnDropOnce from 'src/components/BtnDropOnce.vue';
// import SelectResource from 'src/components/SelectResource.vue';
import { useRecord } from 'src/composables/record';
import { CustomerModel } from 'src/types/customer';
import { ContactAttribute } from 'src/types/resource';
import { computed, onMounted, onUpdated, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'CustomerFormPage',
});

const $router = useRouter()

const { primarySaving } = toRefs(state)

const {
  record, loading, link, original, onLoad, onSubmit,
} = useRecord<CustomerModel['response'], CustomerModel['attrs']>(({
  api: ref( {
    resource: '/api/customers',
    load: {
      params: {
        includes: ['contact', 'payment_contact'],
        fields: ['contact.*', 'payment_contact.*']
      }
    },
    delete: {
      confirm: {
        message: 'Are you sure to delete this record ?'
      }
    }
  }),
  default: () => ({
    id: null,
    code: null,
    name: null,
    contact: newContact(),
    option: newOption(),
  }),
}));

const onLoadRecord = (cb ?: CallableFunction) => {
  onLoad(() => {
    record.value.option = {
      ...newOption(),
      ...(record.value.option || {})
    }
    if (!record.value.contact) record.value.contact = newContact()
    if (cb) cb()
  })

}

onUpdated(() => {
  onLoadRecord()
})

onMounted(() => {
  onLoadRecord(() => {
    // statement code here...
  });
});
const PaymentContactable = computed(() => Boolean(record.value?.payment_contact))

const save = () => onSubmit((data) => {
  void $router.replace(`/setting/customers/${data.id}`)
})

const saveNew = () => onSubmit(() => {
  void $router.replace('/setting/customers/create')
})

const setPaymentContactable = (v: boolean) => {
  record.value.payment_contact = record.value.payment_contact ? null : newContact()
}

</script>
