<template lang="pug">

ValidationProvider( :name="name" :rules="validate" v-slot="state")
  b-field(
    :grouped="grouped"
    :horizontal="horizontal"
    :label="label"
    :type="getFieldType(state)"
    :message="getErrMessage(state)"
    :class="e2eClass")
    b-input(
      :type="type || 'text'"
      :placeholder="placeholder"
      :size="size"
      v-model="myval"
      :name="name"
      :class="myclass"
      @input="onChangeInput"
      :rows="rows"
      :loading="loading"
      )
    p.control(v-if="rightitem" v-html="rightitem")
  
    //- 親側のtemplate(slot="label")タグにてラベルを上書きできます
    slot(v-for="state in Object.keys($slots)" name="label" :slot="state")


</template>
<!------------------------------->

<!------------------------------->
<script lang="ts">
import Vue from 'vue';

type State = {
  myval: string | null;
};

type ValidationState = {
  passed: boolean;
  failed: boolean;
  errors: any[];
};

export default Vue.extend({
  name: 'OInput',
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    validate: {
      type: String,
      default: '',
    },
    normalize: {
      type: Function,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    name: {
      type: String,
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
    rightitem: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Number,
      default: null,
    },
  },
  data(): State {
    return {
      myval: '',
    };
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
  watch: {
    value(val) {
      this.myval = val;
    },
  },
  created() {},
  mounted() {
    this.myval = this.value;
  },
  methods: {
    /**
     * onChangeInput
     */
    onChangeInput(val: string) {
      const v = val;
      // if (this.normalize && this.normalize.length > 0) {
      //   this.normalize.forEach((n) => {
      //     v = n(v);
      //   });
      // }
      this.myval = v;
      this.$emit('input', v);
    },
    /**
     * getFieldType
     */
    getFieldType(state: ValidationState) {
      const { passed, failed } = state;
      if (passed) return 'is-success';
      if (failed) return 'is-danger';

      return '';
    },
    /**
     * getErrMessage
     */
    getErrMessage(state: ValidationState) {
      const { errors } = state;
      let ret = '';
      // return
      if (errors && errors.length > 0) {
        ret += errors[0];
      }
      return ret;
    },
  },
});
</script>
