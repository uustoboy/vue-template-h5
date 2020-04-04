<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title"/>
  </div>
</template>
<style lang="scss">
$global-unit: rem;
$designWidth: 750;
@include min-base();
html{
	touch-action: none; 
}
#app{
    @include maw(750);
    @include mar(0 auto);
}
</style>
