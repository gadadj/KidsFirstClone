import React from 'react';
import Downshift from 'downshift';

import downChevronIcon from '../assets/icon-chevron-down-grey.svg';

function Select({
  items,
  className,
  itemClassName,
  itemContainerClassName,
  align = 'right',
  ...rest
}) {
  return (
    <Downshift {...rest}>
      {({ getItemProps, isOpen, toggleMenu, selectedItem }) => (
        <div
          css={`
            position: relative;
            white-space: nowrap;
            border-radius: 10px;
            background-color: #ffffff;
            border: solid 1px #cacbcf;
            color: #343434;
            font-size: 12px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            padding-left: 10px;
            ${className};
          `}
        >
          <div
            style={{
              display: 'flex',
              cursor: 'pointer',
              flexGrow: 1,
              height: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onClick={toggleMenu}
          >
            {selectedItem}
            <img
              alt=""
              src={downChevronIcon}
              css={`
                width: 9px;
                margin-left: 7px;
                margin-right: 12px;
                transform: rotate(${isOpen ? 180 : 0}deg);
                transition: transform 0.2s;
              `}
            />
          </div>
          {!isOpen ? null : (
            <div
              css={`
                position: absolute;
                background: white;
                min-width: 100%;
                z-index: 1;
                border: 1px solid rgba(0, 0, 0, 0.05);
                box-sizing: border-box;
                cursor: pointer;
                padding: 5px;
                right: ${align === 'right' ? `0` : `auto`};
                left: ${align === 'right' ? `auto` : `0`};
                top: 100%;
                ${itemContainerClassName};
              `}
            >
              {items.map(item => (
                <div
                  {...getItemProps({ item })}
                  key={item}
                  css={`
                    cursor: pointer;
                    padding: 5px;
                    ${itemClassName};
                  `}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
}

export default Select;
