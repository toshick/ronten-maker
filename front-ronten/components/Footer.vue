<template lang="pug">
footer(:class="{'is-bottom': bottom}")
  p copyright toshick of the world
</template>
<!------------------------------->

<!------------------------------->
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'Footer',
  props: {
    bottom: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
});
</script>
<!------------------------------->

<!------------------------------->
<style scoped lang="sass">
@import @/assets/sass/_mixin

footer
  text-align: center
  margin-top: 60px
  &.is-bottom
    +hCenter(50%, fixed)
    bottom: 20px
    margin: 0
</style>
