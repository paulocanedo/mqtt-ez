class ConnectionState {

  static get CONNECTED() {
    return 0;
  }

  static get CONNECTING() {
    return 1;
  }

  static get DISCONNECTED() {
    return 2;
  }

}

export default ConnectionState;
