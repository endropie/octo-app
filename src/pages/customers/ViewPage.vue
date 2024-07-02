<template>
  <q-page class="column items-center justify-evenly">
    <page-card :title="`CUSTOMER [${record?.id || '--'}] - DETAIL`">
      <q-card class="min-h-80" v-if="record">
        <q-card-section class="flex flex-col md:flex-row  gap-8 mb-5">
          <div class="flex-1">
            <div class="text-subtitle2 text-grey">General Information</div>
            <q-separator  />
            <q-input readonly v-model="record.name" type="text" label="Name" class="flex-1"/>
            <q-input readonly v-model="record.code" type="text" prefix="Internal Code: " class="flex-1" input-class="text-grey"/>
          </div>
          <div class="flex-1">
            <div class="text-subtitle2 text-grey">Taxes</div>
            <q-separator  />
            <div v-if="record.option">
              <q-input readonly v-model="record.option.tax_no" type="text" prefix="No. Tax: " class="flex-1"/>
              <q-checkbox disable v-model="record.option.tax_inclusive" left-label label="Tax Inclusive" />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="flex flex-col md:flex-row  gap-8 mb-5">
          <div class="flex-1">
            <div class="text-subtitle2 text-grey">Contact Information</div>
            <q-separator  />
            <div v-if="record.contact">
              <q-input readonly v-model="record.contact.phone" type="text" label="Phone" />
              <q-input readonly v-model="record.contact.mobile" type="text" label="Mobile" />
              <q-input readonly autogrow v-model="record.contact.street" type="textarea" label="Street" input-class="h-6" />
              <div class="flex flex-row gap-2">
                <q-input readonly v-model="record.contact.city" type="text" label="City" class="flex-grow"/>
                <q-input readonly v-model="record.contact.zipcode" type="text" label="Zipcode" class="w-20"/>
              </div>
            </div>
            <div v-else class="text-center text-grey-7 my-6 text-italic">
              -- No customer contact --
            </div>
          </div>

          <div class="flex-1">
            <div class="row">
              <span  class="text-subtitle2 text-grey">Payment Contact Information</span>
            </div>
            <q-separator  />
            <div v-if="record.payment_contact">
              <q-input readonly v-model="record.payment_contact.phone" type="text" label="Phone" />
              <q-input readonly v-model="record.payment_contact.mobile" type="text" label="Mobile" />
              <q-input readonly autogrow v-model="record.payment_contact.street" type="textarea" label="Street" input readonly-class="h-6" />
              <div class="flex flex-row gap-2">
                <q-input readonly v-model="record.payment_contact.city" type="text" label="City" class="flex-grow"/>
                <q-input readonly v-model="record.payment_contact.zipcode" type="text" label="Zipcode" class="w-20"/>
              </div>
            </div>
            <div v-else class="text-center text-grey-7 my-6 text-italic">
              -- No customer payment contact --
            </div>
          </div>
        </q-card-section>
      </q-card>
      <template v-slot:actions>
        <q-btn label="Back" color="primary" @click="link.back()"/>
        <q-space />
        <q-btn flat label="Edit" color="primary" :to="`/setting/customers/${$route.params.id}/edit`"/>
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
import { useRecord } from 'src/composables/record';
import { CustomerModel } from 'src/types/customer';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'CustomerViewPage',
});
const $router = useRouter()

const {
  record, loading, link, onLoad, onDelete
} = useRecord<CustomerModel['response']>(({
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
}));

onMounted(() => {
  onLoad(() => {
    // statement code here...
  });
});

const remove = () => {
  onDelete(() => {
    $router.replace('/setting/customers?refresh=true')
  })
};
</script>
