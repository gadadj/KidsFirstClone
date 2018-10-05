import React, { Fragment } from 'react';
import { capitalize } from 'lodash';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import FBIcon from 'react-icons/lib/fa/facebook';
import Check from 'react-icons/lib/fa/check';

import { Box, Span } from 'uikit/Core';

import { GOOGLE, FACEBOOK } from 'common/constants';
import gicon from 'assets/google-icon.png';

const GoogleIcon = styled('img')`
  height: 26px;
  margin-left: 3px;
  vertical-align: middle;
`;

const identityProviders = [GOOGLE, FACEBOOK];

const icons = {
  [GOOGLE]: x => <GoogleIcon src={gicon} />,
  [FACEBOOK]: x => <FBIcon color="#428bca" {...x} />,
};

const Status = styled(Span)`
  color: ${({ theme }) => theme.active};
  padding: 2px;
  white-space: nowrap;
  font-weight: 500;
  font-size: 16px;
`;

const ConnectedWithBadge = withTheme(({ theme, provider, Icon = icons[provider] }) => (
  <Box>
    {identityProviders.includes(provider) && (
      <Fragment>
        <Status>
          <Check color={theme.active} />
          {Icon && <Icon size={20} />}
        </Status>
        <Status>Connected with {capitalize(provider)}</Status>
      </Fragment>
    )}
  </Box>
));

export default ConnectedWithBadge;
