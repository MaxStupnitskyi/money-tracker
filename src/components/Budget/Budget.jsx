import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { useRecoilState } from "recoil";
import classNames from 'classnames';

import {
  activeStartDate as startDate,
  activeEndDate as endDate,
  categories as stateCategories,
  transactions as stateTransactions,
  deletedCategory as stateDeletedCategory,
  moveTransactionsTo as stateMoveTransactionsTo,
  categoryDelete as stateCategoryDelete
} from "../../store/store";

import Transactions from '../Transactions';
import Button from '../Button';
import DeleteCategoryModal from './DeleteCategoryModal/DeleteCategoryModal';
import AddCategoryModal from './AddCategoryModal';

import styles from './Budget.module.sass';
import './Calendar.sass';

const Budget = () => {
  const [categories, setCategories] = useRecoilState(stateCategories);
  const [transactions, setTransactions] = useRecoilState(stateTransactions);
  const [activeStartDate, setActiveStartDate] = useRecoilState(startDate);
  const [activeEndDate, setActiveEndDate] = useRecoilState(endDate);
  const [deletedCategory, setDeletedCategory] = useRecoilState(stateDeletedCategory);
  const [moveTransactionsTo, setMoveTransactionsTo] = useRecoilState(stateMoveTransactionsTo);
  const [categoryDelete, setCategoryDelete] = useRecoilState(stateCategoryDelete);

  const [activeCategory, setActiveCategory] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showedTransactions, setShowedTransactions] = useState([]);

  const [addNewCategory, setAddNewCategory] = useState(false);
  const [newCategoryType, setNewCategoryType] = useState(null);
  const [addCategoryValue, setAddCategoryValue] = useState('');

  const [showError, setShowError] = useState(false)

  const showTransactions = (catTransactions) => {
    setShowedTransactions(catTransactions);
  };

  const onCategoryAdded = (type) => {
    setAddNewCategory(true);
    setNewCategoryType(type);
  };

  const addCategory = async (e) => {
    e.preventDefault();
    const category = await categories[`${newCategoryType}s`].find(
      cat => cat === addCategoryValue
    );
    // this.setState({ showError: category ? '' : 'hidden' });

    // if (this.state.showError !== '') {
    //   this.setState(state => {
    //     let categories = state.categories;
    //     if (state.newCategoryType === 'income') {
    //       categories = {
    //         expences: state.categories.expences,
    //         incomes: [...state.categories.incomes, state.addCategoryValue],
    //       };
    //     }
    //     if (state.newCategoryType === 'expence') {
    //       categories = {
    //         expences: [...state.categories.expences, state.addCategoryValue],
    //         incomes: state.categories.incomes,
    //       };
    //     }
    //
    //     localStorage.setItem('categories', JSON.stringify(categories));
    //
    //     return {
    //       categories: categories,
    //       addNewCategory: false,
    //       newCategoryType: null,
    //       addCategoryValue: '',
    //     };
    //   });
    // }
  };

  const onCategoryDeleted = (type, cat, total) => {
    console.log(type, cat, total);
    setDeletedCategory([type, cat, total]);
    setCategoryDelete(true);
  };

  const deleteCategory = (e, [type, cat], to) => {
    e.preventDefault();
    console.log(type, cat, to);
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
        <div className={styles.category__wrap} key={cat} total={total}>
          <button
            className={classNames(styles.category, activeCategory === cat && styles.active, showEdit && styles.editable)}
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
            <div className={styles.category__total}>
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
    .sort((a, b) => b.props.total - a.props.total);
    const monthTotal = html.reduce((sum, i) => sum + i.props.total, 0).toFixed(2);
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
        <button className={classNames(styles.button, styles.edit)} onClick={() => toggleCategories()}>
          {showEdit ? 'Done' : 'Edit'}
        </button>
        <div className={styles.budget__content}>
          <div
            className={styles.budget__categories}
            style={
              showedTransactions.length > 0
                ? { flexBasis: '60%' }
                : { flexBasis: '100%' }
            }
          >
            <div className={classNames(styles.budget__category, styles.expenses)}>
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
            <div className={classNames(styles.budget__category, styles.incomes)}>
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
            className={styles.budget__transactions}
            style={
              showedTransactions.length > 0
                ? { flexBasis: '40%', display: 'block' }
                : { display: 'none' }
            }
          >
            <Transactions showedTrans={showedTransactions} />
          </div>
        </div>
      </div>
      {
        categoryDelete && (
          <DeleteCategoryModal deleteCategory={deleteCategory} />
        )
      }
      {addNewCategory && (
        <AddCategoryModal addCategory={addCategory} showError={showError} />
      )}
    </div>
  );
};

export default Budget;
