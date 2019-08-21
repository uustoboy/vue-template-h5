<template>
  <div class="home">
    <div>Hello world!</div>
    <div>
    	{{demoName}}
    </div>
    <input type="text" v-model="changeName"/>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import * as types from '../store/mutations-type'
export default {
  name: 'home',
  created: function(){
    this.getDemoName();
  },
  methods: {
    ...mapActions([
      'getDemoName', 
    ]),
    ...mapMutations({
      setName: types.SET_DEMO
    }),
  },
  computed: {
  	...mapGetters([
      'demoName'
    ]),
    changeName: {
      get (){
        return this.demoName
      },
      set (val){
        this.setName(val)
      }
      
    }
  }
}
</script>
<style lang="scss">
$global-unit: rem;
.home{
  @include tac;
}
</style>
