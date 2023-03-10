import { DefaultWithGetter, MapObject, CustomizationKeyValue, DefaultRegex, DefaultRegexWithGetter } from '../models/customizations.models'

export const getValueOrDefault = (value: any, defaultValue: any) => {
  if (value !== undefined && value !== '') {
    switch (typeof value) {
      case 'string':
        return ['true', 'false'].includes(value) ? value === 'true' : (value as string)
      case 'boolean':
        return value
    }
  }
  return defaultValue
}

const isNull = (item: any) => {
  return typeof item === 'undefined' || item === null
}

const cleanBooleanValue = (value: any) => {
  if (value === 'true' || value === 'false') {
    return value === 'true'
  }
  return value
}

const handleItemGetter = (item: any, value: any) => {
  const hasGetter = item.hasOwnProperty('getter')
  if (hasGetter) {
    return (item as DefaultWithGetter<any>).getter(value)
  }
  return value
}

const handleRegexItemGetter = (item: any, key: string, value: any) => {
  const hasGetter = item.hasOwnProperty('getter')
  if (hasGetter) {
    return (item as DefaultRegexWithGetter<any>).getter(key, value)
  }
  return value
}

const getMappedValueFromRegexItem = (item: any, overrides: any) => {
  const hasGetIdAttribute = item.hasOwnProperty('getIdAttribute')
  if (!hasGetIdAttribute) {
    throw new Error(`No getIdAttribute method was specified for regex item "${item}"`)
  }
  const mappedValue: any[] = []
  const keyRegex = new RegExp(item.regex)
  for (const overrideKey in overrides) {
    if (overrideKey.match(keyRegex)) {
      let mappedAttributeValue = cleanBooleanValue(overrides[overrideKey])
      mappedAttributeValue = handleRegexItemGetter(item, overrideKey, overrides[overrideKey])
      const { id, attribute } = (item as DefaultRegex).getIdAttribute(overrideKey) || {}
      if (!isNull(id) && attribute) {
        const existingEntity = mappedValue.find((entity: any) => entity.id === id)
        if (existingEntity) {
          existingEntity[attribute] = mappedAttributeValue
        } else {
          mappedValue.push({
            ...item.defaults,
            id,
            [attribute]: mappedAttributeValue,
          })
        }
      }
    }
  }
  return mappedValue
}

export class Customizations {
  static mapValuesToKeys(initialState: any, overrides: any, strict = true): MapObject {
    const keyMapping: MapObject = {}
    for (const item in initialState) {
      let mappedValue: any
      const currentItem = initialState[item]
      if (currentItem.key) {
        const customizationKey = (currentItem.key as string).toLowerCase()
        mappedValue = currentItem.default
        if (overrides[customizationKey]) {
          mappedValue = cleanBooleanValue(overrides[customizationKey])
        }
        mappedValue = handleItemGetter(currentItem, mappedValue)
      } else if (currentItem.type === 'regex') {
        mappedValue = getMappedValueFromRegexItem(currentItem, overrides)
      } else if (currentItem.key === '' && strict) {
        throw new Error(`No key was specified for "${item}"`)
      } else if (!currentItem.hasOwnProperty('key') && currentItem.hasOwnProperty('default')) {
        mappedValue = currentItem.default
      } else {
        mappedValue = Customizations.mapValuesToKeys(currentItem, overrides)
      }
      keyMapping[item] = mappedValue
    }

    return keyMapping
  }

  static defaults(initialState: any): MapObject {
    return Customizations.mapValuesToKeys(initialState, {})
  }

  static getCustomizationKeys(initialState: any): CustomizationKeyValue {
    const customizationKeys: CustomizationKeyValue = {}
    for (const item in initialState) {
      let keyName: any
      const currentItem = initialState[item]
      if (currentItem.key) {
        keyName = (currentItem.key as string).toLowerCase()
      } else {
        keyName = Customizations.getCustomizationKeys(currentItem)
      }
      customizationKeys[item] = keyName
    }

    return customizationKeys
  }
}
