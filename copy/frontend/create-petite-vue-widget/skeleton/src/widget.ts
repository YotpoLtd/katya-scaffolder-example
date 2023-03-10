import { MerchantMetadata } from 'widget-initializer/src/interfaces/merchant-metadata'
import { Widget } from 'widget-initializer/src/interfaces/widget'
import { WidgetOptions } from 'widget-initializer/src/interfaces/widget-options'
import { loadFonts } from 'widget-initializer/src/utils/font-utils'
import { MapObject } from 'widgets-shared-services'
import { ${{ values.widgetName }}Component } from './components/${{ values.widget_name }}.component'

import { StoreService } from './services/store.service'

export class ${{ values.widgetName }} implements Widget {
  private element!: Element
  private instanceId!: string
  private merchantData!: MerchantMetadata
  private staticContent!: any
  private overridenCustomizations!: MapObject
  private instaceVersionId!: string
  private startLoadDate!: Date
  private areFontsLoaded!: WidgetOptions['areFontsLoaded']
  private storeLanguage!: string

  init(widgetOptions: WidgetOptions): void {
    this.startLoadDate = new Date()
    if (widgetOptions.element.classList.contains('yotpo-widget-instance')) {
      this.element = widgetOptions.element
      this.element.classList.remove('yotpo-widget-instance')
    } else {
      return
    }
    this.instanceId = this.element.getAttribute('data-yotpo-instance-id') || ''
    this.storeLanguage = this.element.getAttribute('data-yotpo-language-code') || ''
    this.instaceVersionId = widgetOptions.metadata.instanceVersionId || ''
    this.merchantData = widgetOptions.merchantData // merchant id of widgetsRepo app_key
    this.staticContent = widgetOptions.metadata.staticContent
    this.areFontsLoaded = widgetOptions.areFontsLoaded
    const customizations = this.getLowerCaseKeysMap(widgetOptions.metadata.customizations)
    this.overridenCustomizations = this.getCustomizations(customizations)
  }

  run() {
    if (this.element === undefined || this.element === null) {
      return
    }
    if (this.overridenCustomizations['mode-read-only']) {
      const fullHtmlElement = document.createElement('div')
      const fullHtmlStyleLink = document.createElement('style')
      fullHtmlElement.innerHTML = '<div class="widget-placeholder-container"></div>'
      document.getElementsByTagName('head')[0].appendChild(fullHtmlStyleLink)
      if (this.element.parentNode) {
        this.element.parentNode.appendChild(fullHtmlElement)
      }
    }
    const storeService: any = new StoreService(this.element, this.overridenCustomizations, this.staticContent, this.merchantData.guid, this.instanceId, this.instaceVersionId, this.storeLanguage, {
      startLoadDate: this.startLoadDate,
    })
    storeService.awaitInitComplete().then(() => {
      const { config } = storeService.getConfig()

      if (!this.areFontsLoaded) {
        const fontFamilyAndUrl = {
          family: config.primaryFont.font.family,
          url: config.primaryFont.font.url,
        }
        loadFonts(document, this.element.parentElement, [fontFamilyAndUrl])
      }
      if (this.element.parentNode && this.overridenCustomizations['mode-read-only']) {
        this.element.parentNode.removeChild(this.element)
      }
      new ${{ values.widgetName }}Component(storeService)
    })
  }

  getLowerCaseKeysMap(map: { [key: string]: string }): {
    [key: string]: string
  } {
    const loweCaseKeysMap: { [key: string]: string } = {}
    Object.keys(map).forEach((key) => {
      loweCaseKeysMap[key.toLowerCase()] = map[key]
    })
    return loweCaseKeysMap
  }

  getCustomizations(customizations: any) {
    const urlParams = this.getQueryParams()
    const elementAttributes = this.getElementAttributes()
    customizations = { ...customizations, ...elementAttributes, ...urlParams }
    return customizations
  }

  getElementAttributes(): { [key: string]: string } {
    const attributes: { [key: string]: string } = {}
    for (let i = 0, atts = this.element.attributes, n = atts.length; i < n; i++) {
      const attributeName = atts[i].nodeName
      attributes[attributeName.toLowerCase()] = (atts[i].nodeValue || '').toString()
    }
    return attributes
  }

  getQueryParams(): any {
    const excludedParams: string[] = []
    const queryString = window.location.search.substring(1)
    const params: any = {}
    const queries = queryString.split('&')
    queries.forEach((indexQuery: string) => {
      if (!excludedParams.includes(indexQuery)) {
        const indexPair = indexQuery.split('=')
        const queryKey = decodeURIComponent(indexPair[0]).toLowerCase()
        const queryValue = decodeURIComponent(indexPair.length > 1 ? indexPair[1] : '')
        // @ts-ignore
        params[queryKey] = queryValue
      }
    })
    return params
  }
}
