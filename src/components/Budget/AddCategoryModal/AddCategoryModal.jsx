import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useRecoilState, useSetRecoilState } from 'recoil';

import Modal from '../../Modal';
import Button, { TYPES } from '../../Button';

import {
  addNewCategory as stateAddNewCategory,
  categories as stateCategories,
} from "../../../store/store";

import styles from './AddCategoryModal.module.sass';

const AddCategoryModal = ({ newCategoryType, setCategoryAdd }) => {

  const [categories, setCategories] = useRecoilState(stateCategories);
  const setAddNewCategory = useSetRecoilState(stateAddNewCategory);
  const [addCategoryValue, setAddCategoryValue] = useState('');
  const [showError, setShowError] = useState(false);

  const addCategory = async (addCategoryValue) => {
    const category = await categories[`${newCategoryType}s`].find(
      cat => cat === addCategoryValue
    );
    if (category) {
      setShowError(true);
      return;
    }

    if (!category) {

      if (newCategoryType === 'income') {
        setCategories({
          expenses: categories.expenses,
          incomes: [...categories.incomes, addCategoryValue],
        });
      }

      if (newCategoryType === 'expense') {
        setCategories({
          expenses: [...categories.expenses, addCategoryValue],
          incomes: categories.incomes,
        });
      }

      localStorage.setItem('categories', JSON.stringify(categories));

      setAddNewCategory(false);
    }
  };

  useEffect(() => {

  }, [addCategoryValue]);

  return (
    <Modal onOverlayClick={() => setCategoryAdd(false)}>
      <div className={styles.modal}>
        <h3 className={styles.modal__title}>Please, enter the name of the category</h3>
        <form className={styles.modal__form} onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            placeholder="Type new category name"
            value={addCategoryValue}
            onChange={e => setAddCategoryValue(e.target.value)}
          />
          <div className={classNames(styles.errorMsg, { [styles.hidden]: !showError })}>
            Please, use unique name for category
          </div>
          <div className={styles.modal__buttons}>
            <Button
              className={styles.button}
              onClick={() => addCategory(addCategoryValue)}
            >
              Add
            </Button>
            <Button type={TYPES.MUTED} className={styles.button} onClick={() => setCategoryAdd(false)}>
              Cancel
            </Button>
          </div>

        </form>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;
