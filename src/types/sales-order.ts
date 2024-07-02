import { CustomerModel } from './customer';
import { ProductModel } from './product';
import { RecordModel } from './resource';

type CustInfo = {
  name?: string | null;
  phone?: string | null;
  address?: string | null;
};

export type SalesOrdeOptionAttribute = {
  taxable: boolean | null;
  tax_inclusive: boolean | null;
  paycust: CustInfo | null;
  shipcust: CustInfo | null;
}

export type SalesOrderItemModel = RecordModel<{
  id: number | string | null;
  type: ProductModel['attrs']['type'];
  product_id: ProductModel['attrs']['id'];
  sku?: string | null;
  name: string | null;
  quantity: number;
  unit: string;
  price: number;
  discprice: number;
  seq: number;
  groupseq: number;
  option: {
    discprice_sen: number | null;
    taxsen_income: number | null;
    taxsen_service: number | null;
  }
}, {
  product: ProductModel['attrs']
}>

export type SalesOrderModel = RecordModel<{
  id: number | string | null;
  customer_id: CustomerModel['attrs']['id'];
  number: string | null;
  date: string;
  due: string | null;
  reference: string | null;
  termcode: string | null;
  description: string | null;
  option: SalesOrdeOptionAttribute | null;
  items: SalesOrderItemModel['attrs'][];
  state?: string;
}, {
  customer: CustomerModel['attrs']
}>

