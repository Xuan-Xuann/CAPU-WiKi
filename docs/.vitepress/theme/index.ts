import DefaultTheme from 'vitepress/theme'
import { installWikiComponents } from 'vitepress-qutwiki-kit'
import Layout from './Layout.vue'
import MapView from './components/MapView.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    installWikiComponents(app)
    app.component('MapView', MapView)
  },
}
