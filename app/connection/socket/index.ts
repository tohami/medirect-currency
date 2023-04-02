import { SocketIO } from 'nativescript-socketio';
import { Store } from 'vuex';
import Vuex from 'vuex';
import { actionTypes, RootState } from '~/store/types';
const SOCKET_IO_KEY = 'sioUuNveYQiGr_l0JluHQ';

const socket: SocketIO = new SocketIO('https://marketdata.tradermade.com', {
  reconnection: true,
});

socket.connect();

socket.on('connect', function () {
  socket.emit('login', { userKey: SOCKET_IO_KEY });
});

export default function createSocketIoPlugin() {
  return (store: Store<RootState>) => {
    socket.on('handshake', function (msg: any) {
      console.log(msg);
      store.dispatch(actionTypes.setSocketConnected, true);
      socket.emit('symbolSub', { symbol: 'GBPUSD' });
      socket.emit('symbolSub', { symbol: 'EURUSD' });
    });

    socket.on('subResponse', function (msg: any) {
      console.log('subResponse=> ', msg);
    });

    socket.on('message', function (msg: any) {
      console.log('message=> ', msg);
    });

    socket.on('price', function (message: any) {
      console.log('price=> ', message);
      // store.dispatch(actionTypes.setRealTimePrice, true);
    });
  };
}
