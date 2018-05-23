import React, { Fragment } from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal/lib/inject';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

import saveSet from '@arranger/components/dist/utils/saveSet';

import downloadIcon from '../assets/icon-download-white.svg';
import CopyToClipboardIcon from '../icons/CopyToClipboardIcon.js';
import IconWithLoading from '../icons/IconWithLoading';
import { copyValueToClipboard } from './CopyToClipboard';
import { ModalFooter, ModalWarning } from './Modal';
import LoadingOnClick from 'components/LoadingOnClick';
import graphql from '../services/arranger';
import Spinner from 'react-spinkit';

const wait = (s = 1) => new Promise(r => setTimeout(r, s * 1000));

const Button = compose(withTheme)(
  ({ theme, children, className = '', contentClassName = '', ...props }) => (
    <button className={`${theme.actionButton} ${className}`} {...props}>
      <div
        className={`${css`
          display: flex;
          justify-content: center;
          align-items: center;
        `} ${contentClassName}`}
      >
        {children}
      </div>
    </button>
  ),
);

const ManifestGeneratorStyle = theme =>
  `manifestSetGenerator ${css`
    &.manifestSetGenerator {
      height: 100%;
      background: white;
      border-radius: 10px;
      display: flex;
      overflow: hidden;
      border: solid 1px ${theme.borderGrey};
      & .clipboardIcon {
        width: 10px;
        margin-right: 9px;
        color: ${theme.white};
      }
      & .copyContent {
        padding-left: 20px;
        padding-right: 20px;
        flex: 1;
        justify-content: center;
        align-items: center;
        display: flex;
        color: ${theme.greyScale1};
        font-style: italic;
      }
      & .generateButton {
        border-radius: 0px;
        margin: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  `}`;

const GenerateManifestSet = compose(injectState, withTheme)(
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
      <div className={`${ManifestGeneratorStyle(theme)}`}>
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
              <Button
                {...{ onClick, disabled: loading, className: `generateButton ${theme.uppercase}` }}
              >
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
              </Button>
            </Fragment>
          )}
        />
      </div>
    );
  },
);

export const DownloadManifestModalFooter = compose(withTheme)(
  ({
    theme,
    sqon,
    projectId,
    downloadLoading,
    onDownloadClick,
    setWarning,
    api,
    setId,
    setSetId,
    onManifestGenerated = () => {},
  }) => (
    <ModalFooter showSubmit={false}>
      <div
        className={css`
          display: flex;
          flex: 1;
          justify-content: center;
          height: 100%;
        `}
      >
        <GenerateManifestSet
          {...{
            sqon,
            projectId,
            setWarning,
            onManifestGenerated,
            api,
            setId,
            setSetId,
          }}
        />
      </div>
      <LoadingOnClick
        onClick={onDownloadClick}
        render={({ onClick, loading, finalLoading = loading || downloadLoading }) => (
          <Button
            {...{
              onClick,
              className: `${theme.uppercase} ${css`
                height: 100%;
              `}`,
              disabled: finalLoading,
            }}
          >
            <IconWithLoading {...{ loading: finalLoading, icon: downloadIcon }} />
            <Trans>Download Manifest</Trans>
          </Button>
        )}
      />
    </ModalFooter>
  ),
);

export default compose(withState('warning', 'setWarning', ''))(
  ({ sqon, index, projectId, warning, setWarning, children, api }) => (
    <div>
      {warning && <ModalWarning>{warning}</ModalWarning>}
      {children({ setWarning })}
    </div>
  ),
);
