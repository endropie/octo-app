<template>
  <q-list>
    <q-item-label header>
      Action Process Lists.
    </q-item-label>
    <q-item v-for="(row, key) in list" clickable :key="key">
      <q-item-section avatar>
        <q-icon color="primary" name="bluetooth" />
      </q-item-section>
      <q-item-section>{{ row.key }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useActionQueue } from 'src/composables/queue';

defineOptions({
  name: 'ActionQueue'
});

const { list } = useActionQueue()



</script>
