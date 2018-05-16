import React from 'react';
import { compose } from 'recompose';
import { Trans } from 'react-i18next';
import { withTheme } from 'emotion-theming';
import { css } from 'react-emotion';
import { injectState } from 'freactal';

import { MatchBox } from '@arranger/components/dist/Arranger';
import graphql from 'services/arranger';
import { ModalFooter } from './Modal';

const UploadButton = withTheme(({ theme, ...props }) => (
  <button className={theme.actionButton} {...props} />
));

const enhance = compose(withTheme, injectState);

const UploadIdsModal = ({
  api,
  theme,
  state: { loggedInUser },
  effects: { addUserSet },
  setSQON,
  closeModal,
  ...props
}) => (
  <MatchBox
    {...{ ...props, setSQON }}
    instructionText={
      'Type or copy-and-paste a list of comma delimited identifiers, or choose a file of identifiers to upload'
    }
    placeholderText={`e.g. File Id\ne.g. Sample Id\ne.g. Participant Id`}
    entitySelectText={'Select the entity to upload'}
    entitySelectPlaceholder={'Select an Entity'}
    matchedTabTitle={'Matched'}
    unmatchedTabTitle={'Unmatched'}
    matchTableColumnHeaders={{
      inputId: 'Input Id',
      matchedEntity: 'Matched Entity',
      entityId: 'Entity Id',
    }}
    browseButtonText={<Trans>Browse</Trans>}
    matchHeaderText={
      <div
        className={css`
          ${theme.modalTitle};
          display: block;
        `}
      >
        <Trans>Matching files in the Kids First Data Repository</Trans>
      </div>
    }
    ButtonComponent={UploadButton}
  >
    {({ hasResults, saveSet }) => (
      <ModalFooter
        {...{
          handleSubmit: async () => {
            const { type, setId, size } = await saveSet({
              userId: loggedInUser.egoId,
              api: graphql(api),
              dataPath: 'data.saveSet',
            });
            addUserSet({ type, setId, size, api });
            closeModal();
          },
          submitText: 'Upload',
          submitDisabled: !hasResults,
        }}
      />
    )}
  </MatchBox>
);

export default enhance(UploadIdsModal);
