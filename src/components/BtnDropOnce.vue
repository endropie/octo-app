<template>
  <q-btn-dropdown
    v-bind="$attrs"
    dropdown-icon="more_horiz"
    split
    color="primary"
    :label="primarySelected?.label"
    @click="primarySelected?.click()"
  >
    <q-list>
      <q-item v-for="(e,i) in props.data" :key="i" clickable v-close-popup @click="setPrimary(e.name)">
        <q-item-section>
          <q-item-label>{{  e.label  }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
<script lang="ts">
import { computed, defineProps } from 'vue';
</script>
<script lang="ts" setup>

defineOptions({
  name: 'BtnDropOnce'
})

const primary = defineModel('primary', { type: String, default: null })

const props = defineProps<{
  data: {
    name: string;
    label: string;
    click: () => void
  }[];
}>()

const primarySelected = computed(() => {
  if (!props.data.length) return null
  if (primary.value) return props.data.find(e => e.name === primary.value)
  return props.data[0]
})

const setPrimary = (name: string) => {
  if (props.data.some(e => e.name === name)) {
    // state.primary = name
    primary.value = name
  }
}
</script>
