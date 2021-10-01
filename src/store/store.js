import { atom } from 'recoil';

export const transactions = atom({
  key: 'transactions',
  default: JSON.parse(localStorage.getItem('transactions')) || []
});

export const accounts = atom({
  key: 'accounts',
  default: JSON.parse(localStorage.getItem('accounts')) || [
    { title: 'Cash', balance: 1000, id: 0 },
  ]
});

export const categories = atom({
  key: 'categories',
  default: JSON.parse(localStorage.getItem('categories')) || {
    expenses: [
      'Food',
      'Travel',
      'Health',
      'Car',
      'House',
      'Gifts',
      'Entertainment',
      'Restaurants, cafe',
    ],
    incomes: ['Salary', 'Dividend', 'Gift'],
  }
});

/* EDIT TRANSACTION */
export const edit = atom({
  key: 'edit',
  default: null
});
export const editAccount = atom({
  key: 'editAccount',
  default: ''
});
export const editSum = atom({
  key: 'editSum',
  default: ''
});
export const editCategory = atom({
  key: 'editCategory',
  default: ''
});
export const editDate = atom({
  key: 'editDate',
  default: ''
});
/* END EDIT TRANSACTION */

export const activeStartDate = atom({
  key: 'activeStartDate',
  default: new Date(new Date().setDate(1)).toISOString()
});

export const activeEndDate = atom({
  key: 'activeEndDate',
  default: new Date(
    new Date(
      new Date(
        new Date().setDate(1)
      ).toISOString()
    ).setMonth(new Date(
      new Date(
        new Date().setDate(1)
      ).toISOString()
    ).getMonth() + 1)
  ).toISOString()
});

export const selectedDate = atom({
  key: 'selectedDate',
  default: null
});

export const filter = atom({
  key: 'filter',
  default: null
});

export const filteredAcc = atom({
  key: 'filteredAcc',
  default: null
});

export const deletedCategory = atom({
  key: 'deletedCategory',
  default: null
});

export const moveTransactionsTo = atom({
  key: 'moveTransactionsTo',
  default: null
});

export const categoryDelete = atom({
  key: 'categoryDelete',
  default: false
});
