import React, { Fragment } from 'react';
import { injectState } from 'freactal';
import { compose } from 'recompose';

import AccessGate from '../../AccessGate';
import Cavatica from 'icons/Cavatica';
import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import Info from '../Info';
import { ApiOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Icon from 'antd/es/icon';

const NotConnected = compose(injectState)(({ effects }) => (
  <Fragment>
    <AccessGate
      mt={'40px'}
      Icon={Cavatica}
      title="Collaborative Analysis"
      detail="To analyze Kids First data on the cloud, connect to Cavatica."
    >
      <Button
        type={'primary'}
        icon={<ApiOutlined />}
        shape="round"
        onClick={() => {
          effects.setModal({
            title: 'How to Connect to Cavatica',
            component: (
              <CavaticaConnectModal onComplete={effects.unsetModal} onCancel={effects.unsetModal} />
            ),
          });
        }}
      >
        CONNECT
        <Icon type="right" />
      </Button>
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
