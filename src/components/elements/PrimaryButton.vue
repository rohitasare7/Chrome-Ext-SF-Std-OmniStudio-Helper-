<script setup>
defineProps({
    type: {
        type: String,
        default: 'submit',
    },
    isRed: Boolean,
    isBlue: Boolean,
});
</script>

<template>
    <button :type="type" :class="{
        'bg-gray-800 hover:bg-gray-700': !isRed && !isBlue, // Default background
        'bg-red-700 hover:bg-red-800': isRed,
        'bg-blue-700 hover:bg-blue-800': isBlue,
        'text-white dark:bg-gray-200 dark:hover:bg-white dark:text-gray-800 inline-flex items-center px-4 py-2 border border-transparent rounded-2xl font-semibold text-xs  uppercase tracking-widest focus:outline-none transition ease-in-out duration-300': true,
    }">
        <slot />
    </button>
</template>