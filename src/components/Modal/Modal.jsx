import React from 'react';

import Portal from '../Portal';

import styles from './Modal.module.sass';

const Modal = ({ onOverlayClick, children }) => {
  return (
    <Portal>
      <div className={styles.modalWrap}>
        <div className={styles.overlay} onClick={onOverlayClick}></div>
        <div className={styles.modal}>
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
