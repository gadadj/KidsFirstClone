import * as React from 'react';
import get from 'lodash/get';

import VariableSummaryTable from 'uikit/SummaryTable/VariableSummaryTable';
import { EntityContentDivider, EntityContentSection } from '../';
import ExternalLink from 'uikit/ExternalLink';
import { kfWebRoot } from 'common/injectGlobals';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import Holder from './Utils/Holder';
import SequencingDataTable from './Utils/SequencingDataTable';
import OtherDataTypesSummaryTable from './Utils/OtherDataTypesSummaryTable';
import sanitize from './Utils/sanitize';
import { NCITLink } from '../../Utils/DiagnosisAndPhenotypeLinks';
import HistologicalDiagnosisTable from '../Histological/histologicalDiagnosisTable.js';
import prettifyAge from './Utils/prettifyAge';
import BiospecimenIcon from 'icons/BiospecimenIcon';
import Tooltip from 'uikit/Tooltip';
import theme from 'theme/defaultTheme';
//https://kf-qa.netlify.com/participant/PT_CMB6TASJ#summary

/**
 * Sometimes, intermediate nested fields are missing.
 *
 * Trying to access participant.diagnoses.hits.edges[0].node.diagnosis_category, for example, crashes the page when
 * node is missing. https://kf-qa.netlify.com/participant/PT_3FV3E420#summary
 *
 * Syntaxic sugar for _.get with null as default
 *
 * @param obj
 * @param accessor
 */
function getter(obj, accessor) {
  return get(obj, accessor, null);
}

/**
 * Builds the data for the main SummaryTable.
 *
 * @param participant
 * @returns {*}
 */
function summaryTableData(participant) {
  /**
   * Syntaxic sugar for getter
   *
   * @param accessor
   * @returns {string|*}
   */
  function getIt(accessor) {
    return getter(participant, accessor);
  }
  return sanitize(
    (() => {
      const summaryList = [
        { title: 'Kids First/Participant ID', summary: getIt('kf_id') },

        { title: 'External ID', summary: getIt('external_id') },
        {
          title: 'Study',
          summary: (
            <ExternalLink
              href={`${kfWebRoot}/support/studies-and-access`}
              onClick={e => {
                trackUserInteraction({
                  category: TRACKING_EVENTS.categories.entityPage.file,
                  action: TRACKING_EVENTS.actions.click + `: File Property: Study`,
                  label: `${participant.study.short_name} (${getIt('study.kf_id')})`,
                });
              }}
              style={{ whiteSpace: 'auto' }}
            >
              {`${getIt('study.short_name')} (${getIt('study.kf_id')})`}
            </ExternalLink>
          ),
        },
        {
          title: 'Diagnosis category',
          summary: getIt('diagnoses.hits.edges.0.node.diagnosis_category'),
        },
        { title: 'Proband', summary: participant.is_proband },
        {
          title: 'Family ID',
          summary: getIt('family_id'),
        },
        {
          title: 'Family Composition',
          summary: getIt('family.family_compositions.hits.edges[0].node.composition'),
        },
        { title: 'Gender', summary: participant.gender },
        { title: 'Ethnicity', summary: participant.ethnicity },
        { title: 'Race', summary: participant.race },
        { title: 'Vital Status', summary: getIt('outcome.vital_status') },
        { title: 'Disease Related', summary: getIt('outcome.disease_related') },
      ];

      if (getIt('study.kf_id') === 'SD_BHJXBDQK') {
        summaryList.push({
          title: 'PedcBioPortal',
          summary: (
            <ExternalLink
              href={`https://pedcbioportal.kidsfirstdrc.org/patient?studyId=pbta_cbttc&caseId=${getIt(
                'kf_id',
              )}`}
              onClick={e => {
                trackUserInteraction({
                  category: TRACKING_EVENTS.categories.entityPage.file,
                  action: TRACKING_EVENTS.actions.click + `: File Property: Study`,
                  label: `${participant.study.short_name} (${getIt('study.kf_id')})`,
                });
              }}
            >
              {getIt('kf_id')}
            </ExternalLink>
          ),
        });
        return summaryList;
      } else if (getIt('study.kf_id') === 'SD_M3DBXD12') {
        summaryList.push({
          title: 'PedcBioPortal',
          summary: (
            <ExternalLink
              href={`https://pedcbioportal.kidsfirstdrc.org/patient?studyId=pbta_pnoc003&caseId=${getIt(
                'kf_id',
              )}`}
              onClick={e => {
                trackUserInteraction({
                  category: TRACKING_EVENTS.categories.entityPage.file,
                  action: TRACKING_EVENTS.actions.click + `: File Property: Study`,
                  label: `${participant.study.short_name} (${getIt('study.kf_id')})`,
                });
              }}
            >
              {getIt('kf_id')}
            </ExternalLink>
          ),
        });
        return summaryList;
      } else {
        return summaryList;
      }
    })(),
  );
}

/**
 * Builds the data for the SummaryTable of the given specimen
 *
 * @param specimen
 * @returns {*}
 */
function specimenSummaryTableData(specimen) {
  return sanitize([
    { title: 'Specimen ID', summary: specimen.kf_id },
    { title: 'Age at Sample Acquisition', summary: prettifyAge(specimen.age_at_event_days) },
    { title: 'Analyte Type', summary: specimen.analyte_type },
    { title: 'Composition', summary: specimen.composition },
    { title: 'Tissue Type (NCIT)', summary: <NCITLink ncit={specimen.ncit_id_tissue_type} /> },
    { title: 'Anatomical Site (Uberon)', summary: specimen.uberon_id_anatomical_site },
    { title: 'Tissue Type (Source Text)', summary: specimen.source_text_tissue_type },
    { title: 'Tumor Description (Source Text)', summary: specimen.source_text_tumor_descriptor },
    { title: 'Consent Code (dbGaP)', summary: specimen.consent_type },
  ]);
}

const buildSpecimenDxSection = ({ specimenId, sanitizedNodes }) => {
  return (
    <EntityContentSection
      key={`entityContentSection`}
      title="Histological Diagnoses"
      size={'small'}
    >
      {sanitizedNodes.map((sanitizedNode, index) => {
        return (
          <HistologicalDiagnosisTable
            key={`histological_dx_table_specimen_id_${specimenId}_node_index_${index}`}
            data={[sanitizedNode]}
          />
        );
      })}
    </EntityContentSection>
  );
};

const getSanitizedSpecimenDxsData = specimen =>
  get(specimen, 'diagnoses.hits.edges', [])
    .filter(edge => edge && Object.keys(edge).length > 0)
    .map(edge =>
      sanitize({
        ...edge.node,
        age_at_event_days: prettifyAge(get(edge.node, 'age_at_event_days')),
      }),
    );

const ParticipantSummary = ({ participant }) => {
  const specimens = get(participant, 'biospecimens.hits.edges', []);
  const hasFile = get(participant, 'files.hits.edges', []).length > 0;
  let wrongTypes = ['Aligned Reads', 'gVCF', 'Unaligned Reads', 'Variant Calls'];

  let hasSequencingData = false;
  for (const i in get(participant, 'files.hits.edges', [])) {
    if (wrongTypes.includes(get(participant, 'files.hits.edges', [])[i].node.data_type)) {
      hasSequencingData = true;
      break;
    }
  }

  const biospecimenIdToTargetProps = (specimens = []) => {
    return specimens.reduce((acc, specimen) => {
      const currentNode = specimen.node;
      if (!currentNode.kf_id) {
        return acc;
      }

      const hasRelatedBioSpecimenDx = get(currentNode, 'diagnoses.hits.edges', []).length > 0;
      return {
        ...acc,
        [currentNode.kf_id]: {
          rightIcon: hasRelatedBioSpecimenDx ? (
            <Tooltip html={'Histological Diagnosis'}>
              <BiospecimenIcon width="25px" height="15px" fill={theme.biospecimenOrange} />
            </Tooltip>
          ) : null,
        },
      };
    }, {});
  };

  return (
    <React.Fragment>
      <EntityContentSection title="Summary">
        <VariableSummaryTable rows={summaryTableData(participant)} nbOfTables={2} />
      </EntityContentSection>
      {specimens.length === 0 ? (
        ''
      ) : (
        <div>
          <EntityContentDivider />
          <EntityContentSection title="Biospecimens">
            <Holder biospecimenIdToData={biospecimenIdToTargetProps(specimens)}>
              {specimens.map(specimenNode => {
                const specimen = specimenNode.node;
                const specimenDxsData = getSanitizedSpecimenDxsData(specimen);
                return (
                  <React.Fragment key={specimen.kf_id}>
                    <VariableSummaryTable
                      key={specimen.kf_id}
                      label={specimen.kf_id}
                      rows={specimenSummaryTableData(specimen)}
                      nbOfTables={2}
                    />
                    {specimenDxsData.length > 0 &&
                      buildSpecimenDxSection({
                        specimenId: specimen.kf_id,
                        sanitizedNodes: specimenDxsData,
                      })}
                  </React.Fragment>
                );
              })}
            </Holder>
          </EntityContentSection>
        </div>
      )}

      {hasFile ? (
        <div>
          <EntityContentDivider />
          <EntityContentSection title="Available Data Files" size={'big'}>
            {hasSequencingData ? (
              <EntityContentSection title="Sequencing Data" size={'small'}>
                <SequencingDataTable
                  files={get(participant, 'files.hits.edges', [])}
                  participantID={participant.kf_id}
                />
              </EntityContentSection>
            ) : (
              ''
            )}
            <OtherDataTypesSummaryTable
              files={get(participant, 'files.hits.edges', [])}
              participantID={participant.kf_id}
              hasSequencingData={hasSequencingData}
            />
          </EntityContentSection>
        </div>
      ) : (
        ''
      )}
    </React.Fragment>
  );
};

export default ParticipantSummary;
