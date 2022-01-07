<template>
    <View>
        <NavigationBar title="Omegle"></NavigationBar>
        <Pane ref="pane">
            <ul class="list">
                <li
                    v-for="message in messages"
                    :key="message.id"
                >
                    <template v-if="message.uuid === ''">
                        <div class="info">{{message.title}}</div>
                    </template>
                    <template v-else-if="uuid === message.uuid">
                        <label class="primary">You: </label>{{message.title}}
                    </template>
                    <template v-else>
                        <label class="danger">Stranger: </label>{{message.title}}
                    </template>
                </li>
            </ul>
            <!-- <ul class="table">
                <li
                    v-for="message in messages"
                    :key="message.id"
                    :class="['table-row', uuid === message.uuid ? 'right' : '']"
                >
                    <template v-if="uuid === message.uuid">
                        <div class="title">{{message.title}}</div>
                        <div class="image"></div>
                    </template>
                    <template v-else>
                        <div class="image"></div>
                        <div class="title">{{message.title}}</div>
                    </template>
                </li>
            </ul> -->
        </Pane>
        <section class="toolbar">
            <button
                type="button"
                @click="stop"
                class="button"
            >{{getButtonText}}</button>
            <input
                type="text"
                v-model="value"
                placeholder="Type your message..."
                maxlength="100"
                class="text-field"
                @keyup.enter="send"
                :disabled="!isConnected"
            />
            <button
                type="button"
                @click="send"
                class="button primary"
                :disabled="!isConnected"
            >Send</button>
        </section>
        <!-- <div class="block" ref="block"></div> -->
    </View>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import { View, Pane } from '@/components'
import { NavigationBar } from '@/components/bars'
import { v4 } from 'uuid'
import { debounce } from '@/utils/decorator'

type Message = {
    id: string;
    uuid: string;
    title: string;
    created_at: number;
    to: string;
}

export default defineComponent({
    components: {
        [View.name]: View,
        [Pane.name]: Pane,
        [NavigationBar.name]: NavigationBar,
    },
    setup() {
        const value = ref('')
        const uuid = ref('')
        const to = ref('')
        const pane = ref<HTMLElement>()
        let ws: WebSocket
        const state = ref(WebSocket.CLOSED)
        const messages = reactive<Message[]>([])
        const getButtonText = computed(() => {
            switch (state.value) {
                case WebSocket.OPEN:
                    return 'Stop'
                default:
                    return 'Start'
            }
        })
        const isConnected = computed(() => {
            return state.value === WebSocket.OPEN
        })
        const send = debounce((evt: MouseEvent) => {
            if (state.value !== WebSocket.OPEN) {
                return
            }
            const body = {
                id: v4(),
                uuid: uuid.value,
                title: value.value,
                created_at: Date.now(),
                to: to.value,
            }
            const message = {
                type: 'message',
                body,
            }
            messages.push(body)
            value.value = ''
            ws.send(JSON.stringify(message))
            // if (pane.value) {
            //     console.log(pane.value)
            //     pane.value.scrollTop = pane.value.scrollHeight - pane.value.clientHeight
            // }
        }, 100)
        const start = () => {
            messages.length = 0
            ws = new WebSocket('ws://localhost:3000')
            ws.addEventListener("open", () => {
                
            })
            ws.addEventListener("message", ({
                data,
            }) => {
                const { type, body } = JSON.parse(data)
                switch (type) {
                    case 'connect':
                        uuid.value = body.uuid
                        console.log(`connect: ${uuid.value}`)
                        break
                    case 'chat':
                        to.value = body.uuid
                        console.log(`chat: ${to.value}`)
                        state.value = ws.readyState
                        messages.push({
                            id: v4(),
                            uuid: '',
                            title: "You're now chatting with a random stranger. Say hi!",
                            created_at: Date.now(),
                            to: '',
                        })
                        break
                    case 'message':
                        messages.push(body)
                        break
                    case 'disconnect':
                        messages.push({
                            id: v4(),
                            uuid: '',
                            title: "Stranger has disconnected.",
                            created_at: Date.now(),
                            to: '',
                        })
                        ws.close()
                        state.value = ws.readyState
                        break
                }
            })
            ws.addEventListener("error", () => {

            })
            state.value = ws.readyState
        }
        const stop = (evt: MouseEvent) => {
            if (ws.readyState == WebSocket.OPEN) {
                ws.close()
                state.value = ws.readyState
                messages.push({
                    id: v4(),
                    uuid: '',
                    title: "You have disconnected.",
                    created_at: Date.now(),
                    to: '',
                })
            }
            else {
                start()
            }
        }
        start()
        const block = ref<HTMLDivElement>()
        onMounted(() => {
            //const rect = block.value?.getBoundingClientRect()
            const rect = {
                top: block.value?.style.top,
                left: block.value?.style.left,
                bottom: block.value?.style.bottom,
                right: block.value?.style.right,
            }
            //alert(JSON.stringify(rect))
        })
        return {
            uuid,
            value,
            send,
            messages,
            pane,
            stop,
            state,
            getButtonText,
            isConnected,
            block,
        }
    },
})
</script>

<style lang="scss" scoped>
.block {
    top: constant(safe-area-inset-top);
    top: env(safe-area-inset-top);
    bottom: constant(safe-area-inset-bottom);
    bottom: env(safe-area-inset-bottom);
    position: fixed;
    left: constant(safe-area-inset-left);
    left: env(safe-area-inset-left);
    right: constant(safe-area-inset-right);
    right: env(safe-area-inset-right);
}
    .list {
        list-style: none;
        padding: px2rem($border-radius-base * 2);
        li {
            word-break: break-all;
            color: $color-text-regular;
            label {
                font-weight: 600;
                &.primary {
                    color: $color-primary;
                }
                &.danger {
                    color: $color-danger;
                }
            }
            .info {
                color: $color-info;
            }
        }
    }
    .table {
        list-style: none;
        padding: 0 px2rem($font-size-base);
        .table-row {
            margin: px2rem($font-size-base) 0;
            display: flex;
            padding-right: px2rem($font-size-base * 2 + 32);
            .image {
                width: px2rem(32);
                height: px2rem(32);
                border-radius: px2rem($border-radius-base);
                background: $color-text-placeholder no-repeat center;
                background-size: cover;
                margin-right: px2rem($font-size-base);
                flex-shrink: 0;
            }
            .title {
                padding: px2rem($border-radius-base * 2) px2rem($font-size-base);
                background-color: $color-white;
                border-radius: px2rem($border-radius-base);
                word-break: break-all;
            }
            &.right {
                padding-right: 0;
                padding-left: px2rem($font-size-base * 2 + 32);
                justify-content: flex-end;
                .image {
                    margin-right: 0;
                    margin-left: px2rem($font-size-base);
                }
            }
        }
    }
    .toolbar {
        height: px2rem(49);
        background-color: $border-color-extra-light;
        position: relative;
        display: flex;
        padding: 0 px2rem($font-size-base);
        align-items: center;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        &:before {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: px2rem(1);
            transform: scale(1, .5);
            background-color: $border-color-base;
            content: '';
        }
        .text-field {
            height: px2rem(32);
            border: 0;
            border-radius: px2rem($border-radius-base);
            background-color: $color-white;
            padding: 0 px2rem($border-radius-base * 2);
            flex: 1;
            margin: 0 px2rem($font-size-base);
            &::-webkit-input-placeholder {
                color: $color-text-placeholder;
            }
        }
        .button {
            height: px2rem(32);
            background-color: $border-color-light;
            color: $color-white;
            display: flex;
            align-items: center;
            padding: 0 px2rem($font-size-base);
            font-size: px2rem($font-size-medium);
            border: 0;
            flex-shrink: 0;
            border-radius: px2rem($border-radius-base);
            &:not(:disabled) {
                cursor: pointer;
                &.primary {
                    background-color: $color-primary;
                    color: $color-white;
                }
            }
            &:disabled {
                cursor: not-allowed;
            }
        }
    }
</style>
