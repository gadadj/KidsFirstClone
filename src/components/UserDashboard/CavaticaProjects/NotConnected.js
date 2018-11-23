import React, { Fragment } from 'react';
import { injectState } from 'freactal';
import { compose } from 'recompose';

import AccessGate from '../../AccessGate';
import Cavatica from 'icons/Cavatica';
import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import { analyticsTrigger, TRACKING_EVENTS } from 'services/analyticsTracking';
import Info from '../Info';
import { ConnectButton } from '../styles';

const NotConnected = compose(injectState)(({ effects }) => (
  <Fragment>
    <AccessGate
      mt={'30px'}
      Icon={Cavatica}
      title="Collaborative Analysis"
      detail="To analyze Kids First data on the cloud, connect to Cavatica."
    >
      <ConnectButton
        onClick={() => {
          analyticsTrigger({
            property: 'portal',
            type: 'recording',
            uiArea: TRACKING_EVENTS.categories.user.profile,
            action: TRACKING_EVENTS.actions.integration.init,
            label: TRACKING_EVENTS.labels.cavatica,
          });
          effects.setModal({
            title: 'How to Connect to Cavatica',
            component: (
              <CavaticaConnectModal onComplete={effects.unsetModal} onCancel={effects.unsetModal} />
            ),
          });
        }}
      />
    </AccessGate>
    <Info
      link={{
        url: 'https://kidsfirstdrc.org/support/analyze-data/',
        text: 'CAVATICA compute cloud platform',
      }}
    />
  </Fragment>
));

export default NotConnected;
