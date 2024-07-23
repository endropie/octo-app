import { boot } from 'quasar/wrappers';
import { NumberFormat } from '@coders-tm/vue-number-format';
import { BottomSheet, Screen, setCssVar } from 'quasar'


const brand = {
  primary: '#334f8d',
  faded: '#497c92',
}

const nominal = (value?: number | string | null, defaultValue = '-') => {
  if (['undefined', 'null'].some(e => e === typeof value)) return defaultValue
  return (new NumberFormat()).format(value as number | string)
}

const sheetMenu = (actions?: Array<Record<string, unknown>>, options?: Record<string, unknown>) => {
  return BottomSheet.create({
    ...options,
    actions
  })
  .onOk((e) => {
    if(typeof e.click === 'function') e.click()
  })
}
export default boot(( ) => {

  Screen.setSizes({ sm: 564, md: 768, lg: 1024, xl: 1280 })
  setCssVar('faded', brand.faded)
  setCssVar('primary', brand.primary)
});

export {
  nominal,
  sheetMenu,
}

