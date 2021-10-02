import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import {
  accounts as stateAccounts,
  transactions as stateTransactions,
  filter as stateFilter,
  activeStartDate as startDate,
  activeEndDate as endDate,
  filteredAcc as stateFilteredAcc
} from "../../store/store";

import Transactions from '../Transactions';

import styles from './Balance.module.sass';

import DeleteAccountModal from './DeleteAccountModal';
import Button, { SIZES } from '../Button';
import classNames from 'classnames';

const Balance = () => {

  const [accounts, setAccounts] = useRecoilState(stateAccounts);
  const [transactions, setTransactions] = useRecoilState(stateTransactions);
  const [filter, setFilter] = useRecoilState(stateFilter);
  const [activeStartDate, setActiveStartDate] = useRecoilState(startDate);
  const [activeEndDate, setActiveEndDate] = useRecoilState(endDate);
  const [filteredAcc, setFilteredAcc] = useRecoilState(stateFilteredAcc);

  const [showEdit, setShowEdit] = useState(false);

  const [shouldDeleteAccount, setShouldDeleteAccount] = useState(false);
  const [deletedAccount, setDeletedAccount] = useState(null);

  const [accountTitle, setAccountTitle] = useState('');
  const [accountBalance, setAccountBalance] = useState('');

  const [showError, setShowError] = useState(false);

  const confirmAccountDelete = (e, id) => {
    e.stopPropagation();
    setShouldDeleteAccount(true);
    setDeletedAccount(id);
  };

  const deleteAccount = (id) => {
    const deleted = accounts.findIndex(acc => acc.id === id);

    const newTransactions = transactions.slice(0).filter(t => t.account !== id);

    setAccounts([...accounts.slice(0, deleted), ...accounts.slice(deleted + 1)]);
    setTransactions(newTransactions);
  };

  const onAccountAdded = async () => {
    const account = await accounts.find(acc => acc.title === accountTitle);
    // account && setShowError(true);
    if (account) setShowError(true);
    if (!account) {
      setAccounts([
        ...accounts,
        { title: accountTitle, balance: accountBalance, id: accounts.slice(-1)[0]?.id + 1 || 0 }
      ]);
      setAccountTitle('');
      setAccountBalance('');
      setShowError(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);


  const renderedAccounts = accounts.map(acc => {
    return (
      <div
        onClick={() => {
          setFilter(filter !== null && filteredAcc === acc.id ? null : 'acc');
          setFilteredAcc(filteredAcc === acc.id ? null : acc.id);
        }}
        key={acc.title}
        className={styles.account}
      >
        <div>
          <div className={styles.account__title}>{acc.title}</div>
          <div className={styles.account__balance}>
            {String(acc.balance).includes('.') ? `${Number(acc.balance).toFixed(2)} ₴` : `${acc.balance} ₴`}
          </div>
        </div>
        <div>
          {acc.id === filteredAcc ? '✓  ' : ''}
          {showEdit && (
            <button
              className={styles.account__delete}
              onClick={e => confirmAccountDelete(e, acc.id)}
            >
              -
            </button>
          )}
        </div>
      </div>
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.balance}>
        <div className={styles.balance__accounts}>
          <h1 className={styles.title}>Accounts</h1>
          {renderedAccounts.length > 0 ? renderedAccounts :
            <h4 className={styles.subtitle}>You don't have any accounts yet. <br /> Please, create new account</h4>}
          <Button
            size={SIZES.SM}
            className={styles.button}
            onClick={() => setShowEdit(!showEdit)}
          >
            {showEdit ? 'Done' : 'Edit'}
          </Button>
          {showEdit && (
            <form className={styles.addAccount}>
              <label>Create new Account</label>
              <input
                type="text"
                placeholder="Title"
                autoFocus
                required
                value={accountTitle}
                onChange={e => setAccountTitle(e.target.value)}
              />
              <div className={classNames(styles.errorMsg, { [styles.hidden]: !showError })}>
                Please, use unique name for account
              </div>
              <input
                type="text"
                required
                placeholder="Balance"
                value={accountBalance}
                onChange={e => {
                  const reg = /^[0-9]*\.?[0-9]{0,2}$/;
                  e.target.value.match(reg) && setAccountBalance(e.target.value);
                }}
              />
              <Button className={styles.button} onClick={() => onAccountAdded()}>Add</Button>
            </form>
          )}
        </div>
        <div className={styles.balance__transactions}>
          <div className={styles.filter}>
            <input
              type="date"
              value={activeStartDate.slice(0, 10)}
              onChange={e => setActiveStartDate(new Date(e.target.value).toISOString())}
            />
            <span>—</span>
            <input
              type="date"
              value={activeEndDate.slice(0, 10)}
              min={activeStartDate.slice(0, 10)}
              onChange={e => setActiveEndDate(new Date(e.target.value).toISOString())}
            />
          </div>
          <Transactions className={styles.transactions} />
        </div>
        {shouldDeleteAccount && (
          <DeleteAccountModal
            onOverlayClick={() => setShouldDeleteAccount(false)}
            onAccountDelete={() => {
              deleteAccount(deletedAccount);
              setShouldDeleteAccount(false);
            }}
            onCancelAccountDelete={() => setShouldDeleteAccount(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Balance;
