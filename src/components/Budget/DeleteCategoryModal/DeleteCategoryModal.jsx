import React, { useEffect, useState } from 'react';
import { useSetRecoilState, useRecoilValue } from "recoil";
import classNames from 'classnames';

import {
  categories as stateCategories,
  deletedCategory as stateDeletedCategory,
  moveTransactionsTo as stateMoveTransactionsTo,
  categoryDelete as stateCategoryDelete
} from "../../../store/store";

import Modal from '../../Modal';

import styles from './DeleteCategoryModal.module.sass';
import Button, { TYPES } from '../../Button';

const DeleteCategoryModal = ({ deleteCategory }) => {

  const categories = useRecoilValue(stateCategories);
  const deletedCategory = useRecoilValue(stateDeletedCategory);
  const [moveTransactionsTo, setMoveTransactionsTo] = useState(stateMoveTransactionsTo);
  const setCategoryDelete = useSetRecoilState(stateCategoryDelete);

  useEffect(() => {
    setMoveTransactionsTo(categories[deletedCategory[0]].filter(cat => cat !== deletedCategory[1])[0]);
  }, []);

  return (
    <Modal>
      <div className={classNames(styles.modal, styles.deleteCategory)}>
        {categories[deletedCategory[0]]?.length <= 1 ? (
          <>
            <h3 className={styles.modal__title}>You can't delete your last category</h3>
            <div className={styles.modal__buttons}>
              <button
                onClick={() => setCategoryDelete(false)}
                className={classNames(styles.button, styles.modal__button)}
              >
                Got it
              </button>
            </div>
          </>
        ) : (
          <form
            className={styles.modal__form}
          >
            {deletedCategory[2] === 0 ? (
              <h3 className={styles.modal__title}>Are you sure you want to delete category?</h3>
            ) : (
              <>
                <h3 className={styles.modal__title}>
                  Please, select category for moving transactions
                </h3>
                <select
                  onChange={e => setMoveTransactionsTo(e.target.value)}
                >
                  {categories[deletedCategory[0]]
                  .filter(cat => cat !== deletedCategory[1])
                  .map(cat => {
                    return (
                      <option value={cat} key={cat}>
                        {cat}
                      </option>
                    );
                  })}
                </select>
              </>
            )}
            <div className={styles.modal__buttons}>
              <Button className={styles.button} type={TYPES.DANGER} onClick={e =>
                deleteCategory(
                  e,
                  deletedCategory,
                  moveTransactionsTo
                )
              }>
                Delete category
              </Button>
              <Button className={styles.button} onClick={() => setCategoryDelete(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default DeleteCategoryModal;
