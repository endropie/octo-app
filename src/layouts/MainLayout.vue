<template>
  <q-layout view="hhh lpR lff">
    <q-header elevated>
      <q-toolbar :style="{ backgroundColor: `var(${$q.dark.isActive ? '--q-dark' : '--q-primary'})` }">
        <q-btn
          flat
          dense
          round
          icon="warehouse"
          aria-label="Company"
          @click="leftDrawer = true"
        />

        <q-toolbar-title>
          ABeCe Corporation
        </q-toolbar-title>
        <q-badge v-if="$q.screen.gt.sm" color="secondary" :label="`AYO[ms] v ${$q.version}`" class="py-2" />
        <account-setting class="ml-2" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawer"
      :mini="miniState"
      mini-to-overlay
      :width="300"
      :breakpoint="768"
      bordered
    >
      <main-menu></main-menu>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AccountSetting from 'components/AccountSetting.vue';
import MainMenu from 'components/MainMenu.vue';

defineOptions({
  name: 'MainLayout'
});

const miniState = ref(true);
const leftDrawer = ref(false);

</script>
