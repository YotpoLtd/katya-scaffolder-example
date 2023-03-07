import { ${{values.widget_type}}Event } from './models/${{values.widget_type}}-event.models'
import { ${{values.widget_type}} } from './widget'

// @ts-ignore
if (typeof yotpoWidgetsContainer !== 'undefined') {
  if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
    window.performance.mark(`yotpo:${${{values.widget_type}}Event.category}:loaded`)
  }
  // @ts-ignore
  ;(yotpoWidgetsContainer as any)['${{values.widget_type}}'] = () => new ${{values.widget_type}}()
}
