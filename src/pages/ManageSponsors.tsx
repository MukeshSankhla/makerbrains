
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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

interface Sponsor {
  id: number;
  name: string;
  website_url: string;
  image_url: string;
}

const ManageSponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newSponsor, setNewSponsor] = useState<Omit<Sponsor, 'id'>>({
    name: "",
    website_url: "",
    image_url: "",
  });
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/maker-admin-access");
    }
  }, [isAdmin, navigate]);

  // Fetch sponsors
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const { data, error } = await supabase
          .from('sponsors')
          .select('*');

        if (error) throw error;
        setSponsors(data || []);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
        toast({
          title: "Error",
          description: "Failed to load sponsors",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSponsors();
  }, [toast]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `sponsor-logos/${fileName}`;
      
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
        if (isEdit && editingSponsor) {
          setEditingSponsor({...editingSponsor, image_url: data.publicUrl});
        } else {
          setNewSponsor({...newSponsor, image_url: data.publicUrl});
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
    if (!newSponsor.name || !newSponsor.website_url || !newSponsor.image_url) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .insert([newSponsor])
        .select();

      if (error) throw error;

      setSponsors([...(data || []), ...sponsors]);
      setNewSponsor({
        name: "",
        website_url: "",
        image_url: "",
      });
      toast({
        title: "Success",
        description: "Sponsor created successfully",
      });
    } catch (error) {
      console.error('Error creating sponsor:', error);
      toast({
        title: "Error",
        description: "Failed to create sponsor",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingSponsor) return;

    try {
      const { error } = await supabase
        .from('sponsors')
        .update({
          name: editingSponsor.name,
          website_url: editingSponsor.website_url,
          image_url: editingSponsor.image_url,
        })
        .eq('id', editingSponsor.id);

      if (error) throw error;

      setSponsors(sponsors.map(spons => 
        spons.id === editingSponsor.id ? editingSponsor : spons
      ));
      setEditingSponsor(null);
      toast({
        title: "Success",
        description: "Sponsor updated successfully",
      });
    } catch (error) {
      console.error('Error updating sponsor:', error);
      toast({
        title: "Error",
        description: "Failed to update sponsor",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sponsor? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSponsors(sponsors.filter(spons => spons.id !== id));
      toast({
        title: "Success",
        description: "Sponsor deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      toast({
        title: "Error",
        description: "Failed to delete sponsor",
        variant: "destructive",
      });
    }
  };

  const filteredSponsors = sponsors.filter(spons => 
    spons.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) return null;

  return (
    <>
      <Helmet>
        <title>Manage Sponsors - Maker Brains</title>
        <meta name="description" content="Manage sponsors for Maker Brains" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Manage Sponsors</h1>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sponsors..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Sponsor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Sponsor</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newSponsor.name}
                      onChange={(e) => setNewSponsor({...newSponsor, name: e.target.value})}
                      placeholder="Sponsor name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      value={newSponsor.website_url}
                      onChange={(e) => setNewSponsor({...newSponsor, website_url: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Logo</Label>
                    <div className="flex gap-2">
                      <Input
                        id="image_url"
                        value={newSponsor.image_url}
                        onChange={(e) => setNewSponsor({...newSponsor, image_url: e.target.value})}
                        placeholder="Logo URL"
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
                    {newSponsor.image_url && (
                      <div className="mt-2">
                        <img 
                          src={newSponsor.image_url} 
                          alt="Preview" 
                          className="h-20 object-contain rounded-md" 
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
                    disabled={!newSponsor.name || !newSponsor.website_url || !newSponsor.image_url}
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="flex flex-col">
                <div className="p-4 flex-grow flex justify-center items-center">
                  <Skeleton className="h-20 w-full" />
                </div>
                <CardContent className="p-4 flex justify-between items-center">
                  <Skeleton className="h-5 w-20" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSponsors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sponsors found. Try a different search term or create a new one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredSponsors.map((sponsor) => (
              <Card key={sponsor.id} className="flex flex-col">
                <div className="p-4 flex-grow flex justify-center items-center">
                  <img 
                    src={sponsor.image_url} 
                    alt={sponsor.name}
                    className="h-16 object-contain" 
                  />
                </div>
                <CardContent className="p-4 border-t flex justify-between items-center">
                  <h3 className="text-sm font-medium truncate">{sponsor.name}</h3>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingSponsor(sponsor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Sponsor</DialogTitle>
                        </DialogHeader>
                        {editingSponsor && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Name</Label>
                              <Input
                                id="edit-name"
                                value={editingSponsor.name}
                                onChange={(e) => setEditingSponsor({
                                  ...editingSponsor, 
                                  name: e.target.value
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-website_url">Website URL</Label>
                              <Input
                                id="edit-website_url"
                                value={editingSponsor.website_url}
                                onChange={(e) => setEditingSponsor({
                                  ...editingSponsor, 
                                  website_url: e.target.value
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-image_url">Logo</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="edit-image_url"
                                  value={editingSponsor.image_url}
                                  onChange={(e) => setEditingSponsor({
                                    ...editingSponsor, 
                                    image_url: e.target.value
                                  })}
                                />
                                <Button 
                                  type="button"
                                  variant="secondary"
                                  onClick={() => {
                                    if (editFileInputRef.current) {
                                      editFileInputRef.current.click();
                                    }
                                  }}
                                  disabled={isUploading}
                                >
                                  {isUploading ? "Uploading..." : (
                                    <>
                                      <Upload className="h-4 w-4" />
                                    </>
                                  )}
                                </Button>
                                <input
                                  type="file"
                                  ref={editFileInputRef}
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, true)}
                                />
                              </div>
                              {editingSponsor.image_url && (
                                <div className="mt-2">
                                  <img 
                                    src={editingSponsor.image_url} 
                                    alt="Preview" 
                                    className="h-20 object-contain rounded-md" 
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
                      className="h-8 w-8"
                      onClick={() => handleDelete(sponsor.id)}
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

export default ManageSponsors;
