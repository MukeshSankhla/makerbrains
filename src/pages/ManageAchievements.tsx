
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Loader2, Edit, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Helmet } from "react-helmet-async";
import SeoStructuredData from "@/components/SeoStructuredData";

// Type definitions
interface Achievement {
  id?: number;
  year: number;
  title: string;
  link: string;
  icon: string;
}

interface Recognition {
  id?: number;
  year: number;
  title: string;
  link: string;
}

interface Sponsor {
  id?: number;
  name: string;
  image_url: string;
  website_url: string;
}

interface Magazine {
  id?: number;
  title: string;
  image_url: string;
  website_url: string;
}

const iconOptions = [
  { value: "trophy", label: "Trophy", component: <div className="text-yellow-500 text-xl">🏆</div> },
  { value: "medal", label: "Medal", component: <div className="text-green-500 text-xl">🥇</div> },
  { value: "star", label: "Star", component: <div className="text-blue-500 text-xl">⭐</div> },
  { value: "award", label: "Award", component: <div className="text-purple-500 text-xl">🏅</div> }
];

const ManageAchievements = () => {
  const { toast } = useToast();
  
  // Tab state
  const [activeTab, setActiveTab] = useState("achievements");
  
  // Lists state
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit mode
  const [editMode, setEditMode] = useState({
    achievements: false,
    recognitions: false,
    sponsors: false,
    magazines: false
  });
  const [currentItem, setCurrentItem] = useState<any>(null);
  
  // Achievement form state
  const [achievementTitle, setAchievementTitle] = useState("");
  const [achievementYear, setAchievementYear] = useState<number>(new Date().getFullYear());
  const [achievementLink, setAchievementLink] = useState("");
  const [achievementIcon, setAchievementIcon] = useState("trophy");
  const [isSubmittingAchievement, setIsSubmittingAchievement] = useState(false);
  
  // Recognition form state
  const [recognitionTitle, setRecognitionTitle] = useState("");
  const [recognitionYear, setRecognitionYear] = useState<number>(new Date().getFullYear());
  const [recognitionLink, setRecognitionLink] = useState("");
  const [isSubmittingRecognition, setIsSubmittingRecognition] = useState(false);
  
  // Sponsor form state
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorImageUrl, setSponsorImageUrl] = useState("");
  const [sponsorWebsiteUrl, setSponsorWebsiteUrl] = useState("");
  const [isUploadingSponsor, setIsUploadingSponsor] = useState(false);
  const [isSubmittingSponsor, setIsSubmittingSponsor] = useState(false);
  const sponsorFileInputRef = useRef<HTMLInputElement>(null);
  
  // Magazine form state
  const [magazineTitle, setMagazineTitle] = useState("");
  const [magazineImageUrl, setMagazineImageUrl] = useState("");
  const [magazineWebsiteUrl, setMagazineWebsiteUrl] = useState("");
  const [isUploadingMagazine, setIsUploadingMagazine] = useState(false);
  const [isSubmittingMagazine, setIsSubmittingMagazine] = useState(false);
  const magazineFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch achievements
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .order('year', { ascending: false });
        
        if (achievementsError) throw achievementsError;
        setAchievements(achievementsData || []);
        
        // Fetch recognitions
        const { data: recognitionsData, error: recognitionsError } = await supabase
          .from('recognitions')
          .select('*')
          .order('year', { ascending: false });
        
        if (recognitionsError) throw recognitionsError;
        setRecognitions(recognitionsData || []);
        
        // Fetch sponsors
        const { data: sponsorsData, error: sponsorsError } = await supabase
          .from('sponsors')
          .select('*');
        
        if (sponsorsError) throw sponsorsError;
        setSponsors(sponsorsData || []);
        
        // Fetch magazines
        const { data: magazinesData, error: magazinesError } = await supabase
          .from('magazines')
          .select('*');
        
        if (magazinesError) throw magazinesError;
        setMagazines(magazinesData || []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Reset form functions
  const resetAchievementForm = () => {
    setAchievementTitle("");
    setAchievementYear(new Date().getFullYear());
    setAchievementLink("");
    setAchievementIcon("trophy");
    setEditMode({ ...editMode, achievements: false });
    setCurrentItem(null);
  };
  
  const resetRecognitionForm = () => {
    setRecognitionTitle("");
    setRecognitionYear(new Date().getFullYear());
    setRecognitionLink("");
    setEditMode({ ...editMode, recognitions: false });
    setCurrentItem(null);
  };
  
  const resetSponsorForm = () => {
    setSponsorName("");
    setSponsorImageUrl("");
    setSponsorWebsiteUrl("");
    setEditMode({ ...editMode, sponsors: false });
    setCurrentItem(null);
  };
  
  const resetMagazineForm = () => {
    setMagazineTitle("");
    setMagazineImageUrl("");
    setMagazineWebsiteUrl("");
    setEditMode({ ...editMode, magazines: false });
    setCurrentItem(null);
  };

  // Edit item handlers
  const handleEditAchievement = (achievement: Achievement) => {
    setAchievementTitle(achievement.title);
    setAchievementYear(achievement.year);
    setAchievementLink(achievement.link);
    setAchievementIcon(achievement.icon);
    setEditMode({ ...editMode, achievements: true });
    setCurrentItem(achievement);
  };
  
  const handleEditRecognition = (recognition: Recognition) => {
    setRecognitionTitle(recognition.title);
    setRecognitionYear(recognition.year);
    setRecognitionLink(recognition.link);
    setEditMode({ ...editMode, recognitions: true });
    setCurrentItem(recognition);
  };
  
  const handleEditSponsor = (sponsor: Sponsor) => {
    setSponsorName(sponsor.name);
    setSponsorImageUrl(sponsor.image_url);
    setSponsorWebsiteUrl(sponsor.website_url);
    setEditMode({ ...editMode, sponsors: true });
    setCurrentItem(sponsor);
  };
  
  const handleEditMagazine = (magazine: Magazine) => {
    setMagazineTitle(magazine.title);
    setMagazineImageUrl(magazine.image_url);
    setMagazineWebsiteUrl(magazine.website_url);
    setEditMode({ ...editMode, magazines: true });
    setCurrentItem(magazine);
  };

  // Delete handlers
  const handleDeleteAchievement = async (id: number) => {
    if (!confirm("Are you sure you want to delete this achievement? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setAchievements(achievements.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Achievement deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting achievement:', error);
      toast({
        title: "Error",
        description: "Failed to delete achievement",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteRecognition = async (id: number) => {
    if (!confirm("Are you sure you want to delete this recognition? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('recognitions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setRecognitions(recognitions.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Recognition deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting recognition:', error);
      toast({
        title: "Error",
        description: "Failed to delete recognition",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteSponsor = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sponsor? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSponsors(sponsors.filter(item => item.id !== id));
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
  
  const handleDeleteMagazine = async (id: number) => {
    if (!confirm("Are you sure you want to delete this magazine? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('magazines')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMagazines(magazines.filter(item => item.id !== id));
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

  // Save achievement
  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!achievementTitle || !achievementLink) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmittingAchievement(true);
    
    try {
      const newAchievement: Achievement = {
        year: achievementYear,
        title: achievementTitle,
        link: achievementLink,
        icon: achievementIcon
      };
      
      if (editMode.achievements && currentItem) {
        // Update
        const { error } = await supabase
          .from('achievements')
          .update(newAchievement)
          .eq('id', currentItem.id);
        
        if (error) throw error;
        
        // Update local state
        setAchievements(achievements.map(item => item.id === currentItem.id ? { ...newAchievement, id: currentItem.id } : item));
        
        toast({
          title: "Success!",
          description: "Achievement has been updated",
        });
      } else {
        // Insert
        const { data, error } = await supabase
          .from('achievements')
          .insert([newAchievement])
          .select();
        
        if (error) throw error;
        
        // Update local state
        if (data && data.length > 0) {
          setAchievements([...achievements, data[0]]);
        }
        
        toast({
          title: "Success!",
          description: "Achievement has been added",
        });
      }
      
      // Reset form
      resetAchievementForm();
    } catch (error) {
      console.error('Error saving achievement:', error);
      toast({
        title: "Error",
        description: "Failed to save achievement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingAchievement(false);
    }
  };
  
  // Save recognition
  const handleRecognitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recognitionTitle || !recognitionLink) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmittingRecognition(true);
    
    try {
      const newRecognition: Recognition = {
        year: recognitionYear,
        title: recognitionTitle,
        link: recognitionLink,
      };
      
      if (editMode.recognitions && currentItem) {
        // Update
        const { error } = await supabase
          .from('recognitions')
          .update(newRecognition)
          .eq('id', currentItem.id);
        
        if (error) throw error;
        
        // Update local state
        setRecognitions(recognitions.map(item => item.id === currentItem.id ? { ...newRecognition, id: currentItem.id } : item));
        
        toast({
          title: "Success!",
          description: "Recognition has been updated",
        });
      } else {
        // Insert
        const { data, error } = await supabase
          .from('recognitions')
          .insert([newRecognition])
          .select();
        
        if (error) throw error;
        
        // Update local state
        if (data && data.length > 0) {
          setRecognitions([...recognitions, data[0]]);
        }
        
        toast({
          title: "Success!",
          description: "Recognition has been added",
        });
      }
      
      // Reset form
      resetRecognitionForm();
    } catch (error) {
      console.error('Error saving recognition:', error);
      toast({
        title: "Error",
        description: "Failed to save recognition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingRecognition(false);
    }
  };
  
  // Upload image helper function
  const handleImageUpload = async (
    file: File, 
    setImageUrl: (url: string) => void, 
    setIsUploading: (loading: boolean) => void
  ) => {
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      
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
        setImageUrl(data.publicUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload the image. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to FileReader for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle sponsor image upload
  const handleSponsorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, setSponsorImageUrl, setIsUploadingSponsor);
    }
  };

  // Handle magazine image upload
  const handleMagazineImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, setMagazineImageUrl, setIsUploadingMagazine);
    }
  };
  
  // Save sponsor
  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sponsorName || !sponsorImageUrl || !sponsorWebsiteUrl) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmittingSponsor(true);
    
    try {
      const newSponsor: Sponsor = {
        name: sponsorName,
        image_url: sponsorImageUrl,
        website_url: sponsorWebsiteUrl
      };
      
      if (editMode.sponsors && currentItem) {
        // Update
        const { error } = await supabase
          .from('sponsors')
          .update(newSponsor)
          .eq('id', currentItem.id);
        
        if (error) throw error;
        
        // Update local state
        setSponsors(sponsors.map(item => item.id === currentItem.id ? { ...newSponsor, id: currentItem.id } : item));
        
        toast({
          title: "Success!",
          description: "Sponsor has been updated",
        });
      } else {
        // Insert
        const { data, error } = await supabase
          .from('sponsors')
          .insert([newSponsor])
          .select();
        
        if (error) throw error;
        
        // Update local state
        if (data && data.length > 0) {
          setSponsors([...sponsors, data[0]]);
        }
        
        toast({
          title: "Success!",
          description: "Sponsor has been added",
        });
      }
      
      // Reset form
      resetSponsorForm();
    } catch (error) {
      console.error('Error saving sponsor:', error);
      toast({
        title: "Error",
        description: "Failed to save sponsor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingSponsor(false);
    }
  };
  
  // Save magazine
  const handleMagazineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!magazineTitle || !magazineImageUrl || !magazineWebsiteUrl) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmittingMagazine(true);
    
    try {
      const newMagazine: Magazine = {
        title: magazineTitle,
        image_url: magazineImageUrl,
        website_url: magazineWebsiteUrl
      };
      
      if (editMode.magazines && currentItem) {
        // Update
        const { error } = await supabase
          .from('magazines')
          .update(newMagazine)
          .eq('id', currentItem.id);
        
        if (error) throw error;
        
        // Update local state
        setMagazines(magazines.map(item => item.id === currentItem.id ? { ...newMagazine, id: currentItem.id } : item));
        
        toast({
          title: "Success!",
          description: "Magazine has been updated",
        });
      } else {
        // Insert
        const { data, error } = await supabase
          .from('magazines')
          .insert([newMagazine])
          .select();
        
        if (error) throw error;
        
        // Update local state
        if (data && data.length > 0) {
          setMagazines([...magazines, data[0]]);
        }
        
        toast({
          title: "Success!",
          description: "Magazine has been added",
        });
      }
      
      // Reset form
      resetMagazineForm();
    } catch (error) {
      console.error('Error saving magazine:', error);
      toast({
        title: "Error",
        description: "Failed to save magazine. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingMagazine(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
        <title>Manage Content - Maker Brains</title>
        <meta name="description" content="Manage achievements, recognitions, sponsors and magazine features for Maker Brains" />
      </Helmet>
      
      <SeoStructuredData 
        type="BreadcrumbList" 
        data={{
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://makerbrains.com"
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Admin",
              item: "https://makerbrains.com/admin"
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Manage Content",
              item: "https://makerbrains.com/manage-achievements"
            }
          ]
        }}
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Manage Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="achievements" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="recognitions">Recognitions</TabsTrigger>
              <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
              <TabsTrigger value="magazines">Magazine Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="achievements" className="mt-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    {editMode.achievements ? "Edit Achievement" : "Add New Achievement"}
                  </h3>
                  {editMode.achievements && (
                    <Button variant="outline" onClick={resetAchievementForm}>
                      Cancel Edit
                    </Button>
                  )}
                </div>
                
                <form onSubmit={handleAchievementSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="achievementTitle">Achievement Title</Label>
                    <Input
                      id="achievementTitle"
                      value={achievementTitle}
                      onChange={(e) => setAchievementTitle(e.target.value)}
                      placeholder="Enter achievement title"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="achievementYear">Year</Label>
                      <Input
                        id="achievementYear"
                        type="number"
                        min="1900"
                        max="2100"
                        value={achievementYear}
                        onChange={(e) => setAchievementYear(parseInt(e.target.value))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="achievementIcon">Icon Type</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {iconOptions.map((icon) => (
                          <Button
                            key={icon.value}
                            type="button"
                            variant={achievementIcon === icon.value ? "default" : "outline"}
                            className="flex flex-col items-center gap-1 h-auto py-2"
                            onClick={() => setAchievementIcon(icon.value)}
                          >
                            {icon.component}
                            <span className="text-xs">{icon.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="achievementLink">Link</Label>
                    <div className="flex gap-2">
                      <Input
                        id="achievementLink"
                        value={achievementLink}
                        onChange={(e) => setAchievementLink(e.target.value)}
                        placeholder="https://"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmittingAchievement}
                  >
                    {isSubmittingAchievement ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editMode.achievements ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      editMode.achievements ? "Update Achievement" : "Add Achievement"
                    )}
                  </Button>
                </form>
              </div>
              
              {/* List of achievements */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Existing Achievements</h3>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                          <div className="flex justify-end">
                            <div className="h-8 bg-muted rounded w-16 mr-2"></div>
                            <div className="h-8 bg-muted rounded w-16"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : achievements.length === 0 ? (
                  <Alert>
                    <AlertDescription>No achievements added yet. Use the form above to add a new achievement.</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{achievement.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{achievement.year}</span>
                                <span>•</span>
                                <a 
                                  href={achievement.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  View
                                </a>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditAchievement(achievement)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteAchievement(achievement.id!)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="recognitions" className="mt-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    {editMode.recognitions ? "Edit Recognition" : "Add New Recognition"}
                  </h3>
                  {editMode.recognitions && (
                    <Button variant="outline" onClick={resetRecognitionForm}>
                      Cancel Edit
                    </Button>
                  )}
                </div>
                
                <form onSubmit={handleRecognitionSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="recognitionTitle">Recognition Title</Label>
                    <Input
                      id="recognitionTitle"
                      value={recognitionTitle}
                      onChange={(e) => setRecognitionTitle(e.target.value)}
                      placeholder="Enter recognition title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recognitionYear">Year</Label>
                    <Input
                      id="recognitionYear"
                      type="number"
                      min="1900" 
                      max="2100"
                      value={recognitionYear}
                      onChange={(e) => setRecognitionYear(parseInt(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recognitionLink">Link</Label>
                    <div className="flex gap-2">
                      <Input
                        id="recognitionLink"
                        value={recognitionLink}
                        onChange={(e) => setRecognitionLink(e.target.value)}
                        placeholder="https://"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={isSubmittingRecognition}
                  >
                    {isSubmittingRecognition ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editMode.recognitions ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      editMode.recognitions ? "Update Recognition" : "Add Recognition"
                    )}
                  </Button>
                </form>
              </div>
              
              {/* List of recognitions */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Existing Recognitions</h3>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                          <div className="flex justify-end">
                            <div className="h-8 bg-muted rounded w-16 mr-2"></div>
                            <div className="h-8 bg-muted rounded w-16"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : recognitions.length === 0 ? (
                  <Alert>
                    <AlertDescription>No recognitions added yet. Use the form above to add a new recognition.</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {recognitions.map((recognition) => (
                      <Card key={recognition.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{recognition.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{recognition.year}</span>
                                <span>•</span>
                                <a 
                                  href={recognition.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  View
                                </a>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditRecognition(recognition)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteRecognition(recognition.id!)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="sponsors" className="mt-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    {editMode.sponsors ? "Edit Sponsor" : "Add New Sponsor"}
                  </h3>
                  {editMode.sponsors && (
                    <Button variant="outline" onClick={resetSponsorForm}>
                      Cancel Edit
                    </Button>
                  )}
                </div>
                
                <form onSubmit={handleSponsorSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="sponsorName">Sponsor Name</Label>
                    <Input
                      id="sponsorName"
                      value={sponsorName}
                      onChange={(e) => setSponsorName(e.target.value)}
                      placeholder="Enter sponsor name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sponsorImageUrl">Sponsor Logo</Label>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Input
                          id="sponsorImageUrl"
                          value={sponsorImageUrl}
                          onChange={(e) => setSponsorImageUrl(e.target.value)}
                          placeholder="Image URL (or upload below)"
                        />
                        <input
                          type="file"
                          ref={sponsorFileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleSponsorImageUpload}
                        />
                        <Button 
                          type="button"
                          variant="secondary"
                          onClick={() => sponsorFileInputRef.current?.click()}
                          disabled={isUploadingSponsor}
                        >
                          {isUploadingSponsor ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {sponsorImageUrl && (
                        <div className="mt-2">
                          <img 
                            src={sponsorImageUrl} 
                            alt="Sponsor Logo Preview" 
                            className="h-20 object-contain rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sponsorWebsiteUrl">Website URL</Label>
                    <Input
                      id="sponsorWebsiteUrl"
                      value={sponsorWebsiteUrl}
                      onChange={(e) => setSponsorWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={isSubmittingSponsor}
                  >
                    {isSubmittingSponsor ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editMode.sponsors ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      editMode.sponsors ? "Update Sponsor" : "Add Sponsor"
                    )}
                  </Button>
                </form>
              </div>
              
              {/* List of sponsors */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Existing Sponsors</h3>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="h-24 bg-muted rounded mb-2"></div>
                          <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                          <div className="flex justify-end">
                            <div className="h-8 bg-muted rounded w-16 mr-2"></div>
                            <div className="h-8 bg-muted rounded w-16"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : sponsors.length === 0 ? (
                  <Alert>
                    <AlertDescription>No sponsors added yet. Use the form above to add a new sponsor.</AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sponsors.map((sponsor) => (
                      <Card key={sponsor.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center mb-4">
                            <div className="h-16 mb-2 flex items-center justify-center">
                              <img 
                                src={sponsor.image_url} 
                                alt={sponsor.name}
                                className="max-h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                                }}
                              />
                            </div>
                            <h4 className="font-medium text-center">{sponsor.name}</h4>
                            <a 
                              href={sponsor.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline text-sm"
                            >
                              Visit Website
                            </a>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditSponsor(sponsor)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteSponsor(sponsor.id!)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="magazines" className="mt-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    {editMode.magazines ? "Edit Magazine" : "Add New Magazine"}
                  </h3>
                  {editMode.magazines && (
                    <Button variant="outline" onClick={resetMagazineForm}>
                      Cancel Edit
                    </Button>
                  )}
                </div>
                
                <form onSubmit={handleMagazineSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="magazineTitle">Magazine Title</Label>
                    <Input
                      id="magazineTitle"
                      value={magazineTitle}
                      onChange={(e) => setMagazineTitle(e.target.value)}
                      placeholder="Enter magazine title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="magazineImageUrl">Magazine Cover</Label>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Input
                          id="magazineImageUrl"
                          value={magazineImageUrl}
                          onChange={(e) => setMagazineImageUrl(e.target.value)}
                          placeholder="Image URL (or upload below)"
                        />
                        <input
                          type="file"
                          ref={magazineFileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleMagazineImageUpload}
                        />
                        <Button 
                          type="button"
                          variant="secondary"
                          onClick={() => magazineFileInputRef.current?.click()}
                          disabled={isUploadingMagazine}
                        >
                          {isUploadingMagazine ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {magazineImageUrl && (
                        <div className="mt-2">
                          <img 
                            src={magazineImageUrl} 
                            alt="Magazine Cover Preview" 
                            className="h-36 object-contain rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="magazineWebsiteUrl">Website URL</Label>
                    <Input
                      id="magazineWebsiteUrl"
                      value={magazineWebsiteUrl}
                      onChange={(e) => setMagazineWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={isSubmittingMagazine}
                  >
                    {isSubmittingMagazine ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editMode.magazines ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      editMode.magazines ? "Update Magazine" : "Add Magazine"
                    )}
                  </Button>
                </form>
              </div>
              
              {/* List of magazines */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Existing Magazines</h3>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="h-24 bg-muted rounded mb-2"></div>
                          <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                          <div className="flex justify-end">
                            <div className="h-8 bg-muted rounded w-16 mr-2"></div>
                            <div className="h-8 bg-muted rounded w-16"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : magazines.length === 0 ? (
                  <Alert>
                    <AlertDescription>No magazines added yet. Use the form above to add a new magazine.</AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {magazines.map((magazine) => (
                      <Card key={magazine.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center mb-4">
                            <div className="h-28 mb-2 flex items-center justify-center">
                              <img 
                                src={magazine.image_url} 
                                alt={magazine.title}
                                className="max-h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                                }}
                              />
                            </div>
                            <h4 className="font-medium text-center">{magazine.title}</h4>
                            <a 
                              href={magazine.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline text-sm"
                            >
                              View Magazine
                            </a>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditMagazine(magazine)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteMagazine(magazine.id!)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageAchievements;
