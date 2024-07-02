<template>
  <template v-if="$q.screen.lt.sm">
    <q-list class="summary-list">
      <template  v-for="(el, i) in $props.list" :key="i">
        <q-item class="px-0" v-show="isHiddenList(i)">
          <q-item-section>{{ el.label }}</q-item-section>
          <q-item-section side>
            <div>
              {{ el.value }}
              <q-badge label=">" />
            </div>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </template>
  <div v-else class="row justify-end">
    <q-card flat bordered class="flex flex-row" >
      <template v-for="(el, i) in $props.list" :key="i">
        <q-separator inset vertical v-if="i > 0" />
        <q-card-section class="relative min-w-32 pt-6 pb-2">
          <div class="absolute-top text-xs px-2 pt-1 text-uppercase text-grey">{{ el.label }}</div>
          <div class="text-lg font-semibold text-center">{{ el.value }}</div>
        </q-card-section>
      </template>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';


interface DataProp { label: string; value: number | undefined }

defineOptions({
  name: 'SummaryCard',
});

const props = defineProps({
  list: Array<DataProp>
})

const hideList = ref(true)

const isHiddenList = (index: number) => {
  if ((Number(props.list?.length) + 1) === index) return false
  return hideList
}

</script>
<style lang="scss">
.summary-list.q-list--dense > .q-item, .q-item--dense {
  padding-left: 0;
  padding-right: 0;
}
</style>
