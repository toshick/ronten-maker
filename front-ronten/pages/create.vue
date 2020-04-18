<template lang="pug">
.container
  .view.view-create
    .title
      Logo
    .buttons.has-text-centered
      b-button.is-large(type="is-info" @click="startCreateProject" :disabled="sending") 新規ディスカッション
    Footer(bottom)
</template>
<!------------------------------->

<!------------------------------->
<script lang="ts">
import Vue from 'vue';
import { projectStore } from '@/store';
import { randomText, goProject } from '@/common/util';

// ----------------------
// type
// ----------------------
type State = {
  sending: boolean;
};

// ----------------------
// default
// ----------------------
export default Vue.extend({
  name: 'Create',
  components: {},
  data(): State {
    return {
      sending: false,
    };
  },
  computed: {},
  async created() {},
  methods: {
    /**
     * startCreateProject
     */
    async startCreateProject() {
      this.sending = true;
      const res = await projectStore.CreateProject(randomText());
      this.sending = false;
      if (res.error) {
        this.$buefy.toast.open({
          duration: 1000,
          message: `ディスカッション作成に失敗しました`,
          position: 'is-top',
          type: 'is-danger',
        });
        return;
      }

      if (res.hash) {
        goProject(res.hash);
      }
    },
  },
});
</script>
<!------------------------------->

<!------------------------------->
<style scoped lang="sass">
.title
  padding: 140px 0
  text-align: center

.buttons
  margin: 30px 0 0
  justify-content: center

  .button
</style>
