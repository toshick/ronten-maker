<template lang="pug">
main
  Header(:small="true")
  //- .container
  .view.view-ronten
    .rontenfocus
      transition(name="rontenfade")
        p(v-if="currentRonten") {{currentRonten.name}}
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
      //- 説明
      transition(name="rontenfade")
        b-message.msg-start(type="is-info" has-icon v-if="initialized && rontenList.length == 0")
          |・画面下の論点追加ボタンからこのディスカッションに論点を追加してみよう
          br
          |・このページはこのディスカッション専用なのでurlをメモしておこう
  
  .bottom
    b-button(@click="startCreateRonten" :disabled="sending" size="is-mmedium" type="is-info" icon-left="plus") 論点追加
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
import { Ronten, FileItem, CreateRontenReq } from '@/types/app';
import { toastNG, toastOK, dialogConfirm, sleep } from '@/common/util';
import { A, M } from '@/store/ronten';
import { dataFileInit } from '@/components/form/uploadfiles';

type State = {
  sending: boolean;
  hash: string;
  result: string;
  visibleMap: { [key: number]: boolean | undefined };
  initialized: boolean;
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
      hash: '',
      result: '',
      visibleMap: {},
      initialized: false,
      editRonten: null,
      form: {
        focusrontenTitle: '',
        fileUpload: null,
      },
    };
  },
  computed: {
    // loginUser(): LoginUser {
    //   return this.$store.state.loginUser;
    // },
    pointList(): RontenDisp[] {
      if (!this.rontenList) return [];
      return this.rontenList.map(
        (r: Ronten): RontenDisp => {
          let visible = this.visibleMap[r.id];

          if (r.removed) {
            visible = false;
          } else if (visible !== true) {
            this.setFadeIn(r.id, this.initialized);
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
    this.hash = this.$route.params.id;

    if (!this.hash) {
      console.log('hashなし');
      location.href = '/create';
      return;
    }

    await this.listRonten(this.hash);
    sleep(3000).then(() => {
      this.initialized = true;
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
    async listRonten(hash: string) {
      this.sending = true;

      const res = await this.$store.dispatch(A.GetRontenList, hash);
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
          this.visibleMap[id] = undefined;
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
        // user_id: +this.loginUser.id,
        name: '新論点',
        memo: '',
        project_hash: this.hash,
      } as CreateRontenReq);
      this.sending = false;

      if (res.error) {
        toastNG('論点作成に失敗しました');
        this.result = res.message;

        return;
      }
      toastOK('論点を作成しました');
    },
  },
});
</script>
<!------------------------------->

<!------------------------------->
<style scoped lang="sass">
@import ~bulma/sass/utilities/mixins
@import @/assets/sass/_mixin
@import @/assets/sass/_variables

.view-ronten
  padding: 0

.rontenlist
  position: relative
  display: flex
  align-items: center
  overflow: scroll
  width: 100%
  height: 400px
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
  position: relative
  font-size: 52px
  font-weight: bold
  text-align: center
  padding: 20px
  // background-color: $ronten-red
  background-color: #938909
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
  .button
    width: 100%
    border-radius: 0

.msg-start
  +hCenter
  top: 40px
  width: 80%
  max-width: 640px
  margin: 0 auto
  border: solid 1px #7e3131

  +mobile
    .rontenfocus
      font-size: 30px
</style>
