import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import ItemList from './components/ItemList';
import ItemDetails from './components/ItemDetails';
import CreateItem from './components/CreateItem';
import EditItem from './components/EditItem';
import MyListings from './components/MyListings';
import Confirm from './components/Confirm';

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
          <Route path="/edit-item/:id" element={<EditItem />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </SessionProvider>
    </Router>
  );
};

export default App;
