import { createApp } from 'petite-vue'
import { StoreService } from '../services/store.service'
import Intersection from '../directives/intersection.directive'
import { styles } from './styles'
import { template } from './template'
import { WidgetActions } from '@/models/store.models'

export class ${{ values.widgetName }}Component {
  constructor(storeService: StoreService) {
    this.init(storeService)
  }

  async init(storeService: StoreService) {
    const { store, config, actions } = storeService.getStore()
    const element = config.isReadOnly ? document.getElementsByClassName('widget-placeholder-container') : config.element
    const methods: WidgetActions = actions()
    const style = document.createElement('style')
    const head = document.head || document.getElementsByTagName('head')[0]
    head.appendChild(style)
    style.appendChild(document.createTextNode(styles))
    if (element.length && config.isReadOnly) {
      element[0].insertAdjacentHTML('beforeend', template)
    } else {
      element.insertAdjacentHTML('beforeend', template)
    }
    const vue = createApp({
      store,
      config,
      methods,
      get${{ values.widgetName }}Class() {
        return ['some-class']
      },
      triggerShownEvent() {
        const appLoadDuration = new Date().getTime() - this.config.startLoadDate.getTime()
        this.methods.trackAppShown({ appLoadDuration })
      },
      setIntersection() {
        return { callback: this.triggerShownEvent }
      },
      textColor() {
        return this.config.textColor
      },
      welcomeText() {
        return this.config.welcomeText
      },
    })
    vue.directive('intersection', Intersection)
    if (element.length && config.isReadOnly) {
      vue.mount(element[0])
    } else {
      vue.mount(element)
    }
  }
}
