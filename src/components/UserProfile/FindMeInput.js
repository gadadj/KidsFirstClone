import React, { Component } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

//based on : https://ant.design/components/form/?locale=en-US#header
class FindMeInput extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  state = {
    inputVal: (this.props.value || {}).inputVal,
  };

  onChange = (e) => {
    const value = e.target.value;
    if (!('value' in this.props)) {
      this.setState({ inputVal: value });
    }
    this.triggerChange({ inputVal: value });
  };

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
  };

  render() {
    const { item } = this.props;
    const { inputVal } = this.state;
    return (
      <Input
        placeholder={item.placeHolder}
        size={'small'}
        value={inputVal}
        type="text"
        onChange={this.onChange}
        prefix={item.icon}
      />
    );
  }
}

FindMeInput.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string,
    placeHolder: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  }).isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func,
};

export default FindMeInput;
