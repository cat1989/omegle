import { createApp } from 'vue'
import store from '@/store'
import router from '@/router'
import App from './App'
import '@/assets/styles/normalize.scss'
import '@/assets/styles/style.scss'

function resetBaseFontSize() {
    const fontSize = Math.min(50, window.innerWidth * .1)
    document.querySelector("html")!.style.fontSize = `${fontSize}px`
}
if (document.readyState == 'loading') {
    document.addEventListener("DOMContentLoaded", resetBaseFontSize)
}
else {
    resetBaseFontSize()
}
window.addEventListener("resize", resetBaseFontSize)

createApp(App).use(router).use(store).mount('#app')
