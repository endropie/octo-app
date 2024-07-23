<template>
  <q-dialog v-if="!noDialog" v-bind="bind.dialog" v-model="modelValue" ref="dialogRef">
    <slot v-if="noLayout"></slot>
    <q-layout v-else view="Lhh lpR fff" container
      :class="Dark.isActive ? 'bg-grey-10 text-white' : 'bg-white text-dark'"
    >
      <!-- Slot Header (Title) -->
      <q-header v-if="!noHeader" class="sticky">
        <slot name="header" >
          <q-bar class="bg-primary h-10">
            <q-btn v-if="!noBackNavigate" flat round dense icon="navigate_before" @click="onBackNavigate()" />
            <q-toolbar-title class="pl-0">
              <slot name="title">{{ title }}</slot>
            </q-toolbar-title>
            <slot name="control"></slot>
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
          <q-toolbar v-if="$slots?.actions" class="pt-1 max-w-screen-xl mx-auto  min-h-8">
            <slot name="actions"></slot>
          </q-toolbar>
          <q-toolbar v-else class="max-w-screen-xl mx-auto row justify-between items-stretch sm:items-center px-0 sm:px-2 min-h-8 sm:min-h-10">
            <q-btn-group v-if="$slots?.['left-btn-group']" square flat>
              <slot name="left-btn-group"></slot>
            </q-btn-group>

            <q-btn-group v-if="$slots?.['right-btn-group']" square flat>
              <slot name="right-btn-group"></slot>
            </q-btn-group>
          </q-toolbar>

        </slot>
      </q-footer>

    </q-layout>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
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
import { useLink } from 'src/composables/utils';
</script>

<script lang="ts" setup>
defineOptions({
  name: 'PageCard',
})
defineEmits([
  ...useDialogPluginComponent.emits
])

const props = defineProps<{
  loading?: boolean,
  noBackNavigate?: boolean,
  noLayout?: boolean,
  noDialog?: boolean,
  noHeader?: boolean,
  noFooter?: boolean,
  routeBack?: string,
  title?: string,
}>()

const { dialogRef } = useDialogPluginComponent()

const link = useLink()

const modelValue = ref(true)
const bind = {
  dialog: {
    maximized: props.noLayout ? undefined : true,
  },
  card: {},
};

function onBackNavigate() {
  link.back(props.routeBack)
}

</script>

<style>
.q-dialog .q-page-container {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
}
/* .q-dialog .q-layout-container div.scroll {
  height: 100%;
} */
</style>
