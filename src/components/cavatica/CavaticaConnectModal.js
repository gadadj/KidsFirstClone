import * as React from 'react';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';

import step2Screenshot from 'assets/cavaticaTokenScreenshot.png';
import { deleteSecret, setSecret } from 'services/secrets';
import { CAVATICA } from 'common/constants';
import { getUser as getCavaticaUser } from 'services/cavatica';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { ModalFooter, ModalWarning } from 'components/Modal/index.js';
import ExternalLink from 'uikit/ExternalLink';
import IntegrationStepsModalContent, {
  NumberBullet,
  TokenTitle,
  TokenInput,
  FormErrorMessage,
  DemoImage,
} from 'components/IntegrationStepsModal';
import { cavaticaWebRoot, cavaticaWebRegistrationRoot } from 'common/injectGlobals';

import { injectState } from 'freactal';
import RightArrows from 'react-icons/lib/fa/angle-double-right';

const enhance = compose(
  injectState,
  withState('cavaticaKey', 'setCavaticaKey', ''),
  withState('invalidToken', 'setInvalidToken', false),
);

const submitCavaticaToken = async ({
  token,
  setIntegrationToken,
  setInvalidToken,
  onSuccess,
  onFail,
}) => {
  await setSecret({ service: CAVATICA, secret: token });
  const userData = await getCavaticaUser(token);

  if (userData) {
    setIntegrationToken(CAVATICA, JSON.stringify(userData));
    trackUserInteraction({
      category: TRACKING_EVENTS.categories.user.profile,
      action: TRACKING_EVENTS.actions.integration.connected,
      label: 'Cavatica',
    });
    onSuccess();
  } else {
    setIntegrationToken(CAVATICA, null);
    deleteSecret({ service: CAVATICA });
    trackUserInteraction({
      category: TRACKING_EVENTS.categories.user.profile,
      action: TRACKING_EVENTS.actions.integration.failed,
      label: 'Cavatica',
    });
    onFail();
  }
};

const CavaticaConnectModal = withTheme(
  ({
    state,
    effects,
    theme,
    cavaticaKey,
    setCavaticaKey,
    gen3Key,
    setGen3Key,
    editingCavitca,
    setEditingCavatica,
    invalidToken,
    setInvalidToken,
    ...props
  }) => {
    return (
      <IntegrationStepsModalContent>
        <div>
          {props.withWarning && (
            <ModalWarning>
              You have not connected to your Cavatica account. Please follow the instructions below
              to connect and start copying files.
            </ModalWarning>
          )}
          <div className="stepRow">
            <div>
              <NumberBullet>1</NumberBullet>
            </div>
            <div className="stepText">
              <span>
                If you don't have one, please{' '}
                <ExternalLink href={`${cavaticaWebRegistrationRoot}/auth/register`}>
                  register for a Cavatica Account <RightArrows />
                </ExternalLink>{' '}
              </span>
            </div>
          </div>
          <div className="stepRow">
            <div>
              <NumberBullet>2</NumberBullet>
            </div>
            <div className="stepText">
              <span>
                You will need to retrieve your authentication token from the Cavatica{' '}
                <ExternalLink href={`${cavaticaWebRoot}/developer#token`}>
                  Developer Dashboard
                </ExternalLink>. From the Dashboard, click on the "Auth Token" tab.
              </span>
            </div>
            <DemoImage src={step2Screenshot} alt="Screenshot of Cavatica's Developer Den" />
          </div>
          <div className="stepRow">
            <div>
              <NumberBullet>3</NumberBullet>
            </div>
            <div className="stepText">
              <span>
                Click on "<strong>Generate Token</strong>", copy and paste it into the field below
                and click Connect.
              </span>
            </div>
          </div>
          <div css="display:flex; flex-direction:column; margin-left:74px;">
            <TokenTitle>Cavatica Authentication Token:</TokenTitle>
            <TokenInput
              id="cavaticaKey"
              type="text"
              value={cavaticaKey}
              name="cavatica"
              placeholder="Cavatica Key"
              onChange={e => {
                setCavaticaKey(e.target.value);
                setInvalidToken(false);
              }}
            />
            <FormErrorMessage id="cavaticaTokenErrorMsg">
              {invalidToken ? 'The provided Cavatica Token is invalid. Update and try again.' : ' '}
            </FormErrorMessage>
          </div>
        </div>
        <ModalFooter
          {...{
            handleSubmit: async () => {
              await submitCavaticaToken({
                token: cavaticaKey,
                setIntegrationToken: effects.setIntegrationToken,
                onSuccess: props.onComplete,
                onFail: () => setInvalidToken(true),
              });
            },
            submitText: 'Connect',
            submitDisabled: invalidToken || !cavaticaKey.length,
          }}
        />
      </IntegrationStepsModalContent>
    );
  },
);

export default enhance(CavaticaConnectModal);
