import { ContactAttribute, RecordModel } from './resource';

export type CustomerModel = RecordModel<{
  id: number | string | null;
  code: string | null;
  name: string;
  option: {
    tax_no?: string | null;
    tax_inclusive?: boolean | null;
    payment_contactable?: boolean
  };
  disabled?: boolean;
} & {
  contact: ContactAttribute | null;
  payment_contact: ContactAttribute | null;
}>

