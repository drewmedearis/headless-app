// This file sets up polyfills that need to be available before test setup
const { TextEncoder, TextDecoder } = require("util");

// Polyfill TextEncoder/TextDecoder for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// BroadcastChannel polyfill
class BroadcastChannelMock {
  constructor() {
    this.name = "";
    this.onmessage = null;
  }
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
}
global.BroadcastChannel = BroadcastChannelMock;
