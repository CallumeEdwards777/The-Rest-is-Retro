import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Signup from './components/Signup';
import ItemList from './components/ItemList';
import ItemDetails from './components/ItemDetails';
import CreateItem from './components/CreateItem';
import EditItem from './components/EditItem';
import MyListings from './components/MyListings';
import SavedItems from './components/SavedItems';
import Confirm from './components/Confirm';
import Faq from './components/Faq';
import Verification from './components/Verification';
import SellerPage from './components/SellerPage';

import { SessionProvider } from './contexts/SessionContext';
import { SavedProvider } from './contexts/SavedContext';
import { needsOnboarding } from './onboarding';

// First-time visitors meet the quiz before the shop.
const Home = () => (needsOnboarding() ? <Navigate to="/welcome" replace /> : <ItemList />);

const App = () => {
  return (
    <Router>
      <SessionProvider>
        <SavedProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/item/:id" element={<ItemDetails />} />
            <Route path="/create-item" element={<CreateItem />} />
            <Route path="/edit-item/:id" element={<EditItem />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/saved" element={<SavedItems />} />
            <Route path="/confirm" element={<Confirm />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/seller/:id" element={<SellerPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
          <Footer />
        </SavedProvider>
      </SessionProvider>
    </Router>
  );
};

export default App;
