<template lang="pug">

.logo(:class="{'is-small': small}")
  img(src="/img/logo-ronten-2.png")
  .roll

</template>
<!------------------------------->

<!------------------------------->
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'Logo',
  props: {
    small: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {};
  },
});
</script>
<!------------------------------->

<!------------------------------->
<style scoped lang="sass">
@import @/assets/sass/_mixin

=roll($size, $bordersize)

  +vCenter
  left: 0px
  $durasion: 8s

  &:after

    display: block
    content: ""
    width: $size
    height: $size
    border-radius: $size/2
    border: dotted $bordersize #830000
    animation: rollY $durasion *2 linear infinite

.logo
  position: relative
  display: inline-flex

  align-items: center
  color: #830000
  font-family: "Kosugi Maru", sans-serif
  padding-left: 50px
  img
    display: block
    width: 200px
    margin-right: 10px
  &.is-small
    padding-left: 35px
    img
      width: 120px

    .roll
      +roll(25px, 3px)

.roll
  +roll(40px, 4px)

$scale: 1.0

@keyframes rollY
  0%
    transform: scale($scale, $scale) rotate(0deg)

  100%
    transform: scale($scale, $scale) rotate(360deg)
</style>
