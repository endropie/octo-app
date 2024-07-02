import { QueueRaw } from 'src/types/resource';
import { reactive, toRef } from 'vue';

const state = reactive({
  list: [] as QueueRaw[]
})

export function useActionQueue() {
  const list = toRef(state.list);
  const addQueueList = (e: QueueRaw) => {
    state.list.push(e)
  };
  const removeQueueList = (index: number, length?: number) => {
    state.list.splice(index, length || 1)
  };

  return {
    list,
    addQueueList,
    removeQueueList
  }
}
