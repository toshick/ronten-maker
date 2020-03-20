<template lang="pug">

ValidationProvider( :name="name" :rules="validate" v-slot="slot")

  b-field(
    :grouped="grouped"
    :horizontal="horizontal"
    :label="label"
    :type="getFieldType(slot)"
    :message="getErrMessage(slot)"
    :class="e2eClass")
    b-datetimepicker(
      :placeholder="placeholder"
      :name="name"
      :class="myclass"
      @input="onChangeInput"
      icon="calendar-today"
      :size="size"
      v-model="myval"
      :validate="validate"
      position="is-top-right"
      :date-formatter="getDateDisp"
      editable)
  


</template>
<!-- ================================================================================================ -->
<script>
import dayjs from 'dayjs';
export default {
  name: 'OInput',
  props: {
    label: {
      default: '',
    },
    value: {
      default: null,
    },
    validate: {
      default: '',
    },
    normalize: {
      default: () => [],
    },
    placeholder: {
      default: '',
    },
    size: {
      default: '',
    },
    icon: {
      default: '',
    },
    type: {
      default: '',
    },
    name: {
      default: ' ',
    },
    grouped: {
      type: Boolean,
      default: false,
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      myval: null,
    };
  },
  watch: {
    value(val) {
      this.myval = val;
    },
  },
  created() {},
  mounted() {
    this.myval = this.value;
  },
  computed: {
    myclass() {
      if (!this.size) return {};
      return { [this.size]: true };
    },
    e2eClass() {
      return `e2e-${this.name}`;
    },
  },
  methods: {
    /**
     * onChangeInput
     */
    onChangeInput(val) {
      let v = val;
      if (this.normalize) {
        this.normalize.forEach((n) => {
          v = n(v);
        });
      }
      this.myval = v;
      this.$emit('input', v);
    },
    /**
     * getFieldType
     */
    getFieldType(slotItem) {
      const { passed, failed } = slotItem;
      if (passed) return 'is-success';
      if (failed) return 'is-danger';

      return '';
    },
    /**
     * getErrMessage
     */
    getErrMessage(slotItem) {
      const { errors } = slotItem;
      if (!errors) return '';
      return errors[0];
    },
    /**
     * getDateDisp
     */
    getDateDisp(date) {
      return dayjs(date).format('YYYY/MM/DD');
    },
  },
};
</script>
<!-- ================================================================================================ -->
<style scoped lang="sass">

@import @origami/stylesheets/_mixin.sass
@import @origami/stylesheets/_variables.sass
@import @/stylesheets/_variables.sass
</style>
