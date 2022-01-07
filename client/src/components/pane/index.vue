<template>
    <main class="pane">
        <slot></slot>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Pane',
})
</script>

<style lang="scss" scoped>
    .pane {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        background-color: $background-color-base;
    }
</style>
