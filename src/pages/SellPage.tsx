
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Camera, Upload } from "lucide-react";
import { Item } from "@/types/database";

const SellPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("menswear");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!title || !description || !price || !category) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!imageFile) {
      toast({
        title: "Missing image",
        description: "Please upload at least one image of your item",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Get current user (for demonstration using profile from Supabase)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to list an item for sale",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Upload image
      const timestamp = new Date().getTime();
      const filePath = `${user.id}/${timestamp}_${imageFile.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get image URL
      const { data: urlData } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);

      // Insert item into database
      const numericPrice = parseFloat(price);
      const { data: itemData, error: itemError } = await supabase
        .from('items')
        .insert([
          { 
            title,
            description,
            price: numericPrice,
            category,
            user_id: user.id,
            image_url: urlData.publicUrl
          }
        ])
        .select()
        .single();

      if (itemError) {
        throw new Error(itemError.message);
      }

      toast({
        title: "Item listed!",
        description: "Your item has been successfully listed for sale",
      });

      // Navigate to the product page
      setTimeout(() => {
        if (itemData) {
          navigate(`/product/${itemData.id}`);
        } else {
          navigate('/');
        }
      }, 1500);
      
    } catch (error) {
      console.error("Error listing item:", error);
      toast({
        title: "Error listing item",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Sell Your Item</h1>
          
          <Card className="transform-preserve-3d transition-all duration-300 hover:shadow-xl">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>
                  Provide information about the item you're selling
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Image upload section */}
                <div className="space-y-2">
                  <Label htmlFor="image">Item Image</Label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-depop-red transition-colors"
                    onClick={() => document.getElementById('image')?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative w-full">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-64 object-contain rounded-lg"
                        />
                        <Button 
                          type="button"
                          size="sm"
                          className="absolute bottom-2 right-2 bg-white text-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                        >
                          Change Photo
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-500 mb-1">Click to upload an image</p>
                        <p className="text-xs text-gray-400">PNG, JPG, or WEBP</p>
                      </>
                    )}
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Vintage Denim Jacket"
                    className="transform-preserve-3d transition-all duration-300 focus:scale-[1.01]"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your item, including condition, size, brand, etc."
                    className="min-h-32 transform-preserve-3d transition-all duration-300 focus:scale-[1.01]"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transform-preserve-3d transition-all duration-300 focus:scale-[1.01]"
                  >
                    <option value="menswear">Menswear</option>
                    <option value="womenswear">Womenswear</option>
                    <option value="accessories">Accessories</option>
                    <option value="shoes">Shoes</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="pl-8 transform-preserve-3d transition-all duration-300 focus:scale-[1.01]"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="transform-preserve-3d transition-all duration-300 hover:scale-105"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="transform-preserve-3d transition-all duration-300 hover:scale-105"
                >
                  {isSubmitting ? "Listing..." : "List Item for Sale"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SellPage;
