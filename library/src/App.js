import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from './screens/Home';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Switch> 
          <Route path='/home' component={Home}/> 
          <Redirect to='/home'/>
     </Switch>
    </BrowserRouter>
  </div>
  );
}

export default App;
