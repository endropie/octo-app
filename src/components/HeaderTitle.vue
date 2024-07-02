<template>
  <div :class="`font-medium text-${color} pb-1`" v-bind="$attrs">
    <q-icon v-if="icon" :name="icon" class="text-xl mr-1" />
    <slot name="default">{{ title }}</slot>
  </div>
  <q-separator :color="color" class="q-mb-sm" />
</template>

<script lang="ts" setup>

defineOptions({
  name: 'HeaderTitle',
});


defineProps({
  title: String,
  icon: String,
  color: {
    type: String,
    default: 'faded'
  }
})

</script>
