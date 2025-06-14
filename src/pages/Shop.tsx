
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useShop } from "@/contexts/ShopContext";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import LazyImage from "@/components/LazyImage";
import { Link } from "react-router-dom";

const Shop = () => {
  const { products, addToCart, cart, updateCartQuantity } = useShop();
  const [quantities, setQuantities] = useState<{[key: number]: number}>({});

  const getCartQuantity = (productId: number) => {
    const cartItem = cart.find(item => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    setQuantities(prev => ({ ...prev, [productId]: Math.max(1, newQuantity) }));
  };

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Shop - Maker Brains Project Kits</title>
        <meta name="description" content="Buy project kits and components from Maker Brains. High-quality electronics kits for DIY enthusiasts." />
      </Helmet>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Project Kits Shop</h1>
        <Link to="/cart">
          <Button variant="outline" className="relative">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            )}
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">No products available</h2>
          <p className="text-muted-foreground mt-2">Check back soon for new project kits!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col h-full">
              <div className="aspect-video relative">
                <LazyImage
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
              
              <CardHeader>
                <CardTitle className="line-clamp-2">{product.title}</CardTitle>
                <div className="text-2xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {product.description}
                </p>
                
                {product.features && product.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                      {product.features.length > 3 && (
                        <li className="text-xs">...and {product.features.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                  {getCartQuantity(product.id) > 0 && (
                    <span className="text-primary font-medium">
                      {getCartQuantity(product.id)} in cart
                    </span>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-3 w-full">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(product.id, (quantities[product.id] || 1) - 1)}
                    disabled={product.stock === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium min-w-[2rem] text-center">
                    {quantities[product.id] || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(product.id, (quantities[product.id] || 1) + 1)}
                    disabled={product.stock === 0}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
