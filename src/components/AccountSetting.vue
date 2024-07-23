<template>
  <q-btn dense flat rounded size="lg" icon="account_circle" aria-label="Account" >
    <q-menu>
      <div class="row no-wrap q-pa-md">
        <div class="column">
          <div class="text-h6 q-mb-md">Settings</div>
          <q-toggle :model-value="$q.dark.isActive" @update:model-value="(v) => $q.dark?.set(v)" label="Dark mode" />
          <!-- <q-toggle v-model="bluetooth" label="Bluetooth" /> -->
        </div>

        <q-separator vertical inset class="q-mx-lg" />

        <div class="column items-center">
          <q-avatar size="72px">
            <!-- <img src="https://cdn.quasar.dev/img/avatar4.jpg"> -->
            <q-icon name="person" />
          </q-avatar>

          <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

          <q-btn
            color="primary"
            label="Logout"
            push
            size="sm"
            v-close-popup
          />
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<script lang="ts" setup>

defineOptions({
  name: 'AccountSetting'
})

</script>
