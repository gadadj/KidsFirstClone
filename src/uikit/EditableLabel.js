// @flow
// TODO: move this to arranger/components
import React from 'react';
import { compose, withState, withHandlers, defaultProps, withPropsOnChange } from 'recompose';

import PencilIcon from 'react-icons/lib/fa/pencil';

export default compose(
  withState('editing', 'setIsEditing', ({ isEditing }) => isEditing || false),
  withState('originalValue', 'setOriginalValue', ({ value }) => value),
  withState('inputValue', 'setInputValue', ({ value }) => value || ''),
  defaultProps({
    handleSave: value => console.log(value),
  }),
  withPropsOnChange(['isEditing'], ({ setIsEditing, isEditing }) => setIsEditing(isEditing)),
  withHandlers({
    handleCancel: ({ originalValue, setIsEditing, setInputValue }) => () => {
      setIsEditing(false);
      setInputValue(originalValue || '');
    },
  }),
  withHandlers({
    toggleEditingAndSave: ({
      editing,
      setIsEditing,
      inputValue,
      handleSave,
      handleCancel,
      onChange,
      required,
    }) => e => {
      setIsEditing(!editing);
      if (!required || (required && inputValue.length !== 0)) {
        handleSave(inputValue);
      }
    },
  }),
)(
  ({
    key,
    name,
    editing,
    required = false,
    toggleEditingAndSave,
    inputValue,
    setInputValue,
    setIsEditing,
    handleCancel,
    displayButtons,
    onChange = () => {},
    options = [],
    disabled = false,
  }) => (
    <div key={key}>
      {editing ? (
        <div style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {options.length === 0 && (
            <input
              style={{
                width: '300px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
              }}
              value={inputValue}
              onChange={e => {
                setInputValue(e.target.value);
                onChange(e);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  toggleEditingAndSave(e);
                } else if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
              type="text"
              autoFocus
              onFocus={e => e.target.select()}
              name={name}
            />
          )}
          {options.length > 0 && (
            <select
              component="select"
              name="roles"
              onChange={e => {
                setInputValue(e.target.value);
                onChange(e);
              }}
            >
              <option value="" disabled={true}>
                Select...
              </option>
              {options.map(role => (
                <option value={role} key={role} selected={role === inputValue ? 'selected' : ''}>
                  {role}
                </option>
              ))}
            </select>
          )}
          {displayButtons && (
            <span>
              <button
                onClick={e => toggleEditingAndSave(e)}
                disabled={required && inputValue.length === 0}
              >
                Save
              </button>
              <button onClick={handleCancel}>Cancel</button>
            </span>
          )}
        </div>
      ) : (
        <div
          onClick={disabled ? () => {} : e => toggleEditingAndSave(e)}
          style={{
            cursor: 'text',
          }}
        >
          <span>{inputValue}</span>
          {!disabled && <PencilIcon style={{ paddingLeft: '10px' }} />}
        </div>
      )}
    </div>
  ),
);
