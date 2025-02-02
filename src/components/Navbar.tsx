import { Menu, Search, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { SignUpDialog } from "./auth/SignUpDialog";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Cart from "@/pages/Cart";

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
          <a href="/" className="text-depop-red font-bold text-2xl">
            repop
          </a>
        </div>
        
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search User"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-depop-red"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg p-0">
              <Cart />
            </SheetContent>
          </Sheet>
          <SignUpDialog />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;