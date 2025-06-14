
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop } from "@/contexts/ShopContext";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import LazyImage from "@/components/LazyImage";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, clearCart } = useShop();
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const { toast } = useToast();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!customerEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to proceed with checkout.",
        variant: "destructive"
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingOrder(true);
    
    try {
      // Simulate order processing
      // TODO: Replace with actual payment integration and Supabase order storage
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Order Placed Successfully!",
        description: `Order confirmation will be sent to ${customerEmail}`,
      });

      // Clear cart after successful order
      clearCart();
      setCustomerEmail("");
      
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some project kits to get started!</p>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <LazyImage
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-2">{item.product.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {item.product.description}
                    </p>
                    <div className="text-lg font-bold text-primary">
                      ${item.product.price.toFixed(2)} each
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-lg font-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.product.title} × {item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <hr />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
                
                <Button 
                  onClick={handleCheckout}
                  disabled={isProcessingOrder || !customerEmail}
                  className="w-full"
                >
                  {isProcessingOrder ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </div>
              
              <Link to="/shop">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
