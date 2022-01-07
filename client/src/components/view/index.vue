<template>
    <article class="view">
        <slot></slot>
    </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'View',
})
</script>

<style lang="scss" scoped>
    .view {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        bottom: 0;
        display: flex;
        flex-direction: column;
        background-color: $color-white;
        overflow: hidden;
        box-shadow: $box-shadow-base;
    }
</style>
