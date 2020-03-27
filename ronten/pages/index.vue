<template lang="pug">
main
  Header(:small="true")
  .container
    .view.view-ronten
  //- 論点リスト
  .rontenlist
    .rontenlist-scroll
      .ronten(:class="{'is-current': item.r.current}" @click.stop.prevent="() => startSelectRonten(item.r.id)" v-for="item in pointList")
        transition(name="rontenfade")
          .ronten-body(v-if="item.visible")
            .ronten-name {{item.r.name}}
            .ronten-btns.--top
              a.btn-edit(@click.stop.prevent="() => startEditRonten(item.r)" :disabled="sending" size="is-small")
                b-icon(pack="fas" icon="pencil-alt")
            .ronten-btns.--bottom
              a.btn-remove(@click.stop.prevent="() => startRemoveRonten(item.r.id)" :disabled="sending" size="is-small")
                b-icon(pack="fas" icon="trash-alt")
  
  .rontenfocus
    transition(name="rontenfade")
      p(v-if="currentRonten") {{currentRonten.name}}
  .bottom
    b-button(@click="startCreateRonten" :disabled="sending" size="is-large" type="is-info") 論点追加
    //- .try
    //-   OUpload(
    //-     ref="fileUpload"
    //-     name="fileUpload"
    //-     accept=".jpg,.gif,.png"
    //-     @input="onSelectUploadFile"
    //-     validate=""
    //-     btnlabel="イメージをせんたく"
    //-   )
    //-   .preview(v-if="form.fileUpload && form.fileUpload.src")
    //-     a(@click="$refs.fileUpload.onSelectFile(null)") 削除
    //-     img(:src="form.fileUpload.src")
  //- モーダル
  b-modal.dialog(:active="editRonten != null" :canCancel="['escape']" :onCancel="() => startEditRonten(null)")
    ValidationObserver.form(tag="form" v-slot="{invalid}")
      .modal-card
        header.modal-card-head
          p.modal-card-title 論点タイトル
        .modal-card-body
          o-input(
              name="focusrontenTitle"
              placeholder="タイトル"
              v-model="form.focusrontenTitle"
              validate="required"
              )
        footer.modal-card-foot.has-text-right
          button.button(v-show="false" @click.stop.prevent) ダミー
          button.button(@click.stop.prevent="() => startEditRonten(null)") とじる
          button.button.is-primary(@click.stop.prevent="() => startUpdateRonten()" :disabled="invalid || sending") 保存
</template>
<!------------------------------->

<!------------------------------->
<script lang="ts">
import Vue from 'vue';
import { Ronten, FileItem, LoginUser } from '@/types/app';
import { toastNG, toastOK, dialogConfirm, sleep } from '@/common/util';
import { A, M } from '@/store/ronten';
import { dataFileInit } from '@/components/form/uploadfiles';

type State = {
  sending: boolean;
  result: string;
  visibleMap: { [key: number]: boolean | null };
  quickShow: boolean;
  editRonten: null | Ronten;
  form: {
    focusrontenTitle: string;
    fileUpload: FileItem | null;
  };
};

type RontenDisp = {
  r: Ronten;
  visible: boolean;
};

// ----------------------
// default
// ----------------------
export default Vue.extend({
  data(): State {
    return {
      sending: false,
      result: '',
      visibleMap: {},
      quickShow: false,
      editRonten: null,
      form: {
        focusrontenTitle: '',
        fileUpload: null,
      },
    };
  },
  computed: {
    loginUser(): LoginUser {
      return this.$store.state.loginUser;
    },
    pointList(): RontenDisp[] {
      if (!this.rontenList) return [];
      return this.rontenList.map(
        (r: Ronten): RontenDisp => {
          let visible = this.visibleMap[r.id];

          if (r.removed) {
            visible = false;
          } else if (visible === undefined) {
            this.setFadeIn(r.id, this.quickShow);
          }

          visible = !!visible;

          return {
            r,
            visible,
          };
        },
      );
    },
    rontenList(): Ronten[] {
      return this.$store.getters['ronten/rontenList'] || [];
    },
    currentRonten(): Ronten | undefined {
      if (!this.rontenList) return undefined;
      return this.rontenList.find((r: Ronten) => {
        return r.current;
      });
    },
  },
  async mounted() {
    await this.listRonten();
    sleep(3000).then(() => {
      this.quickShow = true;
    });
  },
  methods: {
    debug() {
      console.log('debug');
    },
    /**
     * setFadeIn
     */
    setFadeIn(id: number, quick: boolean) {
      const wait = quick ? 0 : 200 + Math.random() * 1000;
      sleep(wait).then(() => {
        this.$set(this.visibleMap, id, true);
      });
    },

    /**
     * listRonten
     */
    async listRonten() {
      this.sending = true;

      const res = await this.$store.dispatch(A.GetRontenList);
      if (res.error) {
        toastNG('論点取得に失敗しました');
        this.sending = false;
        return;
      }
      this.sending = false;
    },

    /**
     * startEditRonten
     */
    startEditRonten(r: Ronten) {
      this.editRonten = r;
      this.form.focusrontenTitle = r ? r.name : '';
    },

    /**
     * startUpdateRonten
     */
    async startUpdateRonten() {
      this.sending = true;
      const { id, memo, user_id } = this.editRonten as Ronten;
      const res = await this.$store.dispatch(A.UpdateRonten, {
        id,
        name: this.form.focusrontenTitle,
        memo,
        user_id,
      });
      this.sending = false;

      if (res.error) {
        toastNG('論点更新に失敗しました');
        return;
      }
      this.editRonten = null;
    },

    /**
     * startRemoveRonten
     */
    startRemoveRonten(id: number) {
      this.sending = true;

      dialogConfirm('削除しますか？', async () => {
        const res = await this.$store.dispatch(A.RemoveRonten, id);

        if (res.error) {
          toastNG('論点削除に失敗しました');
          this.result = res.message;
          this.sending = false;
          return;
        }

        sleep(600).then(() => {
          this.$store.commit(M.RemoveRonten, id);
          this.sending = false;
          this.visibleMap[id] = null;
        });

        toastOK('論点を削除しました');
      });
    },
    /**
     * startSelectRonten
     */
    startSelectRonten(id: number) {
      this.$store.commit(M.SelectRonten, id);
    },

    /**
     * onSelectUploadFile
     */
    onSelectUploadFile(fileData: FileItem) {
      this.form.fileUpload = fileData || dataFileInit;
    },

    /**
     * startCreateRonten
     */
    async startCreateRonten() {
      this.sending = true;
      const res = await this.$store.dispatch(A.CreateRonten, {
        user_id: +this.loginUser.id,
        name: '新論点',
        memo: '',
      });

      if (res.error) {
        toastNG('論点作成に失敗しました');
        this.result = res.message;
        this.sending = false;
        return;
      }
      toastOK('論点を作成しました');
      this.sending = false;
    },
  },
});
</script>
<!------------------------------->

<!------------------------------->
<style scoped lang="sass">
@import @/assets/sass/_mixin
@import @/assets/sass/_variables

.view-ronten
  padding: 180px 0 0px

.rontenlist
  display: flex
  align-items: center
  overflow: scroll
  width: 100%
  height: 500px
  scrollbar-width: none
  &::-webkit-scrollbar
    display: none

.rontenlist-scroll
  position: relative
  display: flex
  flex-wrap: nowrap
  justify-content: center
  padding: 0 100px

.rontenfocus
  +topLeft(65px, 0, fixed)
  font-size: 52px
  font-weight: bold
  text-align: center
  padding: 20px
  // background-color: $ronten-red
  background-color: #d96262
  width: 100%
  height: 160px
  color: #FFF
  text-shadow: 0 0px 16px rgba(#FFF, 0.9)

  background-image: url("/img/brick-wall-dark.png")

  p
    +centerTransform
    width: 98%
    line-height: 1.2

.ronten-btns
  a
    margin: 0 10px

.bottom
  +bottomLeft(0, 0)
  width: 100%
  text-align: center
  padding: 30px 0
</style>
