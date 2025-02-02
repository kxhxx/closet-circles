import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag } from "lucide-react";

const Cart = () => {
  // This is a placeholder for cart items, you can implement the actual cart logic later
  const cartItems: any[] = [];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-5 w-5" />
          <span className="font-medium">Shopping Cart</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {cartItems.length} items
        </span>
      </div>
      
      {cartItems.length > 0 ? (
        <ScrollArea className="flex-1 px-4">
          {/* Cart items will be rendered here */}
          <div className="space-y-4 py-4">
            {cartItems.map((item) => (
              <div key={item.id}>Item</div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center space-y-2">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          <span className="text-lg font-medium">Your cart is empty</span>
          <span className="text-sm text-muted-foreground">
            Add items to your cart to see them here
          </span>
        </div>
      )}
      
      {cartItems.length > 0 && (
        <div className="border-t p-4">
          <Button className="w-full">
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;