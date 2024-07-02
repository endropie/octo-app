
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Dialog, DialogChainObject, QDialogOptions, QForm, useQuasar } from 'quasar';
import { AxiosRequestConfig } from 'axios';
import { api as $api } from 'src/boot/axios';
import { useValidate, useError, useLink } from 'src/composables/utils'
import {
  ErrorResponse,
  RecordProperty,
  RecordResponse,
  RecordResolve,
  RecordReject,
  QueueResponse,
} from 'src/types/resource'
import { useActionQueue } from './queue';


export function useRecord<R, RR = R>(props: RecordProperty<R, RR>) {
  const $q = useQuasar();
  const $router = useRouter();
  const $route = useRoute();
  const link = useLink(props.api.value.resource)
  const { addQueueList } = useActionQueue()

  const loading = ref(false);
  const original = ref<RR | null>();
  const record = ref<RR | null>();
  const form = ref<QForm>();
  const errors = useError();
  const validate = useValidate(record);

  const property = () =>({
    params: props.params || $route.params,
    meta: props.meta || $route.meta,
  })

  const api = {
    load: () => {
      const method = ((props.api.value.load || {})?.method || 'GET');
      const url = `${props.api.value.resource}/${String(property().params.id)}`;
      return ({ method, url, ...(props.api.value.load || {}) });
    },
    submit: () => {
      const url = props.api.value.resource;
      const method = 'POST';

      // const mode = String(property().meta.mode).toLocaleLowerCase();
      // switch (mode) {
      //   case 'create':
      //     method = 'POST';
      //     break;
      //   case 'edit':
      //     method = 'PUT';
      //     url = `${url}/${String(property().params.id)}`;
      //     break;
      //   default:
      //     method = 'POST';
      //     url = `${url}/${String(property().params.id)}`;
      //     break;
      // }

      return ({ method, url, ...(props.api.value.submit || {}) });
    },
    delete: () => {
      const url = `${props.api.value.resource}/${String(property().params.id)}`;
      const method = 'delete';
      return ({ method, url, ...(props.api.value.delete || {}) });
    },
  };

  const onRecord = (doneFn?: CallableFunction) => {
    if (props.api.value.load === null || property().meta.mode === 'create') {

      const getRecord = props.default
      const newRecord = typeof getRecord === 'function' ? getRecord() : {};
      original.value = JSON.parse(JSON.stringify(newRecord)) as RR;
      record.value = JSON.parse(JSON.stringify(newRecord)) as RR;

      if (doneFn) doneFn();
      if (!props.default) {
        console.error('[APP] Resource [create] mode, default data is required!');
      }
    } else {
      loading.value = true;

      // fetch data from "server"
      const { url, method, params } = api.load();
      const request = { url, method, params };

      $api.request<RecordResponse<RR>>(request)
        .then((response) => {
          console.info('[APP] RECORD FETCH', response)
          original.value = JSON.parse(JSON.stringify(response.data.data));
          record.value = JSON.parse(JSON.stringify(response.data.data));
        })
        .catch((error) => {
          const e = error as ErrorResponse;
          const caption = (e.response)
            ? (e.response.data.message || e.message)
            : 'Network Error';

          $q.notify({ message: 'RESOURCE FAILED', caption, type: 'negative' });
          console.error('[APP] RECORD LOAD', e.response || error);
        })
        .finally(() => {
          if (doneFn) doneFn();
          loading.value = false;
        });
    }
  };

  const onRefresh = (doneFn?: CallableFunction) => {
    onRecord(doneFn);
  };

  const onLoad = (doneFn?: CallableFunction) => {
    onRecord(doneFn);
  };

  const onReload = (doneFn?: CallableFunction) => {
    onRecord(doneFn);
  };

  const setConfirm = (options: QDialogOptions): DialogChainObject => {
    return Dialog.create({
      title: 'Confirmation',
      cancel: { color: 'faded', flat: true },
      ok: { bgColor: 'positive' },
      focus: 'cancel',
      ...options,
    });
  };

  const setResolve: RecordResolve<R> = (message, raw, response) => {
    if (raw?.resolve !== false) {
      const call = props.api.value.submit?.resolve;
      if (typeof call === 'function') call(response);
      else {
        const caption = response.message || undefined;
        $q.notify({
          message,
          type: 'positive',
          caption,
        });
      }
    }
  };

  const setReject: RecordReject<R> = (message, raw, error) => {
    if (raw?.reject !== false) {
      const call = props.api.value.submit?.reject
      if (typeof call === 'function') {
        call(error);
      } else {
        const caption = error.response?.data.message || error.message;
        $q.notify({
          message,
          type: 'negative',
          caption,
        });
      }
    }
  };

  const onSubmit = (doneFn?: (data: R) => void) => {

    let options: QDialogOptions = { message: 'sure to submit?' };
    const confirmation = props.api.value?.submit?.confirm
    if (confirmation) {
      options = (typeof confirmation === 'function')
        ? confirmation() : confirmation;
    }

    const submitted = () => {
      loading.value = true;
      const { url, method, params } = api.submit();
      $api.request<RecordResponse<R>>({ url, method, params, data: record.value } as AxiosRequestConfig)
        .then((response) => {
          console.info('[APP] RECORD SUBMIT', response)
          setResolve('SUBMIT SUCCESS', props.api.value.submit, response.data);
          if (doneFn) doneFn(response.data.data);
        })
        .catch((error: ErrorResponse) => {
          if (error.response && error.response.status === 422) {
            validate.errors.set(error.response.data as Record<string, string[]>)
            errors.set(error.response.data as Record<string, string[]>)
          }
          setReject('SUBMIT FAILED', props.api.value.submit, error);
          console.error('[APP] RECORD LOAD', error.response || error);
        })
        .finally(() => {
          loading.value = false;
        });
    }

    if (props.api.value?.submit?.confirm === false) {
      submitted()
    }
    else {
      setConfirm(options)
        .onOk(() => {
          submitted()
        });
    }

  };

  const onQueueSubmit = (doneFn?: (response: QueueResponse) => void) => {

    let options: QDialogOptions = { message: 'sure to submit?' };
    const confirmation = props.api.value?.submit?.confirm
    if (confirmation) {
      options = (typeof confirmation === 'function')
        ? confirmation() : confirmation;
    }

    setConfirm(options)
      .onOk(() => {
        loading.value = true;
        const { url, method, params } = api.submit();
        $api.request<QueueResponse>({ url, method, params, data: record.value } as AxiosRequestConfig)
          .then((response) => {
            setResolve('SUBMIT SUCCESS', props.api.value.submit, response.data);

            if (doneFn) doneFn(response.data);
          })
          .catch((error: ErrorResponse) => {
            if (error.response && error.response.status === 422) {
              validate.errors.set(error.response.data as Record<string, string[]>)
              errors.set(error.response.data as Record<string, string[]>)
            }
            setReject('SUBMIT FAILED', props.api.value.submit, error);
            console.error('[APP] RECORD LOAD', error.response || error);
          })
          .finally(() => {
            loading.value = false;
          });
      });
  };

  const onDelete = (doneFn?: CallableFunction) => {
    if (!props.api.value.delete) return undefined;
    if (!String(property().params.id)) return undefined;

    let options: QDialogOptions = { message: 'sure to delete?' };
    const confirmation = props.api.value.delete?.confirm

    if (confirmation) {
      options = (typeof confirmation === 'function')
        ? confirmation() : confirmation;
    }
    setConfirm(options)
      .onOk(() => {
        loading.value = true;
        const { url, method, params } = api.delete();
        $api.request({ url, method, params } as AxiosRequestConfig)
          .then((response) => {
            console.warn('confirmed', response)
            setResolve('DELETE SUCCESS', props.api.value.delete, response);
            if (doneFn) doneFn();
          })
          .catch((error: ErrorResponse) => {
            setReject('DELETE FAILED', props.api.value.delete, error);
          })
          .finally(() => {
            loading.value = true;
          });
      });
  };

  const onCancel = (doneFn?: CallableFunction) => {
    return $q.dialog({
      title: 'Confirmation',
      message: 'sure to close this form?',
      cancel: { color: 'faded', flat: true },
      ok: { bgColor: 'grey-10' },
      focus: 'cancel',
    }).onOk(() => {
      if (doneFn) doneFn()
      $router.back()
    });
  }

  return {
    meta: $route.meta,
    link,
    errors: computed(() => errors),
    validate,
    original,
    record,
    form,
    loading,
    addQueueList,
    setConfirm,
    onDelete,
    onRefresh,
    onLoad,
    onReload,
    onSubmit,
    onQueueSubmit,
    onCancel
  };
}
