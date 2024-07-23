<template>
  <div class="flex-grow row justify-end items-end" v-bind:class="$attrs.class">
    <q-card v-if="$q.screen.lt.sm" flat @click="dialog = true">
      <q-card-section class="row py-0 px-2 cursor-pointer no-wrap">
        <div class="py-0 text-center">
          <div class="text-xxs text-uppercase text-grey pb-0.5">{{ SUMMARY.label }}</div>
          <div class="text-lg font-semibold text-primary leading-none">{{ SUMMARY.value }}</div>
        </div>
        <q-icon name="arrow_drop_up" size="md" color="grey" class="leading none mt-1" />
      </q-card-section>
    </q-card>
    <q-card v-else flat class="flex flex-row" >
      <template v-for="(el, i) in $props.list" :key="i">
        <q-separator inset vertical v-if="i > 0" />
        <q-card-section class="text-center min-w-24 md:min-w-28 p-1">
          <div class="text-xxs text-uppercase text-grey">{{ el.label }}</div>
          <div class="text-lg text-primary font-semibold leading-none mt-0.5 px-4">{{ el.value }}</div>
        </q-card-section>
      </template>
    </q-card>
  </div>
  <q-dialog v-model="dialog" position="bottom">
      <q-card square style="width: 350px">
        <q-card-section>
          <q-list dense class="summary-list">
            <template  v-for="(el, i) in $props.list" :key="i">
              <q-item class="px-0">
                <q-item-section>{{ el.label }}</q-item-section>
                <q-item-section side>
                  {{ el.value }}
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
import { ref, Prop, computed } from 'vue';


interface DataProp { label: string; value: string | number | undefined }

defineOptions({
  name: 'SummaryCard',
});

const props = defineProps({
  total: Object as Prop<DataProp>,
  list: Array<DataProp>
})

const dialog = ref(false)


const SUMMARY = computed(() => {

  const last = props.list?.find((e, i) => i === Number(props.list?.length) - 1) || null

  return ({
    label: props.total?.label || last?.label || 'Total',
    value: props.total?.value || last?.value || 0
  })
})

</script>
<style lang="scss">
.summary-list.q-list--dense > .q-item, .q-item--dense {
  padding-left: 0;
  padding-right: 0;
}
</style>
