<template>
    <div class="text-field">
        <input
            type="text"
            v-model="input"
            :placeholder="placeholder"
            :maxlength="maxlength"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'TextField',
    props: {
        value: {
            type: String,
            required: true,
        },
        placeholder: {
            type: String,
        },
        maxlength: {
            type: Number,
            default: 32,
        },
    },
    setup({
        value,
    }) {
        const input = ref(value)
    },
})
</script>

<style lang="scss" scoped>
    .text-field {
        
    }
</style>
