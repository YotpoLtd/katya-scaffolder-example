export interface DefaultAndKey<T> {
  default: T
  key: string
}

export interface DefaultRegex {
  type: string
  regex: string
  defaults: any
  getIdAttribute(key: string): { id: number | string; attribute: string }
}

export interface DefaultRegexWithGetter<T> extends DefaultRegex {
  getter(key: string, value: T): T
}

export interface DefaultWithGetter<T> extends DefaultAndKey<T> {
  getter(data: T): T
}

export interface MapObject {
  [index: string]: any
}
export interface CustomizationKeyValue {
  [index: string]: string
}

export enum SectionType {
  PRODUCT = 'product',
  CATEGORY = 'collection',
  HOME = 'index',
  CART = 'cart',
}
