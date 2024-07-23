export interface MenuItemInterface {
  name: string
  icon: string
  label?: string
  caption?: string
  to?: string
  hide?: boolean
  children?: MenuItemInterface[]
}
