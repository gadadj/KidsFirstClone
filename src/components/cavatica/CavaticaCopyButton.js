import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import styled from 'react-emotion';

import Row from 'uikit/Row';
import { CAVATICA } from 'common/constants';
import CavaticaConnectModal from './CavaticaConnectModal';
import CavaticaCopyModal from './CavaticaCopyModal';
import { BigWhiteButton } from 'uikit/Button';
import cavaticaLogo from 'assets/logomark-cavatica-mono-white.svg';

const CavaticaButton = styled(BigWhiteButton)`
  background: ${({ theme, disabled }) => (disabled ? theme.greyScale8 : theme.primary)};
  width: 100%;
  &:hover {
    background-color: ${({ theme, disabled }) => disabled ? theme.greyScale8 : theme.primaryLight};
  }
  opacity: 100;
  margin-top: 3px;
`;

const ButtonContent = styled(Row)`
  ${({ theme }) => theme.center};
  color: ${({ theme }) => theme.white};
  text-align: center;
  font-size: 11px;
  font-weight: 500;
  padding: 3px;
  text-transform: uppercase;
  padding-right: 6px;
`;

const CavaticaLogo = styled('img')`
  width: 18px;
  margin-right: 7px;
`;

const showConnectModal = ({ effects, props }) => {
  effects.setModal({
    title: 'How to Connect to Cavatica',
    component: (
      <CavaticaConnectModal
        withWarning={true}
        onComplete={() => showCopyModal({ effects, props })}
        onCancel={effects.unsetModal}
      />
    ),
  });
};

const showCopyModal = ({ effects, props }) => {
  effects.setModal({
    title: 'Copy Files to Cavatica Project',
    component: (
      <CavaticaCopyModal onComplete={effects.unsetModal} onCancel={effects.unsetModal} {...props} />
    ),
  });
};

const CavaticaCopyButton = compose(injectState, withTheme)(
  ({ state, theme, effects, ...props }) => {
    const connected = state.integrationTokens[CAVATICA];
    const clickAction = connected ? showCopyModal : showConnectModal;
    return (
      <CavaticaButton disabled={props.disabled} onClick={() => clickAction({ effects, props })}>
        <ButtonContent>
          <CavaticaLogo alt="" src={cavaticaLogo} />
          analyze in Cavatica
        </ButtonContent>
      </CavaticaButton>
    );
  },
);

export default CavaticaCopyButton;
