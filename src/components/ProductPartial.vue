<template>
  <q-list separator v-bind="$attrs">
    <q-item>
      <q-item-section>
        <q-item-label  class="text-subtitle2">Product Partial</q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-for="(row, i) in modelValue" :key="i">
      <q-item-section side>
        <q-item-label caption class="text-bold">{{ row.count }} {{ row.part.unit }}</q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label>
          {{ row.part?.name }}
        </q-item-label>
      </q-item-section>
      <q-item-section avatar v-if="!$props.readonly">
        <q-btn color="red" icon="clear" @click="remove(i)" dense unelevated/>
      </q-item-section>
    </q-item>
    <q-item v-if="!modelValue?.length">
      <q-item-section class="text-grey text-center text-italic">
         --- No products partials ---
      </q-item-section>
    </q-item>
    <q-item v-if="!$props.readonly">
      <q-item-section>
        <q-btn outline color="primary" label="Add Partial" @click="addNew()" />
      </q-item-section>
    </q-item>
  </q-list>
  <q-dialog v-model="modalConvert" persistent @hide="onHide">
    <q-card v-if="partial" class="relative w-80 h-96 pb-16">
      <q-bar dark class="bg-primary text-white">
        <div class="col text-center text-weight-bold">
          Product Partial
        </div>
      </q-bar>
      <q-card-section class="column h-72">
        <select-resource
          search="api"
          label="Product"
          api-url="/api/products"
          :api-params="{ limit: '*', notIn: [baseId] }"
          option-label="name"
          v-model="partial.part"
          @update:model-value="setPartialProduct"
        />
        <template v-if="partial.part">
          <q-input type="number" input-class="text-right"
            v-model="partial.count"
            prefix="amount: "
          />
        </template>
      </q-card-section>
      <q-card-actions align="right" class="absolute bottom-0 w-full">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn label="Save" color="primary" :disable="!ALLOW_SETPARTIAL" @click="setProductPartial()"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { defineProps, computed, ref, PropType } from 'vue';
</script>
<script lang="ts" setup>
import SelectResource from 'src/components/SelectResource.vue'
import { PartialAttribute } from 'src/types/product';

defineOptions({
  name: 'ProductPartial'
})

defineProps({
  baseId: { type: Number as PropType<PartialAttribute['part_id']> },
  readonly: Boolean
})

const modelValue = defineModel('modelValue', { type: Array<PartialAttribute>, default: null })
const modalConvert = ref(false);
const partial = ref(null as PartialAttribute | null);

const onHide = () => {
  modalConvert.value = false;
}
const addNew = () => {
  modalConvert.value = true;
  partial.value = {
    part: null,
    part_id: null,
    count: null,
  }
}

const remove = (index: number) => {
  modelValue.value.splice(index, 1)
}

const setPartialProduct = (v: PartialAttribute['part']) => {
  if (partial.value) {
    partial.value.part_id = v.id;
  }
}

const setProductPartial = () => {
  if (partial.value) {
    modelValue.value.push(partial.value)
    modalConvert.value = false
  }
}

const ALLOW_SETPARTIAL = computed(() => partial.value?.part && Number(partial.value.count) > 0)

</script>
