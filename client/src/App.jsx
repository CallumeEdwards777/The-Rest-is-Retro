import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import ItemList from './components/ItemList';
import ItemDetails from './components/ItemDetails';
import CreateItem from './components/CreateItem';

import { SessionProvider } from './contexts/SessionContext';

const App = () => {
  return (
    <Router>
      <SessionProvider>
        <Header />
        <Routes>
          <Route path="/" element={<ItemList />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/create-item" element={<CreateItem />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </SessionProvider>
    </Router>
  );
};

export default App;
