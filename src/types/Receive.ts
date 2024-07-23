import { ProductModel } from './product';
import { RecordModel } from './resource';

export type ReceiveOrderModel = RecordModel<{
  id: number | string
  number: string
  date: string
  reference: string
  state: 'OPEN' |  'CLOSE'
}>

export type ReceiveOrderItemModel = RecordModel<{
  id: number | string
  pallet: string
  receive_order_id: number | string
  product_id: number | string
  amount: number
  mounts: ReceiveMountModel['attrs'][] | null
}, {
  product: ProductModel['attrs']
  receive_order: ReceiveOrderModel['attrs']
}>

export type ReceiveMountModel = RecordModel<{
  id: number | string
  receive_order_item_id?: number | string
  amount: number
}, {
  product: ProductModel['attrs']
  receive_order_item: ReceiveOrderItemModel['attrs']
}>
