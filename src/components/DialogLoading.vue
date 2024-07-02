<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" maximized>
    <q-card class="q-dialog-plugin column items-center justify-center  text-grey">
      <q-card-section class=" text-uppercase text-bold">
        {{  title  }}
      </q-card-section>
      <q-card-section class="q-mb-md" style="height: 100pt;">
        <q-inner-loading showing>
          <q-spinner-gears size="50pt" color="primary" />
        </q-inner-loading>
      </q-card-section>
      <q-card-section>
        please wait
        <span v-if="action">
          or
          <q-btn dense flat v-bind="action" />
          {{ caption || 'run the process behind the application' }}
        </span>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { defineOptions, defineProps, defineEmits } from 'vue';
import { useDialogPluginComponent, QBtnProps } from 'quasar';
</script>
<script lang="ts" setup>

defineOptions({
  name: 'PageCard',
})
defineEmits([
  ...useDialogPluginComponent.emits
])

defineProps<{
  caption?: string,
  title?: string,
  action?: QBtnProps
}>()

const { dialogRef } = useDialogPluginComponent()

</script>

<style>

</style>
