<template lang="pug">
main
  Header(:small="true")
  .container
    .view.view-ronten
      //- 論点リスト
      .rontenlist
          .ronten(:class="{'is-current': item.r.current}" @click.stop.prevent="() => startSelectRonten(item.r.id)" v-for="item in pointList")
            transition(name="rontenfade")
              .ronten-body(v-if="item.visible")
                .ronten-name {{item.r.name}}
                .ronten-btns
                  a.btn-remove(@click.stop.prevent="() => startRemoveRonten(item.r.id)" :disabled="sending" size="is-small")
                    b-icon(pack="fas" icon="trash-alt")
                  a.btn-edit(@click.stop.prevent="() => startEditRonten(item.r)" :disabled="sending" size="is-small")
                    b-icon(pack="fas" icon="pencil-alt")
    .rontenfocus
      transition(name="rontenfade")
        p(v-if="currentRonten") {{currentRonten.name}}
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
import { toastNG, toastOK, dialogConfirm, sleep } from '@/common/util';
import { GetRontenListAction, RemoveRontenAction, UpdateRontenAction, SelectRontenMutation, RemoveRontenMutation } from '@/store';
import { Ronten } from '@/types/app';

type State = {
  sending: boolean;
  result: string;
  visibleMap: { [key: number]: boolean };
  quickShow: boolean;
  editRonten: null | Ronten;
  form: {
    focusrontenTitle: string;
  };
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
      },
    };
  },
  computed: {
    pointList() {
      return this.rontenList.map((r: Ronten) => {
        let visible = this.visibleMap[r.id];

        if (r.removed) {
          visible = false;
        } else if (visible === undefined) {
          this.setFadeIn(r.id, this.quickShow);
        }

        return {
          r,
          visible,
        };
      });
    },
    /**
     * currentRonten
     */
    currentRonten() {
      return this.rontenList.find((r: Ronten) => {
        return r.current;
      });
    },
    rontenList() {
      return this.$store.getters.rontenList;
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

      const res = await this.$store.dispatch(GetRontenListAction());

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
      const res = await this.$store.dispatch(
        UpdateRontenAction({
          id,
          name: this.form.focusrontenTitle,
          memo,
          user_id,
        }),
      );
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
    startRemoveRonten(id) {
      this.sending = true;

      dialogConfirm('削除しますか？', async () => {
        const res = await this.$store.dispatch(RemoveRontenAction(id));

        if (res.error) {
          toastNG('論点削除に失敗しました');
          this.result = res.message;
          this.sending = false;
          return;
        }

        sleep(600).then(() => {
          this.$store.commit(RemoveRontenMutation(id));
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
      this.$store.commit(SelectRontenMutation(id));
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
  position: relative
  display: flex
  flex-wrap: wrap
  justify-content: center
  padding: 30px 0

.rontenfocus
  +topLeft(65px, 0, fixed)
  font-size: 52px
  font-weight: bold
  text-align: center
  padding: 20px
  // background-color: $ronten-red
  background-color: #d96262
  width: 100%
  height: 130px
  color: #FFF
  text-shadow: 0 0px 16px rgba(#FFF, 0.9)

  background-image: url("/img/brick-wall-dark.png")

  p
    +centerTransform
    width: 98%
    line-height: 1.0

.ronten-btns
  a
    margin: 0 10px
</style>
