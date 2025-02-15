
import { Menu, Search, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { SignUpDialog } from "./auth/SignUpDialog";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Cart from "@/pages/Cart";
import { useState } from "react";
import { SidebarProvider } from "./ui/sidebar";
import NavigationPanel from "./NavigationPanel";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <nav className="border-b transform-preserve-3d transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between transform-preserve-3d">
        <div className="flex items-center gap-4 transition-transform duration-300 hover:scale-105">
          <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="transition-transform hover:scale-110">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 transform-preserve-3d transition-transform duration-300">
              <SidebarProvider defaultOpen>
                <NavigationPanel />
              </SidebarProvider>
            </SheetContent>
          </Sheet>
          <Link to="/" className="text-depop-red font-bold text-2xl transition-transform hover:scale-105">
            repop
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4 transform-preserve-3d">
          <div className="relative w-full transition-transform duration-300 hover:scale-105">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search User"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-depop-red transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 transform-preserve-3d">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="transition-transform hover:scale-110">
                <ShoppingBag className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg p-0 transform-preserve-3d transition-transform duration-300">
              <Cart />
            </SheetContent>
          </Sheet>
          <Button 
            variant="outline" 
            className="border-2 border-black hover:bg-gray-100 transition-transform hover:scale-105"
          >
            Sell now
          </Button>
          <SignUpDialog initialMode="login" />
          <SignUpDialog initialMode="signup" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
