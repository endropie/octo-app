<template>
  <q-dialog v-if="!noDialog" v-bind="bind.dialog" v-model="modelValue" ref="dialogRef" persistent>
    <slot v-if="noLayout"></slot>
    <q-layout v-else view="Lhh lpR fff" container
      :class="Dark.isActive ? 'bg-grey-10 text-white' : 'bg-white text-dark'"
    >
    <!-- Slot Header (Title) -->
      <q-header v-if="!noHeader" class="sticky">
        <slot name="header" >
          <q-bar class="bg-primary h-10">
            <q-toolbar-title>
              <slot name="title">{{ title }}</slot>
            </q-toolbar-title>
            <q-btn flat round dense icon="close" @click="noRoute ? modelValue = false : $router.go(-1)" />
          </q-bar>
        </slot>
      </q-header>

      <!-- Main Page -->
      <q-page-container>
        <q-page padding class="max-w-screen-xl mx-auto" style="margin-bottom: -5px">
          <slot></slot>
        </q-page>
      </q-page-container>

      <!-- Slot Footer (Button) -->
      <q-footer v-if="!noFooter" class="sticky shadow-up-2"
        :class="Dark.isActive ? 'bg-dark text-white' : 'bg-white text-dark'"
      >
        <slot name="footer">
          <q-toolbar class="q-gutter-sm max-w-screen-xl mx-auto">
            <slot name="actions"></slot>
          </q-toolbar>
        </slot>
      </q-footer>
    </q-layout>
  </q-dialog>
  <q-card v-else v-bind="bind.card">
    <slot></slot>
    <slot name="footer">
      <q-card-actions>
        <slot name="actions"></slot>
      </q-card-actions>
    </slot>
  </q-card>
</template>

<script lang="ts">
import { ref, defineOptions, defineProps, defineEmits } from 'vue';
import { Dark, useDialogPluginComponent } from 'quasar';
</script>

<script lang="ts" setup>
defineOptions({
  name: 'PageCard',
})
defineEmits([
  ...useDialogPluginComponent.emits
])

const props = defineProps<{
  noRoute?: boolean,
  noLayout?: boolean,
  noDialog?: boolean,
  noHeader?: boolean,
  noFooter?: boolean,
  title?: string,
}>()

const { dialogRef } = useDialogPluginComponent()

const modelValue = ref(true)
const bind = {
  dialog: {
    maximized: props.noLayout ? undefined : true,
  },
  card: {},
};
</script>

<style scoped>
.q-dialog .q-page-container {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
}
</style>
