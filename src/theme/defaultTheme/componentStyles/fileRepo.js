import { css } from 'react-emotion';

export default `fileRepoContainer ${css`
  display: flex;
  height: 100%;
  box-sizing: border-box;

  & .aggregationsPanel {
    height: 100%;
    height: calc(100vh - 180px);
    overflow-y: auto;
    background-color: #f4f5f8;
    box-shadow: 0 0 4.9px 0.2px #a0a0a3;
    border: solid 1px #c6c7cc;
    flex: none;
    & .aggregationsHeader {
      display: flex;
      padding: 15px 7px 15px 12px;
      & .aggregationsHeaderTitle {
        flex-grow: 1;
        font-size: 18px;
        color: #2b388f;
      }
    }
  }

  & .tableContainer {
    padding: 30px;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    flex-grow: 1;
    & .accessControlIconImage {
      width: 11px;
      margin: auto;
      display: block;
    }
    & .downloadIconImage {
      width: 10px;
      margin-right: 9px;
    }
  }

  & .ReactTable .rt-thead .rt-th.-sort-desc,
  .ReactTable .rt-thead .rt-td.-sort-desc {
    box-shadow: inset 0 -3px 0 0 rgba(64, 76, 154, 0.7);
  }

  & .ReactTable .rt-thead .rt-th.-sort-asc,
  & .ReactTable .rt-thead .rt-td.-sort-asc {
    box-shadow: inset 0 3px 0 0 rgba(64, 76, 154, 0.7);
  }

  & .tableToolbar {
    border-left: solid 1px #e0e1e6;
    border-right: solid 1px #e0e1e6;
  }

  & div.sqon-view {
    flex-grow: 1;
  }

  & .uploadIdsButton {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    & .button {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    & .select {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      border-left: none;
      padding-left: 0;
      & .optionDropdownWrapper {
        padding: 0px;
        box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.43);
      }
    }
  }
`}`;
