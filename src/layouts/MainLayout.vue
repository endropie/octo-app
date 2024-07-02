<template>
  <q-layout view="hhh lpR lff">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          AYO[ms]
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
      :width="300"
      :breakpoint="500"
      show-if-above
      bordered
      class="column"
    >
      <main-menu class="" />
      <q-space />
      <action-queue class="" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MainMenu from 'components/MainMenu.vue';
import ActionQueue from 'components/ActionQueue.vue';

defineOptions({
  name: 'MainLayout'
});

const miniState = ref(true);

const leftDrawerOpen = ref(false);

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
