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
<!------------------------------->

<!------------------------------->
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import { ValidationState } from '@/types/app';

type State = {
  myval: string;
};

export default Vue.extend({
  name: 'OInput',
  props: {
    label: {
      default: '',
      type: String,
    },
    value: {
      default: '',
      type: String,
    },
    validate: {
      default: '',
      type: String,
    },
    normalize: {
      default: () => [],
      type: Array,
    },
    placeholder: {
      default: '',
      type: String,
    },
    size: {
      default: '',
      type: String,
    },
    icon: {
      default: '',
      type: String,
    },
    type: {
      default: '',
      type: String,
    },
    name: {
      default: ' ',
      type: String,
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
  data(): State {
    return {
      myval: '',
    };
  },
  watch: {
    value(val: string) {
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
    onChangeInput(val: string) {
      let v = val;
      if (this.normalize) {
        this.normalize.forEach((n: any) => {
          v = n(v);
        });
      }
      this.myval = v;
      this.$emit('input', v);
    },
    /**
     * getFieldType
     */
    getFieldType(slotItem: ValidationState) {
      const { passed, failed } = slotItem;
      if (passed) return 'is-success';
      if (failed) return 'is-danger';
      return '';
    },
    /**
     * getErrMessage
     */
    getErrMessage(slotItem: ValidationState) {
      const { errors } = slotItem;
      if (!errors) return '';
      return errors[0];
    },
    /**
     * getDateDisp
     */
    getDateDisp(date: string) {
      return dayjs(date).format('YYYY/MM/DD');
    },
  },
});
</script>
<!------------------------------->

<!------------------------------->
<style scoped lang="sass">
</style>
