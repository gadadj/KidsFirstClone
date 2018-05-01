import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { getAppElement } from './services/globalDomNodes.js';
import googleSDK from 'services/googleSDK';
import facebookSDK from 'services/facebookSDK';
import { init as initUsersnap } from 'services/usersnap';

import './i18n';

googleSDK();
facebookSDK();
initUsersnap();

ReactDOM.render(<App />, getAppElement());

navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(r => r.unregister());
});
