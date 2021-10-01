import React from 'react';
import classNames from 'classnames';

import Button, { TYPES } from '../../Button';
import Modal from '../../Modal';

import styles from './DeleteAccountModal.module.sass';

const DeleteAccountModal = ({ onOverlayClick, onAccountDelete, onCancelAccountDelete }) => {
  return (
    <Modal onOverlayClick={onOverlayClick}>
      <div className={styles.deleteAccount}>
        <h3 className={styles.modal__title}>
          Are you sure you want to delete account? All account transactions will be deleted
          too
        </h3>
        <div className={styles.modal__buttons}>
          <Button
            onClick={onAccountDelete}
            type={TYPES.DANGER}
            className={styles.button}
          >
            Delete account
          </Button>
          <Button
            className={styles.button}
            onClick={onCancelAccountDelete}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
