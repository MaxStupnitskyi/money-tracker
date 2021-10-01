import Modal from '../../Modal';
import Button from '../../Button';

import styles from './AddCategoryModal.module.sass';
import { useEffect, useState } from 'react';

const AddCategoryModal = ({ addCategory, showError }) => {

  const [addCategoryValue, setAddCategoryValue] = useState('');

  useEffect(() => {

  }, [addCategoryValue]);

  return (
    <Modal>
      <div className="modal newCategory">
        <h3 className="modal__title">Please, enter the name of the category</h3>
        <form className="modal__form" onSubmit={e => this.addCategory(e)}>
          <input
            type="text"
            placeholder="Type new category name"
            value={addCategoryValue}
            onChange={e => setAddCategoryValue(e.target.value)}
          />
          <div className={`error-msg ${showError}`}>
            Please, use unique name for category
          </div>
          <Button
            className={styles.modalButton}
            onClick={() => addCategory(addCategoryValue)}
          >
            Add
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;
