
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Trash2, PlusCircle, Search, Upload } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Helmet } from "react-helmet-async";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Magazine {
  id: number;
  title: string;
  website_url: string;
  image_url: string;
}

const ManageMagazines = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAdminAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newMagazine, setNewMagazine] = useState<Omit<Magazine, 'id'>>({
    title: "",
    website_url: "",
    image_url: "",
  });
  const [editingMagazine, setEditingMagazine] = useState<Magazine | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/maker-admin-access");
    }
  }, [isAdmin, navigate]);

  // Fetch magazines
  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const { data, error } = await supabase
          .from('magazines')
          .select('*');

        if (error) throw error;
        setMagazines(data || []);
      } catch (error) {
        console.error('Error fetching magazines:', error);
        toast({
          title: "Error",
          description: "Failed to load magazines",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMagazines();
  }, [toast]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `magazine-images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('maker-images')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('maker-images')
        .getPublicUrl(filePath);
      
      if (data && data.publicUrl) {
        if (isEdit && editingMagazine) {
          setEditingMagazine({...editingMagazine, image_url: data.publicUrl});
        } else {
          setNewMagazine({...newMagazine, image_url: data.publicUrl});
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!newMagazine.title || !newMagazine.website_url || !newMagazine.image_url) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('magazines')
        .insert([newMagazine])
        .select();

      if (error) throw error;

      setMagazines([...(data || []), ...magazines]);
      setNewMagazine({
        title: "",
        website_url: "",
        image_url: "",
      });
      toast({
        title: "Success",
        description: "Magazine created successfully",
      });
    } catch (error) {
      console.error('Error creating magazine:', error);
      toast({
        title: "Error",
        description: "Failed to create magazine",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingMagazine) return;

    try {
      const { error } = await supabase
        .from('magazines')
        .update({
          title: editingMagazine.title,
          website_url: editingMagazine.website_url,
          image_url: editingMagazine.image_url,
        })
        .eq('id', editingMagazine.id);

      if (error) throw error;

      setMagazines(magazines.map(mag => 
        mag.id === editingMagazine.id ? editingMagazine : mag
      ));
      setEditingMagazine(null);
      toast({
        title: "Success",
        description: "Magazine updated successfully",
      });
    } catch (error) {
      console.error('Error updating magazine:', error);
      toast({
        title: "Error",
        description: "Failed to update magazine",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this magazine? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('magazines')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMagazines(magazines.filter(mag => mag.id !== id));
      toast({
        title: "Success",
        description: "Magazine deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting magazine:', error);
      toast({
        title: "Error",
        description: "Failed to delete magazine",
        variant: "destructive",
      });
    }
  };

  const filteredMagazines = magazines.filter(mag => 
    mag.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) return null;

  return (
    <>
      <Helmet>
        <title>Manage Magazines - Maker Brains</title>
        <meta name="description" content="Manage magazine features for Maker Brains" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Manage Magazines</h1>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search magazines..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Magazine
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Magazine Feature</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newMagazine.title}
                      onChange={(e) => setNewMagazine({...newMagazine, title: e.target.value})}
                      placeholder="Magazine title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      value={newMagazine.website_url}
                      onChange={(e) => setNewMagazine({...newMagazine, website_url: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image</Label>
                    <div className="flex gap-2">
                      <Input
                        id="image_url"
                        value={newMagazine.image_url}
                        onChange={(e) => setNewMagazine({...newMagazine, image_url: e.target.value})}
                        placeholder="Image URL"
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e)}
                      />
                      <Button 
                        type="button"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? "Uploading..." : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                    {newMagazine.image_url && (
                      <div className="mt-2">
                        <img 
                          src={newMagazine.image_url} 
                          alt="Preview" 
                          className="h-40 object-contain rounded-md" 
                        />
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    onClick={handleCreate} 
                    disabled={!newMagazine.title || !newMagazine.website_url || !newMagazine.image_url}
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="flex justify-between items-center p-4">
                  <Skeleton className="h-5 w-40" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredMagazines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No magazines found. Try a different search term or create a new one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMagazines.map((magazine) => (
              <Card key={magazine.id}>
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={magazine.image_url} 
                    alt={magazine.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="flex justify-between items-center p-4">
                  <h3 className="font-medium truncate">{magazine.title}</h3>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setEditingMagazine(magazine)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Magazine</DialogTitle>
                        </DialogHeader>
                        {editingMagazine && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-title">Title</Label>
                              <Input
                                id="edit-title"
                                value={editingMagazine.title}
                                onChange={(e) => setEditingMagazine({
                                  ...editingMagazine, 
                                  title: e.target.value
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-website_url">Website URL</Label>
                              <Input
                                id="edit-website_url"
                                value={editingMagazine.website_url}
                                onChange={(e) => setEditingMagazine({
                                  ...editingMagazine, 
                                  website_url: e.target.value
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-image_url">Image</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="edit-image_url"
                                  value={editingMagazine.image_url}
                                  onChange={(e) => setEditingMagazine({
                                    ...editingMagazine, 
                                    image_url: e.target.value
                                  })}
                                />
                                <Button 
                                  type="button"
                                  variant="secondary"
                                  onClick={() => {
                                    if (fileInputRef.current) {
                                      fileInputRef.current.click();
                                    }
                                  }}
                                  disabled={isUploading}
                                >
                                  {isUploading ? "Uploading..." : (
                                    <>
                                      <Upload className="mr-2 h-4 w-4" />
                                      Upload
                                    </>
                                  )}
                                </Button>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, true)}
                                />
                              </div>
                              {editingMagazine.image_url && (
                                <div className="mt-2">
                                  <img 
                                    src={editingMagazine.image_url} 
                                    alt="Preview" 
                                    className="h-40 object-contain rounded-md" 
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleUpdate}>Update</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDelete(magazine.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ManageMagazines;
