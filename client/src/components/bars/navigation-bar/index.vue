<template>
    <header class="navigation-bar">
        <h1 class="title">{{title}}</h1>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'NavigationBar',
    props: {
        title: {
            type: String,
        }
    },
})
</script>

<style lang="scss" scoped>
    .navigation-bar {
        flex-shrink: 0;
        height: px2rem(44);
        background-color: $color-white;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        .title {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: px2rem($font-size-medium);
        }
        &:after {
            position: absolute;
            left: 0;
            width: 100%;
            bottom: 0;
            height: px2rem(1);
            transform: scale(1, .5);
            transform-origin: center bottom;
            content: '';
            background-color: $border-color-base;
        }
    }
</style>
