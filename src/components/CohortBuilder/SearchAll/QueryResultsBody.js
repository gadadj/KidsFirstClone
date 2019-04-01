import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';

import TextHighlight from '@arranger/components/dist/TextHighlight';
import LoadingSpinner from 'uikit/LoadingSpinner';

const QueryResultsBody = ({
  filteredFields,
  query,
  selections,
  isLoading,
  theme,
  onSelectionChange,
  onSearchField,
}) => {
  // that query yields no results
  if (filteredFields.length === 0) {
    return null;
  }

  const handleFieldNameClicked = evt => {
    const field = filteredFields[evt.currentTarget.dataset.index];
    if (field && field.matchByDisplayName) {
      onSearchField(field.name);
    }
  };

  return (
    <div className="results-section results-body">
      {filteredFields.map((field, i) => (
        <div
          key={`${field.name}`}
          className={`result-category ${field.matchByDisplayName ? 'match' : ''} ${
            filteredFields.length - 1 === i ? 'last' : ''
          }`}
        >
          <div className="category-name" data-index={i} onClick={handleFieldNameClicked}>
            <TextHighlight content={field.displayName} highlightText={query} />
          </div>
          {field.buckets.map(({ value, docCount }) => (
            <div className="result-item" key={`result-item_${value}`}>
              <label>
                <input
                  type="checkbox"
                  checked={selections[field.name].indexOf(value) > -1}
                  className="selection"
                  onChange={evt => {
                    onSelectionChange(evt, field, value);
                  }}
                />
                <TextHighlight content={value} highlightText={query} />
              </label>
              <span className="doc-count">{docCount}</span>
            </div>
          ))}
        </div>
      ))}
      <div className={`loader-container ${isLoading ? 'loading' : ''}`}>
        <LoadingSpinner color={theme.greyScale11} size={'50px'} />
      </div>
    </div>
  );
};

QueryResultsBody.propTypes = {
  filteredFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      matchByDisplayName: PropTypes.bool.isRequired,
      buckets: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          docCount: PropTypes.number.isRequired,
        }),
      ),
    }),
  ).isRequired,
  query: PropTypes.string.isRequired,
  selections: PropTypes.object.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  onSearchField: PropTypes.func.isRequired,
};

export default withTheme(QueryResultsBody);
