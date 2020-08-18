

import { appConfig } from '../src/app/utils/app-config';

declare var SockJS;
declare var Stomp;
export const serverUrl = appConfig.apiUrl + '/socket';
export const ws = new SockJS(serverUrl);
export const stompClient = Stomp.over(ws);
export const test = "testdata";

