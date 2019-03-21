import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

import IconWithLoading from 'icons/IconWithLoading';
import DownloadIcon from 'icons/DownloadIcon';
import LoadingOnClick from 'components/LoadingOnClick';

import { GEN3 } from 'common/constants';
import { downloadFileFromFence } from 'services/fence';
import { getFilesById } from 'services/arranger';
import { withApi } from 'services/api';
import { getAppElement } from 'services/globalDomNodes';

const getGen3UUIDs = async kfId => {
  const fileData = await getFilesById({ ids: [kfId], fields: ['latest_did'] });
  return fileData.map(file => file.node.latest_did);
};

//TODO: Needs to be made aware of multiple data repositories, only downloads from Gen3 right now.
const downloadFile = async ({ kfId, api }) => {
  let files = await getGen3UUIDs(kfId);
  let fileUUID = files && files.length > 0 ? files[0] : null;
  if (!fileUUID) throw new Error('Error retrieving File ID for the selected Row.');
  return downloadFileFromFence({ fileUUID, api, GEN3 });
};

const DownloadFileButton = compose(
  injectState,
  withTheme,
  withApi,
)(
  ({
    kfId,
    theme,
    effects: { setToast },
    state: { integrationTokens },
    gen3Key = integrationTokens[GEN3],
    api,
    render,
    onSuccess,
    onError,
  }) => (
    <LoadingOnClick
      onClick={() =>
        downloadFile({ kfId, api })
          .then(url => {
            const a = document.createElement('a');
            a.href = url;
            if (onSuccess) {
              onSuccess(url);
            }

            a.download = url.split('/').slice(-1);
            a.style.display = 'none';

            // firefox would not trigger download unless the element is present in the dom
            const appRoot = getAppElement();
            appRoot.appendChild(a);
            a.click();
            appRoot.removeChild(a);
          })
          .catch(err => {
            if (onError) {
              onError(err);
            }
            setToast({
              id: `${Date.now()}`,
              action: 'error',
              component: (
                <div
                  css={`
                    display: flex;
                  `}
                >
                  <div
                    css={`
                      display: flex;
                      flex-direction: column;
                    `}
                  >
                    <div
                      css={`
                        font-size: 16px;
                      `}
                    >
                      <Trans>Failed!</Trans>
                    </div>
                    <Trans>Unable to download file</Trans>
                    <div
                      css={`
                        color: 'red';
                        margin-bottom: 20px;
                        padding: 20px;
                      `}
                    >
                      <span>
                        <Trans i18nKey="fileRepoSidebar.missingDownloadPermissions">
                          Your account does not have the required permission to download this file.
                        </Trans>
                      </span>
                    </div>
                  </div>
                </div>
              ),
            });
          })
      }
      render={
        render
          ? render
          : ({ onClick, loading }) => (
              <IconWithLoading
                {...{ loading }}
                spinnerProps={{ color: 'grey' }}
                Icon={() => (
                  <DownloadIcon
                    {...{ onClick }}
                    width={13}
                    fill={theme.primary}
                    className={css`
                      cursor: pointer;
                    `}
                  />
                )}
              />
            )
      }
    />
  ),
);

export default DownloadFileButton;
