<template lang="pug">
ValidationProvider( :name="name" :rules="validate" v-slot="state" ref="provider")
  b-field(
    :grouped="grouped"
    :horizontal="horizontal"
    :label="label"
    :type="getFieldType(state)"
    :message="getErrMessage(state)"
    :class="e2eClass"
  )
    //- ファイル選択ボタン
    b-upload(
      v-show="btnvisible"
      v-model="file"
      :name="name"
      :accept="accept"
      @input="(f) => onSelectFile(f)"
      :size="size"
      )
      a.button(:size="size")
        b-icon(pack="fas" icon="file" size="is-small")
        span {{btnlabel}}
        span.icon-danger(v-if="state.failed")
          b-icon(pack="mdi" icon="alert-circle" type="is-danger" :size="size")
        
    //- プレビュー
    slot

</template>
<!------------------------------->

<!------------------------------->
<script lang="ts">
import Vue from 'vue';
import { ValidationProvider } from 'vee-validate';
import { dataFileInit, onSelectImg, onSelectCsv } from '@/components/form/uploadfiles';
import { ValidationState, FileItem } from '@/types/app';

type State = {
  file: File | null;
  myval: FileItem;
};

export default Vue.extend({
  name: 'OUpload',
  props: {
    label: {
      default: '',
      type: String,
    },
    value: {
      default: () => dataFileInit,
      type: Object,
    },
    validate: {
      default: '',
      type: String,
    },
    placeholder: {
      default: '',
      type: String,
    },
    size: {
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
    btnlabel: {
      type: String,
      default: '',
    },
    accept: {
      type: String,
      default: '',
    },
    btnvisible: {
      type: Boolean,
      default: true,
    },
  },
  data(): State {
    return {
      file: null,
      myval: { ...dataFileInit },
    };
  },
  watch: {
    value(val: FileItem) {
      this.myval = val;
    },
  },
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
     * onSelectFile
     */
    async onSelectFile(file: File) {
      if (file) {
        this.file = file;
        if (isImage(file)) {
          const res = await onSelectImg(file);

          this.myval = res[0];
        } else if (isCsv(file)) {
          const res = await onSelectCsv(file);
          this.myval = res[0];
        }
      } else {
        this.myval = { ...dataFileInit };
        this.file = null;
      }
      this.$emit('input', this.myval);

      this.$nextTick(() => {
        const p = this.$refs.provider as InstanceType<typeof ValidationProvider>;
        p.validate();
      });
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
      if (!errors) return '';
      return errors[0];
    },
  },
});

/**
 * isImage
 */
const isImage = (file: File) => {
  if (!file) return false;
  return file.type.includes('image/');
};

/**
 * isCsv
 */
const isCsv = (file: File) => {
  if (!file) return false;
  return file.type.includes('csv');
};
</script>
<!------------------------------->

<!------------------------------->
<style scoped lang="sass">
.icon-danger
  margin-left: 10px
</style>
