import { reactive } from 'petite-vue'
import { ${{ values.widgetName }}Event, AnalyticsParams } from '../models/${{ values.widget_name }}-event.models'
import { getDurationStats, YotpoAnalytics, MapObject } from 'widgets-shared-services'
import { PixelEvent } from 'widgets-shared-services'
import { SectionType } from '../models/customizations.models'
import { getViewConfigurations } from '../modules/store.module'
import { WidgetStore, WidgetConfig } from '../models/store.models'
import { v4 as uuidv4 } from 'uuid'
import { getValueOrDefault } from '../services/customizations.service'

export class StoreService {
  private store!: WidgetStore
  private config!: WidgetConfig
  private actions: any

  constructor(
    element: Element,
    customizationsOverrides: MapObject = {},
    staticContent: any = {},
    storeId = '',
    instanceId = '',
    instanceVersionId = '',
    storeLanguage = 'en',
    storeExtraArgs: any = {},
  ) {
    this.createStore(element, customizationsOverrides, staticContent, storeId, instanceId, instanceVersionId, storeLanguage, storeExtraArgs)
  }

  async awaitInitComplete() {
    let retries = 1
    while (!this.store && retries <= 3) {
      await new Promise((resolve) => setTimeout(resolve, retries * 3000))
      retries++
    }
    return Promise.resolve()
  }

  getStore() {
    return { store: this.store as WidgetStore, config: this.config as WidgetConfig, actions: this.actions }
  }

  getConfig() {
    return { config: this.config as WidgetConfig, actions: this.actions }
  }

  createConfig(
    element: Element,
    customizationsOverrides: MapObject = {},
    staticContent: any = {},
    storeId = '',
    instanceId = '',
    instanceVersionId = '',
    storeLanguage = 'en',
    storeExtraArgs: any = {},
  ): WidgetConfig {
    return {
      element: element,
      sectionId: customizationsOverrides['data-yotpo-section-id'],
      storeId: storeId,
      sessionId: uuidv4(),
      instanceId,
      instanceVersionId,
      startLoadDate: storeExtraArgs.startLoadDate || new Date(),
      isReadOnly: getValueOrDefault(customizationsOverrides['mode-read-only'], false),
      isPreview: getValueOrDefault(customizationsOverrides['mode-preview'], false),
      isLoading: getValueOrDefault(customizationsOverrides['mode-is-loading'], false),
      // this is just an example of translation usage ⬇️
      headlineText: getValueOrDefault(customizationsOverrides['write-a-review-text'], 'Write a review'),
      staticContent,
      storeLanguage,
      ...getViewConfigurations(customizationsOverrides),
    }
  }

  createActions() {
    this.actions = (self: any = this) => {
      return {
        trackEvent(event: PixelEvent) {
          if (self.config.isPreview || self.config.isReadOnly) {
            return
          }

          event = {
            ...event,
            context: {
              ...event.context,
              session_id: self.config.sessionId,
              sequence: self.store.sequence.toString(),
              widget_instance_id: self.config.instanceId,
              instance_version_id: self.config.instanceVersionId,
              store_id: self.config.storeId,
              device_type: self.config.deviceType,
              widget_location: getWidgetLocation(self.config.sectionId),
            },
          }

          YotpoAnalytics.track(self.config.storeId, event).catch(() => {})
          self.store.commit('sequence', (self.store.sequence += 1))
        },
        trackAppShown(args: { appLoadDuration: number }) {
          const trackEvent = self.actions().trackEvent
          trackEvent(
            ${{ values.widgetName }}Event.create({
              action: 'shown',
              label: 'app',
              context: {
                app_load_duration: args.appLoadDuration,
              },
            }),
          )
        },
        trackError(args: { label: string; errorMessage: string }) {
          const trackEvent = self.actions().trackEvent
          trackEvent(
            ${{ values.widgetName }}Event.create({
              action: 'error',
              label: args.label,
              context: {
                error_message: args.errorMessage,
              },
            }),
          )
        },
        trackClicked(args: AnalyticsParams) {
          const trackEvent = self.actions().trackEvent
          trackEvent(
            ${{ values.widgetName }}Event.create({
              action: 'clicked_on',
              label: args.label,
              property: args.property,
              context: args.context || {},
            }),
          )
        },
        trackLoaded(args: AnalyticsParams) {
          const trackEvent = self.actions().trackEvent
          trackEvent(
            ${{ values.widgetName }}Event.create({
              action: 'loaded',
              label: args.label,
              property: args.property,
              context: args.context || {},
            }),
          )
        },
        trackWidgetLoaded(args: AnalyticsParams) {
          if (self.store.analyticsLoaded) {
            return
          }
          const context: any = {
            ...args.context,
            status: 'ok',
            //@ts-ignore - waiting for the new version of the shared service by Eran
            duration: getDurationStats(${{ values.widgetName }}Event.category),
          }
          this.trackLoaded({
            label: 'widget',
            property: 'widget',
            context,
          })
          self.store.analyticsLoaded = true
        },
      }
    }
  }

  async createStore(
    element: Element,
    customizationsOverrides: MapObject = {},
    staticContent: any = {},
    storeId = '',
    instanceId = '',
    instanceVersionId = '',
    storeLanguage = 'en',
    storeExtraArgs: any = {},
  ) {
    this.config = this.createConfig(element, customizationsOverrides, staticContent, storeId, instanceId, instanceVersionId, storeLanguage, storeExtraArgs)

    this.store = reactive(this.getReactiveState())
    this.createActions()
  }

  private getReactiveState(): WidgetStore {
    return {
      sequence: 0,
      analyticsLoaded: false,
      commit(propName: string, value: any) {
        switch (propName) {
          case 'sequence':
            this.sequence = value
            break
          default:
            break
        }
      },
    }
  }
}

function getWidgetLocation(section: string) {
  switch (section) {
    case SectionType.PRODUCT:
      return 'PRODUCT'
    case SectionType.CART:
      return 'CART'
    case SectionType.CATEGORY:
      return 'CATEGORY'
    case SectionType.HOME:
      return 'HOMEPAGE'
    default:
      return 'OTHER'
  }
}
