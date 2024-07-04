export type NavigationType = {
  title: string
  route: string
  subRoute: NavigationType[]
}
export type TypeListType = {
  label: string
  value: string
}
export type PageType = {
  page: number
  perPage: number
}