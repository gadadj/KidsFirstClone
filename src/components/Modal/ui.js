import styled from 'react-emotion';
import { ActionButton } from 'uikit/Button';
import Column from 'uikit/Column';
import ReactModal from 'react-modal';

export const ModalFooterContainer = styled('div')`
  ${({ theme }) => theme.row};
  background-color: ${({ theme }) => theme.greyScale10};
  border-radius: 5px;
  padding: 1em;
  margin-top: 1em;
  justify-content: space-between;
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  align-items: center;
`;

export const ModalFooterContent = styled('div')`
  ${({ theme }) => theme.center};
  flex: 1;
`;

export const ModalActionButton = styled(ActionButton)`
  font-size: 14px;
  height: auto;
`;

export const CancelButton = styled(ModalActionButton)`
  ${({ theme }) => theme.wizardButton};
  padding: 0px 16px;
  height: auto;
  text-transform: none;
`;

export const Modal = styled(ReactModal)`
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  position: absolute;
  border: 1px solid ${({ theme }) => theme.borderGrey};
  background: ${({ theme }) => theme.white};
  border-radius: 4px;
  transform: translate(-50%, -50%);
  width: 95%;
  padding: 20px 20px;
  max-width: 1000px;
  max-height: 85%;
  min-height: 0;
  box-shadow: ${({ theme }) => theme.shadow} 0px 5px 15px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  padding-bottom: ${({ isFooterShown }) => (isFooterShown ? '75px' : '')};
  & * {
    box-sizing: border-box;
  }
`;

export const ModalContent = styled(Column)`
  z-index: 1000;
  flex: 1;
  height: 100%;
  min-height: 0;
`;

export const ModalSubHeader = styled('div')`
  ${({ theme }) => theme.modalHeader};
  margin-bottom: 9px;
`;
