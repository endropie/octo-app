<template>
  <q-list separator v-bind="$attrs">
    <q-item>
      <q-item-section>
        <q-item-label  class="text-subtitle2">Product Convertion</q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-for="(row, i) in modelValue" :key="i">
      <q-item-section>
        <q-item-label v-if="row.point_id">
          1 {{ UNIT }} <q-icon name="sync_alt" class="mx-2" /> {{ row.rate }} {{ row.product.unit }}
        </q-item-label>
        <q-item-label v-else-if="row.base_id">
          {{ row.rate }} {{ UNIT }} <q-icon name="sync_alt" class="mx-2" /> 1 {{ row.product.unit }}
        </q-item-label>
      </q-item-section>
      <q-item-section avatar v-if="!$props.readonly">
        <q-btn color="red" icon="clear" @click="remove(i)" dense unelevated/>
      </q-item-section>
    </q-item>
    <q-item v-if="!modelValue?.length">
      <q-item-section class="text-grey text-center text-italic">
         --- No products convertables ---
      </q-item-section>
    </q-item>
    <q-item v-if="!$props.readonly">
      <q-item-section>
        <q-btn outline color="primary" label="Add Convertable" @click="addNew()" />
      </q-item-section>
    </q-item>
  </q-list>
  <q-dialog v-model="modalConvert" persistent @hide="onHide">
    <q-card v-if="unitConvert" class="relative w-80 h-96 pb-16">
      <q-bar dark class="bg-primary text-white">
        <div class="col text-center text-weight-bold">
          Unit Convertion
        </div>
      </q-bar>
      <q-card-section class="column h-72">
        <select-resource
          search="api"
          label="Product"
          api-url="/api/products"
          :api-params="{ limit: '*', notIn: [baseId] }"
          option-label="name"
          v-model="unitConvert.product"
          @update:model-value="setUnitProduct"
        />
        <template v-if="unitConvert.product">
          <q-input type="number" input-class="text-right" v-if="reverseConvert"
            v-model="unitConvert.rate"
            :prefix="`1 ${unitConvert.product.unit}: `"
            :suffix="` ${UNIT}`"
          />
          <q-input type="number" input-class="text-right" v-else
            v-model="unitConvert.rate"
            :prefix="`1 ${UNIT}: `"
            :suffix="` ${unitConvert.product.unit}`"
          />
        </template>
        <q-space />

        <q-toggle v-model="reverseConvert" color="primary" label="reverse" left-label @update:model-value="setUnitProduct(unitConvert.product)"/>
      </q-card-section>
      <q-card-actions align="right" class="absolute bottom-0 w-full">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn label="Save" color="primary" :disable="!ALLOW_SETUNIT" @click="setUnitConvert()"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { computed, defineProps, ref, PropType } from 'vue';
</script>
<script lang="ts" setup>
import SelectResource from 'src/components/SelectResource.vue'
import { ConvertableAttribute, ProductModel } from 'src/types/product';

defineOptions({
  name: 'ProductConvertable'
})

const props = defineProps({
  baseId: { type: Number as PropType<ConvertableAttribute['base_id']>},
  baseUnit: { type: String },
  readonly: Boolean,
})

const modelValue = defineModel('modelValue', { type: Array<ProductModel['attrs']['convertable']>, default: null })
const unitConvert = ref(null as null | ConvertableAttribute)
const modalConvert = ref(false);
const reverseConvert = ref(false);

const onHide = () => {
  reverseConvert.value = false;
  modalConvert.value = false;
}
const addNew = () => {
  modalConvert.value = true;
  unitConvert.value = {
    product: null,
    rate: null,
    base_id: null,
    point_id: null,
  }
}

const remove = (index: number) => {
  modelValue.value.splice(index, 1)
}

const setUnitProduct = (v: ProductModel['attrs']) => {
  if (unitConvert.value) {
    unitConvert.value.base_id = null;
    unitConvert.value.point_id = null;
    if (reverseConvert.value) unitConvert.value.base_id = v.id
    else unitConvert.value.point_id = v.id
  }
}

const setUnitConvert = () => {
  modelValue.value.push(unitConvert.value)
  modalConvert.value = false
}

const UNIT = computed(() => props.baseUnit || 'Unit')

const ALLOW_SETUNIT = computed(() => unitConvert.value?.product && unitConvert.value.rate)

</script>
