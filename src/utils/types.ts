export type NavigationType = {
  title: string
  route: string
  image?: string
  subRoute: NavigationType[]
  description?: string
}
export type TypeListType = {
  label: string
  value: string
}
export type PageType = {
  page: number
  perPage: number
}

export enum ToastTypes {
  ADDED = 'added',
  UPDATED = 'updated',
  DELETED = 'deleted',
  DEFAULT = 'default',
}