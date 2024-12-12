import { createApp } from 'vue'
import App from './App.vue'
import { GridLayout, GridItem } from 'grid-layout-plus'

createApp(App).component('GridLayout', GridLayout).component('GridItem', GridItem).mount('#app')
