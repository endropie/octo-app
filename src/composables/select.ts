/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import { QSelect } from 'quasar';
import { api as $api } from 'src/boot/axios';
import { SelectProps } from 'src/types/resource';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export function useSelect<R=any>(property: { (): SelectProps }) {
  const select = ref<QSelect>()
  const options = ref<R[]>([])
  const opts = ref<R[]>([])

  const onFetch = (input = '') => {
    const { props } = property()
    return new Promise<void>((resolve, reject) => {
      if (!props.apiUrl) return reject()

      const request: AxiosRequestConfig = {
        url: String(props.apiUrl),
        method: 'GET',
        params: {
          ...(props.search && props.search === 'api'  ? {} : { 'with-limitation': true, limit: '*' }),
          ...(props.apiParams || {}),
          search: input
        }
      }

      $api.request<AxiosResponse<R[]>>(request)
        .then((response) => {
          console.info('[APP] SELECT LOAD', request.url, response);
          const newOpts = ref<R[]>(response.data.data || []);
          opts.value.splice(0, opts.value.length, ...newOpts.value)
          options.value.splice(0, opts.value.length, ...newOpts.value)
          resolve()
        })
        .catch((e: AxiosError) => {
          console.error('[APP] SELECT LOAD', e.response || e);
          reject()
        })
    })
  };

  const onFilter = (input: string, doneFn: CallableFunction) => {
    if (input === '') {
      doneFn(() => {
        opts.value = options.value
      })
    }
    else {
      doneFn(() => {
        opts.value = options.value.filter((e) => {
          if (typeof e === 'string' && (e).toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0) return true;
          if (typeof e === 'object' && Object.values(e as Record<string, unknown>).some((x: string | unknown) => {
            return typeof x === 'string' && String(x).toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0
          })) return true;
          return false;
        })
      })
    }
  }

  const onApiFilter = (input: string, doneFn: CallableFunction) => {
    onFetch(input).finally(() => void doneFn())
  }

  return {
    onFetch,
    onFilter,
    onApiFilter,
    opts,
    select,
  }

}
