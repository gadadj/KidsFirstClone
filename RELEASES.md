## VERSION 5.7.0 (2024-08-29)

### Features

- [SKFP-1136](https://d3b.atlassian.net/browse/SKFP-1136) Feature: [Data Exploration] Add Phenotype (HPO) & Diagnosis (MONDO) facet view to the Quick Filter search
- [SKFP-1207](https://d3b.atlassian.net/browse/SKFP-1207) Feature: [Entity Page] Add Histological diagnoses column to Biospecimen table

### Technical / Other changes

- [SKFP-809](https://d3b.atlassian.net/browse/SKFP-809) Issue:[Data Exploration] added missing field for Not Observed Phenotype (HPO) and Observed Phenotype (Source text) in export as TSV
- [SKFP-1094](https://d3b.atlassian.net/browse/SKFP-1094) Refactor:[UI] Modified the border property across the platform
- [SKFP-1179](https://d3b.atlassian.net/browse/SKFP-1179) Refactor: [Dashboard] Fixed typo in Authorized Studies widget
- [SKFP-1222](https://d3b.atlassian.net/browse/SKFP-1222) Issue: [Data Exploration] Remove repeated Phenotype (HPO) in the table for a given participant
- [SKFP-1235](https://d3b.atlassian.net/browse/SKFP-1235) Refactor:[Data Exploration] Adjusted the alignment of the Quick Filter buttons 

## VERSION 5.6.1 (2024-08-13)

### Technical / Other changes

- [SKFP-1219](https://d3b.atlassian.net/browse/SKFP-1219) Issue: [UI] Adjust color for empty data
- [SKFP-1227](https://d3b.atlassian.net/browse/SKFP-1227) Task: [Tools] Add Sentry to catch error logs 
- [SKFP-1094](https://d3b.atlassian.net/browse/SKFP-1094) Refactor: [UI] New border property for the "descriptions" component
- [SKFP-1243](https://d3b.atlassian.net/browse/SKFP-1243) Issue: [Community] Error 500

## VERSION 5.6.0 (2024-07-31)

### Features

- [SKFP-740](https://d3b.atlassian.net/browse/SKFP-740) Feature: [Data Exploration] Adjust the format of the Diagnosis (NCIT) field
- [SKFP-1010](https://d3b.atlassian.net/browse/SKFP-1010) Feature: [Cavatica] Add disconnect button on CAVATICA connection error
- [SKFP-1172](https://d3b.atlassian.net/browse/SKFP-1172) Feature: [Phenotypes] Update HPO browser to use the new ferlab-ui components
- [SKFP-1184](https://d3b.atlassian.net/browse/SKFP-1184) Feature: [Registration] Implement email input box for newsletter

### Technical / Other changes

- [SKFP-374](https://d3b.atlassian.net/browse/SKFP-374) Refactor: [User Profile & Registration] Remove Persona - only use Users-API
- [SKFP-839](https://d3b.atlassian.net/browse/SKFP-839) Issue: [Community] Search only takes the first institution word
- [SKFP-1134](https://d3b.atlassian.net/browse/SKFP-1134) Issue: [Summary View] Adjust the parameter to not auto-adjust the width of the Bar charts
- [SKFP-1140](https://d3b.atlassian.net/browse/SKFP-1140) Refactor: [UI] Remove Sass and add custom properties
- [SKFP-1152](https://d3b.atlassian.net/browse/SKFP-1152) Issue: [UI] Adjust widgets in dashboard colors
- [SKFP-1153](https://d3b.atlassian.net/browse/SKFP-1153) Issue: [Biospecimen Request] Share should not update the request
- [SKFP-1190](https://d3b.atlassian.net/browse/SKFP-1190) Issue: [Facets] Wrong buttons alignment
- [SKFP-1197](https://d3b.atlassian.net/browse/SKFP-1197) Update: [Authentication] Upgrade Keycloak Server to 23

## VERSION 5.5.0 (2024-25-06)

### Features

- [SKFP-1101](https://d3b.atlassian.net/browse/SKFP-1101) Feature: [Data Exploration] Addition of boolean and range facets to the Quick Filter search

### Technical / Other changes

- [SKFP-1096](https://d3b.atlassian.net/browse/SKFP-1096) Refactor:[Dashboard] Adjusted color for redirect links
- [SKFP-1099](https://d3b.atlassian.net/browse/SKFP-1099) Issue:[Data Exploration] Fixed upload list matched/unmatched entries causing a continuous loading state
- [SKFP-1100](https://d3b.atlassian.net/browse/SKFP-1100) Refactor:[Saved Set] Modified notification message for saving a saved set in Variant Exploration
- [SKFP-1102](https://d3b.atlassian.net/browse/SKFP-1102) Refactor:[Dashboard] Modify the description of the Variant Workbench widget
- [SKFP-1108](https://d3b.atlassian.net/browse/SKFP-1108) Refactor: [UI] Adjusted the style on the default and hover state of the Cancel button in the Quick Filter Search
- [SKFP-1109](https://d3b.atlassian.net/browse/SKFP-1109) Refactor: [UI] Adjusted the height of the Quick Filter search box
- [SKFP-1112](https://d3b.atlassian.net/browse/SKFP-1112) Refactor: [UI] Adjusted the style on the default and hover state of the Cancel button in the Quick Filter Search
- [SKFP-1149](https://d3b.atlassian.net/browse/SKFP-1149) Refactor:[UI] Adjusted the style apply button on the Quick Filter search
- [SKFP-1154](https://d3b.atlassian.net/browse/SKFP-1154) Refactor:[Data Exploration] Updated the rules set to display the PedcBioPortal link in the table of results
- [SKFP-1155](https://d3b.atlassian.net/browse/SKFP-1155) Issue:[Newsletter] Fixed call to Mailchimp used to opt in users to the KFDRC newsletter


## VERSION 5.4.1 (2024-05-29)

### Technical / Other changes

- [SKFP-1111](https://d3b.atlassian.net/browse/SKFP-1111) Issue: [Data Exploration] Fix issue when checking a value that
  exists in multiple facets
- [SKFP-1114](https://d3b.atlassian.net/browse/SKFP-1114) Refactor: [Data Exploration] Set both Sunburst MONDO & HPO as
  non-default charts
- [SKFP-1115](https://d3b.atlassian.net/browse/SKFP-1115) Issue: [Cavatica] Removed other metadata fields sent to
  Cavatica

## VERSION 5.4.0 (2024-05-28)

### Features

- [SKFP-1031](https://d3b.atlassian.net/browse/SKFP-1031) Feature: [Data Exploration] Implemented a text-based quick
  filter search tool on multi-select checkbox facets

### Technical / Other changes

- [SKFP-1082](https://d3b.atlassian.net/browse/SKFP-1082) Refactor:[Variant Workbench] Add feedback messaging regarding
  user permissions
- [SKFP-1086](https://d3b.atlassian.net/browse/SKFP-1086) Issue:[Cavatica] Removed certain metadata fields sent to
  Cavatica
- [SKFP-1087](https://d3b.atlassian.net/browse/SKFP-1087) Refactor: [Data Exploration] Updated the redirects for
  different studies to the PedcBioportal platform
- [SKFP-1088](https://d3b.atlassian.net/browse/SKFP-1088) Refactor:[Variant Workbench] Remove the restriction to access
  the variant workbench to only Kids First investigators
- [SKFP-1090](https://d3b.atlassian.net/browse/SKFP-1090) Refactor:[Dashboard] Moved the Variant Workbench widget to the
  3rd dashboard widget
- [SKFP-1104](https://d3b.atlassian.net/browse/SKFP-1104) Refactor: [Variant] Modified the display of amino acid change
  and coding DNA change field

## VERSION 5.3.3 (2024-05-24)

### Technical / Other changes

- [SKFP-1084](https://d3b.atlassian.net/browse/SKFP-1084) Fix: [Variant Workbench] Fix an issue with launch in cavatica
  spinning state

## VERSION 5.3.2 (2024-05-24)

### Features

- [SKFP-1084](https://d3b.atlassian.net/browse/SKFP-1084) Feature: [Variant Workbench] New redirection system

## VERSION 5.3.1 (2024-05-24)

### Features

- [SKFP-1078](https://d3b.atlassian.net/browse/SKFP-1078) Feature: [Data Exploration] Click on facet name should display
  the face

### Technical / Other changes

- [SKFP-1083](https://d3b.atlassian.net/browse/SKFP-1083) Fix: [Variant Workbench] Fixed fences connections status

## VERSION 5.3.0 (2024-05-23)

### Features

- [SKFP-928](https://d3b.atlassian.net/browse/SKFP-928) Feature: [Variant Workbench] Implemented Variant Workbench
  widget to copy variant data into a Cavatica project

### Technical / Other changes

- [SKFP-1059](https://d3b.atlassian.net/browse/SKFP-1059) Fix: [Entity] Fixed the display of the authorization lock
  files in the file entity page authorized in the Data Exploration page
- [SKFP-1065](https://d3b.atlassian.net/browse/SKFP-1065) Refactor: [Data Exploration] Added ontology term, hyperlink
  and space on the Histological Diagnosis field formatting
- [SKFP-1070](https://d3b.atlassian.net/browse/SKFP-1070) Refactor: [Dashboard] Updated the FHIR URL in the widget to
  use the new FHIR servers as redirects
- [SKFP-1072](https://d3b.atlassian.net/browse/SKFP-1072) Refactor: [Data Exploration] Added the Down syndrome related
  MONDO diagnoses to the Most Frequent Diagnoses chart
- [SKFP-1077](https://d3b.atlassian.net/browse/SKFP-1077) Refactor: [Community] Added the total number of private and
  public members

## VERSION 5.2.0 (2024-05-15)

### Features

- [SKFP-1019](https://d3b.atlassian.net/browse/SKFP-1019) Feature: [Study page] Implemented new search by bar above the
  table of results
- [SKFP-1026](https://d3b.atlassian.net/browse/SKFP-1026) Feature: [Summary View] Added Most Frequent
  Diagnoses/Phenotype graphs

### Technical / Other changes

- [SKFP-665](https://d3b.atlassian.net/browse/SKFP-665) Fix: [UI] Updated query bar background color
- [SKFP-843](https://d3b.atlassian.net/browse/SKFP-843) Refactor: [ETL] Adjusted the format of the Histological
  Diagnosis (MONDO) field
- [SKFP-938](https://d3b.atlassian.net/browse/SKFP-938) Fix:[Facet] Harmonized display of the facet values to the query
  pills
- [SKFP-942](https://d3b.atlassian.net/browse/SKFP-942) Fix:[Data Exploration] Fixed the sort on select table columns
- [SKFP-971](https://d3b.atlassian.net/browse/SKFP-971) Fix: [Saved Filters/Sets] Fixed the redirect from the browser's
  back button after using the widget's links
- [SKFP-1004](https://d3b.atlassian.net/browse/SKFP-1004) Fix: [Variant] Fixed color adjustments
- [SKFP-1009](https://d3b.atlassian.net/browse/SKFP-1009) Fix:[Variant] Aligned functional scores
- [SKFP-1011](https://d3b.atlassian.net/browse/SKFP-1011) Refactor: [Participant & File Entity] Updated design of View
  in exploration button
- [SKFP-1013](https://d3b.atlassian.net/browse/SKFP-1013) Refactor: [Variant] Updated the display for variants with no
  gene consequence
- [SKFP-1015](https://d3b.atlassian.net/browse/SKFP-1015) Fix:[Variant] Adjusted the mouse over tooltips in the table
- [SKFP-1016](https://d3b.atlassian.net/browse/SKFP-1016) Fix: [Data Exploration] Fixed No data message when the charts
  is increased in size
- [SKFP-1018](https://d3b.atlassian.net/browse/SKFP-1018) Refactor: [Cavatica] Added a loader when copying files to
  Cavatica
- [SKFP-1020](https://d3b.atlassian.net/browse/SKFP-1020) Fix:[QB] Updated the state of the save button of a filter
- [SKFP-1021](https://d3b.atlassian.net/browse/SKFP-1021) Fix:[Dashboard] Fixed error on widgets following specific
  manipulations
- [SKFP-1047](https://d3b.atlassian.net/browse/SKFP-1047) Refactor: [Data Exploration & Entity] Updated pedcbioportal
  studyID link

## VERSION 5.1.1 (2024-04-02)

### Technical / Other changes

- [SKFP-964](https://d3b.atlassian.net/browse/SKFP-964) Fix: (Authorized Studies) Various bugs
- [SKFP-968](https://d3b.atlassian.net/browse/SKFP-968) Update: (UI) Update resources dropdown design
- [SKFP-985](https://d3b.atlassian.net/browse/SKFP-985) Fix: (Variant Entity) Do not display NO_GENE
- [SKFP-998](https://d3b.atlassian.net/browse/SKFP-998) Fix: (Studies) Add CBTN id to pedcbioportal map
- [SKFP-1001](https://d3b.atlassian.net/browse/SKFP-1001) Fix: (Cavatica) Unauthorized file despite being connected to
  Fence and Cavatica
- [SKFP-1002](https://d3b.atlassian.net/browse/SKFP-1002) Fix: (Dashboard) Mask the Variant Workbench widget

## VERSION 5.1.0 (2024-03-21)

### Features

- [SKFP-900](https://d3b.atlassian.net/browse/SKFP-900) Implement Variant Entity V2
- [SKFP-965](https://d3b.atlassian.net/browse/SKFP-965) Add a search by Family ID to facets

### Technical / Other changes

- [SKFP-924](https://d3b.atlassian.net/browse/SKFP-924) Fix: (Dashboard) Fixed various bugs related to the Authorized
  Studies widget
- [SKFP-943](https://d3b.atlassian.net/browse/SKFP-943) Fix: (Data Exploration) Fixed missing values for Not Observed
  Phenotype and Observed Phenotype (Source text) in table
- [SKFP-944](https://d3b.atlassian.net/browse/SKFP-944) Fix: (Report) Fixed the missing histological diagnoses values in
  the download sample data
- [SKFP-980](https://d3b.atlassian.net/browse/SKFP-980) Fix: (Dashboard) Fixed the requirement to refresh to see
  authorized studies in widget
- [SKFP-982](https://d3b.atlassian.net/browse/SKFP-982) Refactor: (UI) Update palette for hex values
- [SKFP-983](https://d3b.atlassian.net/browse/SKFP-983) Refactor: (UI) Update palette for tag values
- [SKFP-988](https://d3b.atlassian.net/browse/SKFP-988) Refactor: (UI) Update palette for text values
- [SKFP-993](https://d3b.atlassian.net/browse/SKFP-993) Fix: (Data Exploration) Fixed the authorization lock in the
  table allowing users to copy authorized files to Cavatica
- [SKFP-995](https://d3b.atlassian.net/browse/SKFP-995) Add a see more functionality to RefSeq field

## VERSION 5.0.3 (2024-02-29)

### Features

- [SKFP-734](https://d3b.atlassian.net/browse/SKFP-734) Add Tags to Google Analytics 4 to capture user metrics
- [SKFP-742](https://d3b.atlassian.net/browse/SKFP-742) Feature: (Cavatica) Add associated metadata when files are being
  copied to a Cavatica project
- [SKFP-927](https://d3b.atlassian.net/browse/SKFP-927) Feature: (Studies) Add sort to columns
- [SKFP-894](https://d3b.atlassian.net/browse/SKFP-894) Feature: (Data Exploration) Add search by external ID in facets

### Technical / Other changes

- [SKFP-815](https://d3b.atlassian.net/browse/SKFP-815) Fix: (Export TSV) Added the field Platform in
- [SKFP-817](https://d3b.atlassian.net/browse/SKFP-817) Fix: (UI) Fixed various text throughout the platform
- [SKFP-845](https://d3b.atlassian.net/browse/SKFP-845) Refactor: (UI) Upgrade to React 18
- [SKFP-890](https://d3b.atlassian.net/browse/SKFP-890) Fix: (Data Exploration) Fixed loss of positions and buttons for
  charts upon a window resize
- [SKFP-913](https://d3b.atlassian.net/browse/SKFP-913) Refactor: (Report) Remove Tissue type and source text in
  biospecimen report
- [SKFP-915](https://d3b.atlassian.net/browse/SKFP-915) Fix: (Data Exploration) Fixed the loss of column position
  personalization
- [SKFP-917](https://d3b.atlassian.net/browse/SKFP-917) Fix: (Variant Exploration) Adjusted the value for the frequency
  to show the affected participant frequency and not the allele frequency
- [SKFP-918](https://d3b.atlassian.net/browse/SKFP-918) Fix: (Dashboard) Fixed various defects in Authorized Studies
  widget
- [SKFP-920](https://d3b.atlassian.net/browse/SKFP-920) Refactor: (Dashboard) Add a spinner to the Authorized Studies
  widget transition state
- [SKFP-926](https://d3b.atlassian.net/browse/SKFP-926) Fix: (Variant Exploration) Fixed the alternating table row
  colors
- [SKFP-933](https://d3b.atlassian.net/browse/SKFP-933) Fix: (Data Exploration) Remove the custom pill creation from QB
- [SKFP-936](https://d3b.atlassian.net/browse/SKFP-936) Fix: (Variant Exploration) Updated the CADD field to use the
  CADD (Phred Score) values and not the CADD (raw)
- [SKFP-941](https://d3b.atlassian.net/browse/SKFP-941) Fix (Data Exploration) Fixed the summary chart position reset
  button
- [SKFP-949](https://d3b.atlassian.net/browse/SKFP-949) Refactor: (Data Exploration) Add tooltip to disabled state
  buttons
- [SKFP-951](https://d3b.atlassian.net/browse/SKFP-951) Refactor: (Data Exploration) Display PedcBioportal link only for
  participants proband=true
- [SKFP-953](https://d3b.atlassian.net/browse/SKFP-953) Refactor: (Data Exploration & Entity page) Remove the option to
  include family member files if the family count in the file manifest is 0

## VERSION 5.0.2 (2024-01-18)

### Technical / Other changes

- [SKFP-880](https://d3b.atlassian.net/browse/SKFP-880) Update: (Variant Table) Update the UI of the variant table
- [SKFP-875](https://d3b.atlassian.net/browse/SKFP-875) Feature: (Data Exploration) Add tooltip on hover for study code
- [SKFP-898](https://d3b.atlassian.net/browse/SKFP-898)[Data Exploration & Entity page] Remove Tissue Type (NCIT) and
  Tissue Type (source text)
- [SKFP-663](https://d3b.atlassian.net/browse/SKFP-663)[UI Theme] Les couleurs de
  src/style/themes/kids-first/colors.less
- [SKFP-910](https://d3b.atlassian.net/browse/SKFP-910) Login with email/pwd crash application
- [SKFP-911](https://d3b.atlassian.net/browse/SKFP-911)[Theme / Tags] Do not change text color for links within tags
- [SKFP-874](https://d3b.atlassian.net/browse/SKFP-874) [Authorized Studies] Refactor widget

## VERSION 5.0.1 (2023-12-14)

### Features

- [SKFP-889](https://d3b.atlassian.net/browse/SKFP-889) Feature: (Google Analytics) Connect beta portal prd to Google
  Analytics 4

## VERSION 5.0.0 (2023-12-11)

### Features

- [SKFP-827](https://d3b.atlassian.net/browse/SKFP-827) Feature: (Data Exploration) Added accessibility patterns to the
  graphs and pie charts

### Technical / Other changes

- [SKFP-767](https://d3b.atlassian.net/browse/SKFP-767) Refactor: (Study page) Remove the apply and clear button from
  the facets
- [SKFP-815](https://d3b.atlassian.net/browse/SKFP-815) Fix: (Export TSV) Added the field Platform in the File table
  export as TSV
- [SKFP-831](https://d3b.atlassian.net/browse/SKFP-831) Refactor: (Facets) Removed the No Data checkbox for numerical
  range type facets in Variant Exploration
- [SKFP-832](https://d3b.atlassian.net/browse/SKFP-832) Fix: (Saved Filter Dashboard) Fixed the incorrect redirection of
  the variants saved filters
- [SKFP-836](https://d3b.atlassian.net/browse/SKFP-836) Fix: (Saved Filter QB) Fixed a shared filter url returning an
  empty query builder
- [SKFP-842](https://d3b.atlassian.net/browse/SKFP-842) Refactor:  (Data Exploration & Entity page) Added missing fields
  and facets to the Data Exploration and entity page
- [SKFP-847](https://d3b.atlassian.net/browse/SKFP-847) Fix: (Data Exploration) Fixed sunburst that would not load when
  there were no search queries active
- [SKFP-850](https://d3b.atlassian.net/browse/SKFP-850) Fix: (Variant Exploration) Fixed the display of NO_GENES for
  intergenic consequences which led to an error 500
- [SKFP-852](https://d3b.atlassian.net/browse/SKFP-852) Fix: (Data Exploration) Fixed the recovery of user configs which
  would cause the portal to crash for certain users
- [SKFP-853](https://d3b.atlassian.net/browse/SKFP-853) Fix: (Data Exploration) Fixed the reset button on the summary
  view
- [SKFP-855](https://d3b.atlassian.net/browse/SKFP-855) Fix: (Variant Entity) Fixed an error 500 upon clicking on the
  query pill generated from a Variant entity page study redirect
- [SKFP-858](https://d3b.atlassian.net/browse/SKFP-858) Fix: (Data Exploration) Fixed the cut off on the graph and chart
  mouseovers
- [SKFP-861](https://d3b.atlassian.net/browse/SKFP-861) Refactor: (Dashboard) Updated the empty state text for the Saved
  set and Saved filter widgets
- [SKFP-863](https://d3b.atlassian.net/browse/SKFP-863) Refactor: (Data Exploration) Modified naming of column to
  External Participant ID and removed Age at Outcome in the Participant table
- [SKFP-869](https://d3b.atlassian.net/browse/SKFP-869) Fix: (Data Exploration) Fixed the button to remove charts and
  graphs in the summary view
- [SKFP-870](https://d3b.atlassian.net/browse/SKFP-870) Fix: (Participant Entity) Fixed participant entity pages that
  would display no data

