import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Empty, { mapping } from './Empty';

configure({ adapter: new Adapter() });

describe('Empty', () => {
  let wrapper: ReactWrapper;

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    wrapper = mount(<Empty />);
    expect(wrapper.exists()).toBe(true);
  });

  it('should render a default description', () => {
    wrapper = mount(<Empty />);
    expect(wrapper.text()).toBe('No available data');
  });

  it('should render a vertical image with default size when no size or direction are given', () => {
    wrapper = mount(<Empty />);
    expect(wrapper.find('img').prop('src')).toBe(mapping['DEFAULT.VERTICAL']);
  });
});
