import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { RecoilRoot } from "recoil";

import Header from '../Header';
import Today from '../Today';
import Balance from '../Balance';
import Budget from '../Budget';
import Report from '../Report';

import styles from './App.module.sass';

const App = () => {
  return (
    <RecoilRoot>
      <Router basename={'money-tracker'}>
        <div className={styles.app}>
          <Header />
          <Switch>
            <Route path="/" exact>
              <Today />
            </Route>
            <Route path="/balance">
              <Balance />
            </Route>
            <Route path="/budget">
              <Budget />
            </Route>
            <Route path="/report">
              <Report />
            </Route>
          </Switch>
        </div>
      </Router>
    </RecoilRoot>
  );
};

export default App;
