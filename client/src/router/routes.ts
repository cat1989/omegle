import { RouteRecordRaw } from 'vue-router'
import index from '@/views/index'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: index,
        meta: {
            title: 'Index',
        }
    },
]

export default routes
