<template>
  <q-select
    ref="selectResource"
    v-bind="attributes"
    :model-value="$attrs.modelValue"
    :options="opts"
    @filter="onSearch"
    @input-value="onInputValue"
    @popup-show="selectClicked"
  >

    <template v-for="(name) in Object.keys($slots)" v-slot:[getSlotIndex(name)]>
      <slot :name="name"></slot>
    </template>

    <template v-slot:option="scope" v-if="!Object.keys($slots).some(name => name === 'option')">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar v-if="scope.opt.icon">
          <q-icon :name="scope.opt.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ getLabel(scope) }}</q-item-label>
          <q-item-label caption v-if="Boolean(optionCaption)" class="ellipsis-3-lines">
          {{  typeof $props.optionCaption === 'function'
                ? $props.optionCaption(scope.opt)
                : (scope.opt[String($props.optionCaption)] || '') }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:no-option="scope" v-if="useAdd && !Object.keys($slots).some(name => name === 'option')">
      <q-item clickable @click="onCreate()" >
        <q-item-section>
          <div class="row justify-center">
            <q-item-label class="text-primary text-center q-pt-xs q-ml-sm">
              <span class="text-weight-medium">ADD </span>  "{{ scope.inputValue }}"
            </q-item-label>
            <q-icon class="q-pl-sm" name="add_circle_outline" color="primary" size="sm" />
          </div>
        </q-item-section>
      </q-item>
    </template>

  </q-select>
</template>

<script lang="ts">
import { QSelectSlots, QSelect } from 'quasar'
import { useSelect } from 'src/composables/select'
import { defineComponent, computed, ref } from 'vue'

export default defineComponent({
  name: 'SelectResource',
  props: {
    search: [Boolean, String],
    useAdd: Boolean,
    apiParams: Object,
    apiUrl: {
      type: [String],
      required: true,
    },
    optionCaption: {
      type: [String, Function],
    }
  },
  setup(props, vm) {
    const selectResource = ref<QSelect>()

    const { onFetch, onApiFilter, onFilter, opts, select } = useSelect(() => ({ props }))
    let forms = ref(false)
    const inputValue = ref(null)
    const filterInput = ref<string | null>(null)
    const hasLoaded = ref(false)

    const selectClicked = () => { 
      console.log('Select Clicked', hasLoaded.value)
      if (hasLoaded.value === false) {
        selectResource.value?.filter('')
      }
    }

    // onMounted(() => {
    //     if (props.search !== 'api') onFetch()
    // });

    const attributes = computed(() => ({
      useInput: Boolean(props.search),
      fillInput: Boolean(props.search),
      hideSelected: Boolean(props.search),
      inputDebounce: 800,
      ...vm.attrs,
    }))

    const onFIlterLoaded = (str: string, cb: CallableFunction) => {
      if (hasLoaded.value === true ) onFilter(str, cb)
      else {    
        hasLoaded.value = true 
        onFetch(str).finally(() => void cb())
      } 
    }


    return {
      onInputValue: (v: string) => filterInput.value = v,
      onSearch: props.search === 'api' ? onApiFilter 
        : (Boolean(props.search) ? onFIlterLoaded : undefined),
      onCreate: () => {
        forms.value = true
      },
      onAdded: (v: unknown) => {
        forms.value = false
        vm.emit('update:model-value', v)
        select.value?.toggleOption(v)
      },
      getLabel: (scope: unknown) => (scope as { label: string }).label,
      getSlotIndex: (index: unknown) => index as keyof QSelectSlots,
      selectClicked,      
      attributes,
      select,
      opts,
      forms,
      inputValue,
      filterInput
    }
  },
})
</script>
