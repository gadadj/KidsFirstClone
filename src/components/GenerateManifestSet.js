import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal/lib/inject';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

import saveSet from '@arranger/components/dist/utils/saveSet';

import CopyToClipboardIcon from 'icons/CopyToClipboardIcon.js';
import { copyValueToClipboard } from './CopyToClipboard';
import LoadingOnClick from 'components/LoadingOnClick';
import graphql from '../services/arranger';
import Spinner from 'react-spinkit';

const wait = (s = 1) => new Promise(r => setTimeout(r, s * 1000));

const GenerateManifestWrapper = styled('div')`
  height: 100%;
  background: white;
  border-radius: 10px;
  display: flex;
  overflow: hidden;
  border: solid 1px ${({ theme }) => theme.borderGrey};
  & .clipboardIcon {
    width: 10px;
    margin-right: 9px;
    color: ${({ theme }) => theme.white};
  }
  & .copyContent {
    ${({ theme }) => theme.center};
    color: ${({ theme }) => theme.greyScale1};
    padding-left: 20px;
    padding-right: 20px;
    flex: 1;
    display: flex;
    font-style: italic;
  }
`;

const GenerateButton = styled(ModalActionButton)`
  ${({ theme }) => theme.center};
  border-radius: 0px;
  margin: 0px;
  display: flex;
`;

export default compose(injectState, withTheme)(
  ({
    api,
    theme,
    setId,
    setSetId,
    sqon,
    setWarning,
    onManifestGenerated,
    state: { loggedInUser },
    effects: { addUserSet },
    className,
  }) => {
    const copyRef = React.createRef();
    return (
      <GenerateManifestWrapper>
        <LoadingOnClick
          onClick={async () => {
            if (setId) {
              copyValueToClipboard({ value: setId, copyRef });
            } else {
              const type = 'file';
              const [{ data, errors }] = await Promise.all([
                saveSet({
                  type,
                  sqon: sqon || {},
                  userId: loggedInUser.egoId,
                  path: 'kf_id',
                  api: graphql(api),
                }),
                wait(1),
              ]);
              if (errors && errors.length) {
                setWarning('Unable to generate manifest ID, please try again later.');
              } else {
                const { setId: receivedSetId, size } = data.saveSet;
                setWarning('');
                setSetId(receivedSetId);
                onManifestGenerated(data.saveSet);
                addUserSet({ type, setId: receivedSetId, size, api });
              }
            }
          }}
          render={({ onClick, loading }) => (
            <Fragment>
              <span ref={copyRef} className={`copyContent`}>
                {setId || <Trans>Generate manifest ID</Trans>}
              </span>
              <GenerateButton {...{ onClick, disabled: loading }}>
                {' '}
                {loading ? (
                  <Spinner
                    fadeIn="none"
                    name="circle"
                    color="#fff"
                    style={{
                      width: 15,
                      height: 15,
                      marginRight: 9,
                    }}
                  />
                ) : setId ? (
                  <Fragment>
                    <CopyToClipboardIcon className={`clipboardIcon`} fill={theme.white} />{' '}
                    <Trans>Copy ID</Trans>
                  </Fragment>
                ) : (
                  <Trans>GENERATE</Trans>
                )}
              </GenerateButton>
            </Fragment>
          )}
        />
      </GenerateManifestWrapper>
    );
  },
);
