import { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";

import {
  accounts as accountsList,
  categories as categoriesList,
  transactions as transactionsList
} from "../../store/store";

import TransactionItem from "./TransactionItem";
import Button, { SIZES, TYPES } from '../Button';

import styles from './AddTransaction.module.sass';

const AddTransaction = () => {

  const categories = useRecoilValue(categoriesList);
  const [transactions, setTransactions] = useRecoilState(transactionsList);
  const [accounts, setAccounts] = useRecoilState(accountsList);

  const localDate = new Date();
  const offset = new Date().getTimezoneOffset();
  const dateNow = localDate.getTime() - offset * 1000 * 60;

  const [date, setDate] = useState(new Date(dateNow).toISOString().slice(0, 16));
  const [sum, setSum] = useState('');
  const [category, setCategory] = useState(categories.expenses[0]);
  const [account, setAccount] = useState(accounts[0]);
  const [type, setType] = useState('expenses');

  const selectAccounts = accounts.map(acc => {
    return (
      <option value={acc.title} key={acc.title}>
        {acc.title}
      </option>
    );
  });

  const selectCategories = categories[type] &&
    categories[type].map(cat => (
        <option value={cat} key={cat}>
          {cat}
        </option>
      )
    );

  const selectTypes = (
    <>
      <option value="expenses" key="expenses">
        Expense
      </option>
      <option value="incomes" key="incomes">
        Income
      </option>
    </>
  );

  const addTransaction = () => {
    setTransactions([...transactions, {
      cat: category,
      price: type === 'expenses' ? Number(-`${sum}`) : +sum,
      date: new Date(date).toISOString(),
      id: transactions[transactions.length - 1]?.id + 1 || 0,
      account: account.id,
    }]);

    const changedAccIdx = accounts.findIndex(acc => account.id === acc.id);
    let changedAcc = { ...accounts[changedAccIdx] };
    const changedSum = type === 'expenses' ? -(+sum) : +sum;
    changedAcc.balance = +changedAcc.balance + changedSum;

    setAccounts([
      ...accounts.slice(0, changedAccIdx),
      changedAcc,
      ...accounts.slice(changedAccIdx + 1),
    ]);

    setSum('');
    setCategory(categories.expenses[0]);
    setAccount(accounts[0]);
    setType('expenses');
  };

  const changeType = (e) => {
    setType(e.target.value);
    categories[e.target.value] && setCategory(categories[e.target.value][0]);
  };

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  return (
    <div className={styles.addTransaction}>
      <h1 className={styles.title}>New Transaction</h1>

      {accounts.length > 0 ? (
        <form>
          <TransactionItem
            label="Type:"
            type="select"
            value={type}
            onChange={e => changeType(e)}
            options={selectTypes}
            key={1}
          />

          <TransactionItem
            label="Account:"
            type="select"
            value={account.title}
            onChange={e => setAccount(accounts.find(acc => acc.title === e.target.value))}
            options={selectAccounts}
            key={2}
          />

          <TransactionItem
            label="Sum:"
            type="input"
            value={sum}
            placeholder="Enter the sum"
            onChange={e => {
              const reg = /^[0-9]*\.?[0-9]{0,2}$/;
              if (e.target.value.slice(0, 1) === '0') return;
              e.target.value.match(reg) && setSum(e.target.value);
            }}
            inputType="text"
            key={3}
          />

          {type !== 'transfer' &&
          <TransactionItem
            label="Category:"
            type="select"
            value={category}
            onChange={e => setCategory(e.target.value)}
            options={selectCategories}
            key={4}
          />
          }

          <TransactionItem
            label="Date:"
            type="input"
            inputType="datetime-local"
            value={date}
            onChange={e => setDate(e.target.value)}
            key={5}
          />

          <Button
            type={TYPES.MAIN}
            size={SIZES.SM}
            className={styles.button}
            onClick={() => addTransaction()}
          >
            Add
          </Button>
        </form>
      ) : (
        <h4 className={styles.subtitle}>Please, create new account</h4>
      )}
    </div>
  );
};

export default AddTransaction;
