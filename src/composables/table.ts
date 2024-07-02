import { ref } from 'vue';
import { QDialogOptions, useQuasar } from 'quasar';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { api as $api } from 'src/boot/axios';
import {
  ErrorResponse,
  TableProperty,
  TableResponse,
  TableRequest,
  TableFetch,
  RecordResponse,
} from 'src/types/resource';

const newPagination = () => ({
  sortBy: null,
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
})


export default function useTable<R>(property: TableProperty<R>) {
  const $q = useQuasar();

  const rows = ref<R[]>([]);
  const loading = ref(false);

  if (!property.pagination) property.pagination = ref(newPagination())

  const api = {
    load: () => {
      const url = property.api.value.resource
      const method = (property.api.value.load?.method || 'GET');
      const params = (property.api.value.load?.params || {})
      return ({ url, method, params });
    },
    delete: (id: string | number) => {
      const url = `${property.api.value.resource}/${String(id)}`;
      const method = 'delete';
      const params = property.api.value.delete?.params
      return ({ method, url, params });
    },
  };

  const onFetch: TableFetch<R> = (vp = null) => {
    const { url, method, params } = api.load();
    const page = vp?.pagination?.page || property.pagination?.value?.page;
    const rowsPerPage = vp?.pagination?.rowsPerPage || property.pagination?.value?.rowsPerPage;

    const request = {
      url, method, params: { ...params, limit: rowsPerPage, page }
    };
    return $api.request<TableResponse<R>>(request);
  };


  const onRequest: TableRequest = (vp, doneFn = null) => {
    const page = vp?.pagination?.page;
    const rowsPerPage = vp?.pagination?.rowsPerPage;


    loading.value = true;
    onFetch(vp)
    .then((response) => {
        console.info('[APP] TABLE FETCH', response)
        // set rows of data table
        const newRows = ref<R[]>(response.data.data);
        rows.value.splice(0, rows.value.length, ...newRows.value);

        // Update local pagination object
        if (property.pagination) property.pagination.value = {
          ...property.pagination?.value,
          page: Number(page),
          rowsPerPage: rowsPerPage,
          rowsNumber: response.data.meta?.total || 0,
        }
      })
      .catch((error) => {
        const e = error as ErrorResponse;
        console.error('[APP] TABLE LOAD', e.response || e);
        const caption = (e.response)
          ? (e.response?.data.message || e.message)
          : 'Network Error';

        $q.notify({ message: 'RESOURCE FAILED', caption, type: 'negative' });
      })
      .finally(() => {
        if (doneFn) doneFn();
        loading.value = false;
      });
  };

  const onRefresh = (doneFn?: CallableFunction) => {
    onRequest({ pagination: property.pagination?.value }, doneFn);
  };

  const onLoad = (doneFn?: CallableFunction) => {
    onRequest({ pagination: property.pagination?.value }, (doneFn || null));
  };

  const setConfirm = (options: QDialogOptions) => {
    return $q.dialog({
      title: 'Confirmation',
      cancel: { color: 'faded', flat: true },
      ok: { bgColor: 'primary' },
      focus: 'cancel',
      ...options,
    });
  };

  const setResolve = (message: string, response: AxiosResponse<RecordResponse<R>>) => {
    if (property.api.value.delete?.resolve !== false) {
      const call = property.api.value.delete?.resolve;
      if (typeof call === 'function') call(response.data);
      else {
        onRefresh()
        const caption = response.data.message || undefined;
        $q.notify({
          message,
          type: 'positive',
          caption,
        });
      }
    }
  };

  const setReject = (message: string, error: ErrorResponse) => {
    if (property.api.value.delete?.reject !== false) {
      const call = property.api.value.delete?.reject
      if (typeof call === 'function') call(error);
      else {
        const caption = error.response?.data.message || error.message;
        $q.notify({
          message,
          type: 'negative',
          caption,
        });
      }
    }
  };

  const onDelete = (id: number | string) => {

    let options: QDialogOptions = { message: 'sure to delete?' };
    const confirmation = property.api.value.delete?.confirm

    if (confirmation) {
      options = (typeof confirmation === 'function')
        ? confirmation() : confirmation;
    }

    return new Promise((resolve, reject) => {
      setConfirm(options)
        .onOk(() => {
          loading.value = true;
          const { url, method, params } = api.delete(id);
          $api.request<RecordResponse<never>>({ url, method, params } as AxiosRequestConfig)
            .then((response) => {
              resolve(response.data);
              setResolve('DELETE SUCCESS', response);
            })
            .catch((error) => {
              reject(error);
              setReject('DELETE FAILED', error);
            })
            .finally(() => {
              loading.value = true;
            });
        });
    })
  };

  return {
    rows,
    pagination: property.pagination,
    loading,
    onRequest,
    onRefresh,
    onLoad,
    onDelete,
  };
}
