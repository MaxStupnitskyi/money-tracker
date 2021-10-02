import { useEffect } from 'react';
import { useRecoilValue, useRecoilState } from "recoil";
import classNames from 'classnames';

import {
  transactions as stateTransactions,
  activeStartDate as startDate,
  activeEndDate as endDate,
  filter as stateFilter,
  selectedDate as stateSelectedDate,
  accounts as stateAccounts,
  categories as stateCategories,
  edit as stateEdit,
  editDate as stateEditDate,
  editSum as stateEditSum,
  editCategory as stateEditCategory,
  editAccount as stateEditAccount,
  filteredAcc as stateFilteredAcc
} from "../../store/store";

import styles from './Transactions.module.sass';
import Button, { TYPES } from '../Button';

const Transactions = ({ showedTrans, className }) => {

  const transaction = [];

  const [transactions, setTransactions] = useRecoilState(stateTransactions);
  const activeStartDate = useRecoilValue(startDate);
  const activeEndDate = useRecoilValue(endDate);
  const filter = useRecoilValue(stateFilter);
  const selectedDate = useRecoilValue(stateSelectedDate);
  const [accounts, setAccounts] = useRecoilState(stateAccounts);
  const categories = useRecoilValue(stateCategories);

  // edit transaction data
  const [edit, setEdit] = useRecoilState(stateEdit);
  const [editDate, setEditDate] = useRecoilState(stateEditDate);
  const [editSum, setEditSum] = useRecoilState(stateEditSum);
  const [editCategory, setEditCategory] = useRecoilState(stateEditCategory);
  const [editAccount, setEditAccount] = useRecoilState(stateEditAccount);

  const filteredAcc = useRecoilValue(stateFilteredAcc);

  const onEditTransaction = ([id, account, price, cat, date, deleted = false]) => {
    const editedTransIdx = transactions.findIndex(trans => trans.id === id);
    const editedPrice = transactions[editedTransIdx].price;
    const editedTrans = {
      cat,
      price: editedPrice > 0 ? +price : -price,
      date,
      id,
      account,
    };
    const editedAccIdx = accounts.findIndex(acc => acc.id === account);
    const editedAcc = { ...accounts[editedAccIdx] };
    if (deleted) {
      editedAcc.balance = editedAcc.balance -= editedPrice;
    }
    editedAcc.balance -= !deleted && editedPrice + (editedPrice > 0 ? -price : +price);

    const newTransactions = deleted
      ? [
        ...transactions.slice(0, editedTransIdx),
        ...transactions.slice(editedTransIdx + 1),
      ]
      : [
        ...transactions.slice(0, editedTransIdx),
        editedTrans,
        ...transactions.slice(editedTransIdx + 1),
      ];
    setAccounts([
      ...accounts.slice(0, editedAccIdx),
      editedAcc,
      ...accounts.slice(editedAccIdx + 1),
    ]);
    setTransactions(newTransactions);

  };

  const getShowedTransactionsList = (t) => t.filter(
    transaction =>
      transaction.date >= activeStartDate &&
      transaction.date < activeEndDate
  );

  const getFilteredTransactionsList = (t) => {
    switch (filter) {
      case 'date':
        return [...t].filter(task => {
          let date = new Date(task.date).setHours(0, 0, 0, 0);
          return new Date(date).toISOString() === selectedDate?.toISOString();
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'acc':
        return [...t]
        .filter(task => {
          return task.account === filteredAcc;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      default:
        return [...t].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  };

  const showedTransactions = getShowedTransactionsList(
    getFilteredTransactionsList(showedTrans || transactions)
  );

  const offset = new Date().getTimezoneOffset();

  const showPopover = (e, t) => {
    let date = new Date(t.date).getTime() - offset * 1000 * 60;
    e.currentTarget.contains(e.target) &&
    !e.target.closest('.transactions__popover') && (() => {
      setEdit(t.id);
      setEditAccount(t.account);
      setEditSum(Math.abs(t.price));
      setEditCategory(t.cat);
      setEditDate(new Date(date).toISOString().slice(0, 16));
    })();
  };

  const hidePopover = e => {
    if (
      (edit || edit === 0) &&
      !transaction.map(i => i?.contains(e.target)).includes(true)
    ) {
      setEdit(null);
    }
  };

  useEffect(() => {
    document.body.addEventListener('click', hidePopover);
    return () => document.body.removeEventListener('click', hidePopover);
  }, [edit]);

  const options = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const renderedTransactions = showedTransactions.map(t => {
    const popover = (
      <div className={`${styles.transactions__popover} ${edit === t.id ? styles.visible : ''}`}>
        <div className={styles.popover__item}>
          <label className={styles.popover__label}>Account:</label>
          <select
            className={styles.popover__input}
            value={editAccount}
            onChange={e => setEditAccount(accounts.find(acc => acc.id === +e.target.value).id)}
          >
            {accounts.map(acc => {
              return (
                <option value={acc.id} key={acc.id}>
                  {acc.title}
                </option>
              );
            })}
          </select>
        </div>
        <div className={styles.popover__item}>
          <label className={styles.popover__label}>Sum:</label>
          <input
            className={styles.popover__input}
            type="text"
            value={editSum}
            placeholder="Enter the sum"
            onChange={e => {
              const reg = /^[0-9]*\.?[0-9]{0,2}$/;
              if (e.target.value.slice(0, 1) === '0') return;
              e.target.value.match(reg) && setEditSum(e.target.value);
            }}
          />
        </div>
        <div className={styles.popover__item}>
          <label className={styles.popover__label}>Category:</label>
          <select
            className={styles.popover__input}
            value={editCategory}
            onChange={e => setEditCategory(e.target.value)}
          >
            {categories[`${t.price > 0 ? 'incomes' : 'expenses'}`].map(cat => {
              return (
                <option value={cat} key={cat}>
                  {cat}
                </option>
              );
            })}
          </select>
        </div>
        <div className={styles.popover__item}>
          <label className={styles.popover__label}>Date:</label>
          <input
            className={styles.popover__input}
            type="datetime-local"
            value={editDate}
            onChange={e => setEditDate(e.target.value)}
          />
        </div>

        <Button
          onClick={() => {
            onEditTransaction([edit, editAccount, editSum, editCategory, editDate, false]);
            setEdit(null);
          }}
          className={classNames([styles.button, styles.transactions__popover__button])}
        >
          Save Changes
        </Button>
        <Button
          type={TYPES.DANGER}
          onClick={() => {
            onEditTransaction([edit, editAccount, editSum, editCategory, editDate, true]);
            setEdit(null);
          }}
          className={classNames([styles.button, styles.transactions__popover__button])}
        >
          Delete
        </Button>
      </div>
    );

    return (
      <div
        ref={ref => (transaction[t.id] = ref)}
        onClick={e => (edit === null || edit !== t.id) && showPopover(e, t)}
        className={styles.transactions__item}
        key={t.id}
      >
        <div>
          <div className={styles.transactions__item__cat}>{t.cat}</div>
          <div className={styles.transactions__item__date}>
            {new Date(t.date).toLocaleString(window.navigator.language, options)}
          </div>
        </div>
        <div className={`${styles.transactions__item__price} ${t.price > 0 ? styles.income : styles.expense}`}>
          {String(t.price).includes('.') ? `${Math.abs(t.price).toFixed(2)} ₴` : `${Math.abs(t.price)} ₴`}
        </div>
        {popover}
      </div>
    );
  });

  return (
    <div className={classNames(styles.transactions, className)}>
      {
        renderedTransactions.length > 0
          ? renderedTransactions
          : <h4 className={styles.transactions__none}>You don't have any transactions yet</h4>
      }
    </div>
  );
};

export default Transactions;
