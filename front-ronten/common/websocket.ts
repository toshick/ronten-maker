type MsgCallback = (msg: string) => void;
type CloseCallback = () => void;
type OpenCallback = () => void;

type WebSocItem = {
  onOpen?: OpenCallback | null;
  onClose?: CloseCallback | null;
  onMsg?: MsgCallback | null;
};

export default class WebSocClass {
  onClose: null | CloseCallback = null;
  onOpen: null | OpenCallback = null;
  onMsg: null | MsgCallback = null;
  conn: null | WebSocket = null;

  constructor() {
    const url = 'ws://' + document.location.host + '/ws';
    const conn = new WebSocket(url);
    conn.onopen = () => {
      if (this.onOpen) this.onOpen();
    };
    conn.onclose = () => {
      if (this.onClose) this.onClose();
    };
    conn.onmessage = (evt) => {
      if (this.onMsg) this.onMsg(evt.data);
    };
    this.conn = conn;
  }

  /**
   * emitMsg
   */
  public emitMsg(msg: string) {
    if (this.conn) {
      this.conn.send(msg);
    }
  }

  /**
   * destroy
   */
  public destroy() {
    if (this.conn) {
      this.conn.onopen = null;
      this.conn.onclose = null;
      this.conn.onmessage = null;
    }
    this.onClose = null;
    this.onOpen = null;
    this.onMsg = null;
    this.conn = null;
  }
}
