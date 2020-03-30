import React, { Fragment } from 'react';
import { injectState } from 'freactal';
import { compose, withState } from 'recompose';
import LeftIcon from 'react-icons/lib/fa/angle-left';
import RightIcon from 'react-icons/lib/fa/angle-right';
import get from 'lodash/get';
import { Link } from 'react-router-dom';

import DeleteButton from 'components/loginButtons/DeleteButton';
import { updateProfile } from 'services/profiles';
import { withApi } from 'services/api';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { personaApiRoot } from 'common/injectGlobals';

import CheckboxBubble from 'uikit/CheckboxBubble';
import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';
import { H3 } from 'uikit/Headings';
import { Paragraph } from 'uikit/Core';
import { ActionButton } from 'uikit/Button';

import { wizardButton } from './forms.module.css';
import { styleComponent } from 'components/Utils/index';

import './ConsentForm.css';

const FormParagraph = styleComponent(Paragraph, 'formParagraph');

const Consent = compose(
  injectState,
  withState('accepted', 'setAccepted', ({ state: { loggedInUser }, disableNextStep }) => {
    const accepted = get(loggedInUser, 'acceptedTerms', false);
    disableNextStep(!accepted);
    return accepted;
  }),
)(({ disableNextStep, accepted, setAccepted }) => {
  return (
    <div className={'terms-paragraph'}>
      <H3>{'Read and consent to our terms and conditions'}</H3>
      <Column className="consent-container">
        <div className="terms">
          <FormParagraph fontWeight="600">{'Last Update Date: 7/13/18'}</FormParagraph>{' '}
          <FormParagraph>
            As a user of the Kids First DRC Website, Portal and/or other Services you agree that you
            are 13 years of age or older and furthermore agree to the Terms and Conditions of
            Services defined herein and where applicable the terms defined by the{' '}
            <ExternalLink href="https://osp.od.nih.gov/wp-content/uploads/Genomic_Data_User_Code_of_Conduct.pdf">
              NIH Genomic Data User Code of Conduct.
            </ExternalLink>{' '}
            These terms include, but are not limited to:
          </FormParagraph>
          <FormParagraph>
            <ol>
              <li>
                You will request controlled-access datasets solely in connection with the research
                project described in an approved Data Access Request for each dataset;
              </li>
              <li>
                You will not distribute controlled-access datasets to any entity or individual
                beyond those specified in an approved Data Access Request;
              </li>
              <li>
                You will adhere to computer security practices in compliance with{' '}
                <ExternalLink href="https://osp.od.nih.gov/wp-content/uploads/NIH_Best_Practices_for_Controlled-Access_Data_Subject_to_the_NIH_GDS_Policy.pdf">
                  NIH Security Best Practices for Controlled-Access Data
                </ExternalLink>{' '}
                such that only authorized individuals possess access to data files;
              </li>
              <li>
                You acknowledge Intellectual Property Policies should they exist as specified in a
                dataset’s associated Data Use Certification; and,
              </li>
              <li>
                You will report any inadvertent data release in accordance with the terms in the
                Data Use Certification, breach of data security, or other data management incidents
                contrary to the terms of data access.
              </li>
            </ol>
          </FormParagraph>
          <FormParagraph style={{ margin: '14px 0 0 0' }}>
            DRC terms and conditions may be changed at any time via a public posting of revisions to
            the Services. As a user, you agree to review the Terms & Conditions and Privacy Policies
            each time you use the Services so that you are aware of any modifications made to these
            policies. By accessing or using the Services, you agree with and to be bound by all of
            the terms and conditions and policies as posted on the Services at the time of your
            access or use, including the Privacy Policies then in effect.
          </FormParagraph>
          <FormParagraph style={{ margin: '14px 0' }}>
            For documents and/or data available from the Services, the DRC does not warrant or
            assume any legal liability or responsibility for the accuracy, completeness, or
            usefulness of any information, apparatus, product, or process. No specific medical
            advice is provided by any Services, and the Kids First urges users to of Services to
            consult with a qualified physician for diagnosis and for answers to personal questions.
          </FormParagraph>
          <FormParagraph style={{ margin: '14px 0' }}>
            {' '}
            If you have any questions about these terms, conditions or the practices of this site or
            any of the other Services, please contact us at{' '}
            <ExternalLink hasExternalIcon={false} href="support@kidsfirstdrc.org">
              support@kidsfirstdrc.org
            </ExternalLink>
            . The full list of Kids first DRC policies are located at{' '}
            <ExternalLink href="https://kidsfirstdrc.org/policies/">
              https://kidsfirstdrc.org/policies/
            </ExternalLink>
            .
          </FormParagraph>
        </div>
        <CheckboxBubble
          mt={2}
          mb={2}
          onClick={active => {
            if (active) {
              trackUserInteraction({
                category: TRACKING_EVENTS.categories.join,
                action: TRACKING_EVENTS.actions.acceptedTerms,
                label: TRACKING_EVENTS.labels.joinProcess,
              });
            }
            setAccepted(active);
            disableNextStep(!active);
          }}
          className={''}
        >
          <input type="checkbox" checked={accepted} />
          <label>
            <FormParagraph>
              {' '}
              {'I have read and agreed to the Kids First Data Research Portal Term and Conditions'}
            </FormParagraph>{' '}
          </label>
        </CheckboxBubble>
      </Column>
    </div>
  );
});

const subscribeUser = api => ({ loggedInUser }) =>
  api({
    url: `${personaApiRoot}/subscribe`,
    body: {
      user: loggedInUser,
    },
  });

export default compose(
  injectState,
  withApi,
)(
  ({
    state: { loggedInUser },
    effects: { setToast, closeToast, setUser },
    api,
    nextDisabled,
    history,
    disableNextStep,
    prevStep,
    prevDisabled,
  }) => (
    <Fragment>
      <Consent
        {...{
          api,
          disableNextStep,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <button className={wizardButton} onClick={prevStep} disabled={prevDisabled}>
            <LeftIcon />
            Back
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DeleteButton api={api} className={wizardButton}>
            Cancel
          </DeleteButton>
          <ActionButton
            disabled={nextDisabled}
            onClick={() => {
              const { email, percentageFilled, ...rest } = loggedInUser;

              updateProfile(api)({
                user: {
                  ...rest,
                  acceptedTerms: true,
                },
              }).then(async profile => {
                await setUser({ ...profile, email, api });
              });

              subscribeUser(api)({ loggedInUser });
              if (!nextDisabled) {
                setToast({
                  id: `${Date.now()}`,
                  action: 'info',
                  component: (
                    <div>
                      Fill out your profile, or skip and
                      <Link
                        to={`/search/file`}
                        onClick={function() {
                          //using 'function' so that we don't break Trans parsing
                          closeToast();
                        }}
                      >
                        browse data
                      </Link>
                    </div>
                  ),
                });
                trackUserInteraction({
                  category: TRACKING_EVENTS.categories.join,
                  action: TRACKING_EVENTS.actions.signedUp,
                  label: `Join Completion: egoId ${loggedInUser._id}`,
                });
                history.push(`/user/${loggedInUser._id}`);
              }
            }}
          >
            Save
            <RightIcon />
          </ActionButton>
        </div>
      </div>
    </Fragment>
  ),
);
