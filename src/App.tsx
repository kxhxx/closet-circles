
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import EditProfile from "./pages/EditProfile";
import Messages from "./pages/Messages";
import MenswearPage from "./pages/MenswearPage";
import WomenswearPage from "./pages/WomenswearPage";
import SellPage from "./pages/SellPage";
import BottomNav from "./components/BottomNav";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white perspective-1000">
        <div className="transform-preserve-3d">
          <Routes>
            <Route path="/" element={
              <div className="transition-transform duration-500 animate-in fade-in slide-in-from-right-52">
                <Index />
              </div>
            } />
            <Route path="/menswear" element={
              <div className="transition-transform duration-500 animate-in fade-in slide-in-from-right-52">
                <MenswearPage />
              </div>
            } />
            <Route path="/womenswear" element={
              <div className="transition-transform duration-500 animate-in fade-in slide-in-from-right-52">
                <WomenswearPage />
              </div>
            } />
            <Route path="/product/:id" element={
              <div className="transition-transform duration-500 animate-in fade-in slide-in-from-right-52">
                <ProductDetail />
              </div>
            } />
            <Route path="/profile/:username" element={
              <div className="transition-transform duration-500 animate-in fade-in slide-in-from-right-52">
                <Profile />
              </div>
            } />
            <Route path="/profile/edit" element={
              <div className="transition-transform duration-500 animate-in fade-in slide-in-from-right-52">
                <EditProfile />
              </div>
            } />
            <Route path="/messages" element={
              <div className="transition-transform duration-500 animate-in fade-in slide-in-from-right-52">
                <Messages />
              </div>
            } />
            <Route path="/sell" element={
              <div className="transition-transform duration-500 animate-in fade-in slide-in-from-right-52">
                <SellPage />
              </div>
            } />
            <Route path="*" element={
              <div className="transition-transform duration-500 animate-in fade-in slide-in-from-right-52">
                <NotFound />
              </div>
            } />
          </Routes>
        </div>
      </div>
      <BottomNav />
    </Router>
  );
}

export default App;
