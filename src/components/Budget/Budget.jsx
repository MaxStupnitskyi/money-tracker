import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import classNames from 'classnames';

import {
  activeStartDate as startDate,
  activeEndDate as endDate,
  categories as stateCategories,
  transactions as stateTransactions,
  deletedCategory as stateDeletedCategory,
  addNewCategory as stateAddNewCategory,
  categoryDelete as stateCategoryDelete
} from "../../store/store";

import Transactions from '../Transactions';
import Button, { SIZES } from '../Button';
import DeleteCategoryModal from './DeleteCategoryModal/DeleteCategoryModal';
import AddCategoryModal from './AddCategoryModal';

import styles from './Budget.module.sass';
import './Calendar.sass';

const Budget = () => {
  const categories = useRecoilValue(stateCategories);
  const transactions = useRecoilValue(stateTransactions);
  const [activeStartDate, setActiveStartDate] = useRecoilState(startDate);
  const [activeEndDate, setActiveEndDate] = useRecoilState(endDate);
  const setDeletedCategory = useSetRecoilState(stateDeletedCategory);
  const [categoryDelete, setCategoryDelete] = useRecoilState(stateCategoryDelete);

  const [activeCategory, setActiveCategory] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showedTransactions, setShowedTransactions] = useState([]);

  const [addNewCategory, setAddNewCategory] = useRecoilState(stateAddNewCategory);
  const [newCategoryType, setNewCategoryType] = useState(null);

  const showTransactions = (catTransactions) => {
    setShowedTransactions(catTransactions);
  };

  const onCategoryAdded = (type) => {
    setAddNewCategory(true);
    setNewCategoryType(type);
  };

  const onCategoryDeleted = (type, cat, total) => {
    console.log(type, cat, total);
    setDeletedCategory([type, cat, total]);
    setCategoryDelete(true);
  };

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const filterTransactions = (type) => {
    const html = categories[type]
    .map(cat => {
      const catTransactions = transactions.filter(
        t =>
          t.cat === cat &&
          t.date >= activeStartDate &&
          t.date < activeEndDate
      );

      const total =
        catTransactions.length > 0
          ? catTransactions.reduce((sum, t) => sum + Math.abs(t.price), 0)
          : 0;
      const button = (
        <div className={styles.category__wrap} key={cat} data-total={total}>
          <button
            className={classNames(
              styles.category,
              {
                [styles.active]: activeCategory === cat,
                [styles.editable]: showEdit
              }
            )}
            onClick={() => {
              if (activeCategory !== cat) {
                showTransactions(catTransactions);
                setActiveCategory(cat);
              } else {
                showTransactions(transactions);
                setShowedTransactions([]);
                setActiveCategory(null);
              }
            }}
          >
            <div className={styles.category__title}>{cat}</div>
            <div>
              {String(total).includes('.') ? total.toFixed(2) : total}
            </div>
          </button>
          {showEdit && (
            <button
              className={styles.deleteCategory}
              onClick={() => onCategoryDeleted(type, cat, total)}
            >
              -
            </button>
          )}
        </div>
      );
      return showEdit ? button : catTransactions.length > 0 && button;
    })
    .filter(i => i !== false)
    .sort((a, b) => b.props['data-total'] - a.props['data-total']);
    const monthTotal = html.reduce((sum, i) => sum + i.props['data-total'], 0).toFixed(2);
    return { html, monthTotal };
  };

  const changeMonth = (activeStartDate) => {
    const date = new Date(activeStartDate).setMonth(activeStartDate.getMonth() + 1);
    setActiveStartDate(new Date(activeStartDate).toISOString());
    setActiveEndDate(new Date(date).toISOString());
    setShowedTransactions([]);
    setActiveCategory(null);
  };

  const toggleCategories = () => setShowEdit(!showEdit);

  const expenses = filterTransactions('expenses');
  const incomes = filterTransactions('incomes');

  return (
    <div className={styles.budget}>
      <div className={styles.container}>
        <div className="calendar">
          <Calendar
            minDetail="month"
            onActiveStartDateChange={({ activeStartDate }) => changeMonth(activeStartDate)}
          />
        </div>
        <Button
          className={styles.button}
          size={SIZES.SM}
          onClick={() => toggleCategories()}
        >
          {showEdit ? 'Done' : 'Edit'}
        </Button>
        <div className={styles.budget__content}>
          <div
            style={
              showedTransactions.length > 0
                ? { flexBasis: '60%' }
                : { flexBasis: '100%' }
            }
          >
            <div className={styles.budget__category}>
              <div className={styles.budget__category__header}>
                <h1 className={styles.title}>expenses</h1>
                <div className={styles.total}>{expenses.monthTotal}</div>
              </div>
              <div className={styles.categories}>
                {expenses.html}
                {showEdit && (
                  <Button
                    className={classNames(styles.category, styles.addButton)}
                    onClick={() => onCategoryAdded('expense')}
                  >
                    Add Category
                  </Button>
                )}
              </div>
            </div>
            <div className={styles.budget__category}>
              <div className={styles.budget__category__header}>
                <h1 className={styles.title}>Incomes</h1>
                <div className={styles.total}>{incomes.monthTotal}</div>
              </div>
              <div className={styles.categories}>
                {incomes.html}
                {showEdit && (
                  <Button
                    className={classNames(styles.category, styles.addButton)}
                    onClick={() => onCategoryAdded('income')}
                  >
                    Add Category
                  </Button>
                )}
              </div>
            </div>
            <div className={styles.budget__footer}>
              <h1 className={styles.title}>Balance:</h1>
              <div className={styles.total}>{(incomes.monthTotal - expenses.monthTotal).toFixed(2)}</div>
            </div>
          </div>
          <div
            style={
              showedTransactions.length > 0
                ? { flexBasis: '40%', display: 'block' }
                : { display: 'none' }
            }
          >
            <Transactions className={styles.transactions} showedTrans={showedTransactions} />
          </div>
        </div>
      </div>
      {categoryDelete && <DeleteCategoryModal />}
      {addNewCategory && <AddCategoryModal setCategoryAdd={setAddNewCategory} newCategoryType={newCategoryType} />}
    </div>
  );
};

export default Budget;
