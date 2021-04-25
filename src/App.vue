<template>
    <div id="app">
        <keep-alive :include="['Login']">
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>
