import { boot } from 'quasar/wrappers';
import { colors, setCssVar } from 'quasar'
const { lighten } = colors
const faded = '#455a64';

export default boot(() => {
  setCssVar('faded', lighten(faded, -5))


});

