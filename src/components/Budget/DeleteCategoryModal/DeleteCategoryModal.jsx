import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import classNames from 'classnames';

import {
  categories as stateCategories,
  deletedCategory as stateDeletedCategory,
  moveTransactionsTo as stateMoveTransactionsTo,
  transactions as stateTransactions,
  categoryDelete as stateCategoryDelete

} from "../../../store/store";

import Modal from '../../Modal';
import Button, { TYPES } from '../../Button';

import { ReactComponent as ArrowDown } from '../../../public/img/angle.svg';

import styles from './DeleteCategoryModal.module.sass';

const DeleteCategoryModal = () => {

  const [transactions, setTransactions] = useRecoilState(stateTransactions);
  const [categories, setCategories] = useRecoilState(stateCategories);
  const deletedCategory = useRecoilValue(stateDeletedCategory);
  const setCategoryDelete = useSetRecoilState(stateCategoryDelete);
  const [moveTransactionsTo, setMoveTransactionsTo] = useState(stateMoveTransactionsTo);

  const deleteCategory = (e, [type, cat], to) => {
    e.preventDefault();
    const deleted = categories[type].findIndex(i => i === cat);

    const trans = transactions;
    const transChanged = trans
    .filter(t => t.cat === cat)
    .map(t => {
      return { ...t, cat: to };
    });
    const transOld = trans.filter(t => {
      return t.cat !== cat;
    });
    const newTrans = [...transChanged, ...transOld];

    setCategories(type === 'expenses'
      ? {
        expenses: [
          ...categories.expenses.slice(0, deleted),
          ...categories.expenses.slice(deleted + 1),
        ],
        incomes: categories.incomes
      }
      : {
        expenses: categories.expenses,
        incomes: [
          ...categories.incomes.slice(0, deleted),
          ...categories.incomes.slice(deleted + 1),
        ]
      }
    );
    setTransactions(newTrans);
    setCategoryDelete(false);
  };

  useEffect(() => {
    setMoveTransactionsTo(categories[deletedCategory[0]].filter(cat => cat !== deletedCategory[1])[0]);
  }, []);

  return (
    <Modal onOverlayClick={() => setCategoryDelete(false)}>
      <div className={styles.modal}>
        {categories[deletedCategory[0]]?.length <= 1 ? (
          <>
            <h3 className={styles.modal__title}>You can't delete your last category</h3>
            <div className={styles.modal__buttons}>
              <Button
                onClick={() => setCategoryDelete(false)}
                className={classNames(styles.button, styles.modal__button)}
              >
                Got it
              </Button>
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
                <div className={styles.select}>
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
                  <ArrowDown className={styles.arrow} />
                </div>
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
