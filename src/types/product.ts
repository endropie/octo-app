import { RecordModel } from './resource';

export type ConvertableAttribute = {
  base_id?: ProductModel['attrs']['id'];
  point_id?: ProductModel['attrs']['id'];
  product?: ProductModel['attrs'] | null;
  rate: number | null;
}

export interface PartialAttribute {
  part_id: ProductModel['attrs']['id'];
  part: ProductModel['attrs'] | null;
  count: number | null;
}

export type ProductModel = RecordModel<{
  id: number | string | null;
  sku: string | null;
  name: string;
  sale_price: number;
  purchase_price: number;
  description: string;
  category_id: CategoryModel['attrs']['id'];
  convertable: ConvertableAttribute[];
  partials: PartialAttribute[];
  option: {
    taxsen_income: number | null;
    taxsen_service: number | null;
  }
  published?: boolean;
  disabled?: boolean;
}>

export type CategoryModel = RecordModel<{
  id: number | string | null;
  name: string;
}>
