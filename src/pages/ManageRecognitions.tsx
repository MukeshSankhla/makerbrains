
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Trash2, PlusCircle, Search } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Helmet } from "react-helmet-async";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Recognition {
  id: number;
  title: string;
  year: number;
  month: number;
  day: number;
  link: string;
}

const ManageRecognitions = () => {
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAdminAuth();
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
  const currentDay = new Date().getDate();
  
  const [newRecognition, setNewRecognition] = useState<Omit<Recognition, 'id'>>({
    title: "",
    year: currentYear,
    month: currentMonth,
    day: currentDay,
    link: "",
  });
  const [editingRecognition, setEditingRecognition] = useState<Recognition | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/maker-admin-access");
    }
  }, [isAdmin, navigate]);

  // Fetch recognitions
  useEffect(() => {
    const fetchRecognitions = async () => {
      try {
        const { data, error } = await supabase
          .from('recognitions')
          .select('*')
          .order('year', { ascending: false });

        if (error) throw error;
        
        // Handle potential missing month/day fields for existing records
        const processedData = (data || []).map(item => ({
          ...item,
          month: item.month || 1,
          day: item.day || 1
        }));
        
        setRecognitions(processedData);
      } catch (error) {
        console.error('Error fetching recognitions:', error);
        toast({
          title: "Error",
          description: "Failed to load recognitions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecognitions();
  }, [toast]);

  const handleCreate = async () => {
    try {
      const { data, error } = await supabase
        .from('recognitions')
        .insert([newRecognition])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setRecognitions([...data, ...recognitions]);
      }
      
      setNewRecognition({
        title: "",
        year: currentYear,
        month: currentMonth,
        day: currentDay,
        link: "",
      });
      
      toast({
        title: "Success",
        description: "Recognition created successfully",
      });
    } catch (error) {
      console.error('Error creating recognition:', error);
      toast({
        title: "Error",
        description: "Failed to create recognition",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingRecognition) return;

    try {
      const { error } = await supabase
        .from('recognitions')
        .update({
          title: editingRecognition.title,
          year: editingRecognition.year,
          month: editingRecognition.month,
          day: editingRecognition.day,
          link: editingRecognition.link,
        })
        .eq('id', editingRecognition.id);

      if (error) throw error;

      setRecognitions(recognitions.map(rec => 
        rec.id === editingRecognition.id ? editingRecognition : rec
      ));
      setEditingRecognition(null);
      toast({
        title: "Success",
        description: "Recognition updated successfully",
      });
    } catch (error) {
      console.error('Error updating recognition:', error);
      toast({
        title: "Error",
        description: "Failed to update recognition",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this recognition? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('recognitions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRecognitions(recognitions.filter(rec => rec.id !== id));
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

  // Generate arrays for month and day dropdown options
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const generateDays = (year: number, month: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const getMonthName = (monthNum: number) => {
    const date = new Date();
    date.setMonth(monthNum - 1);
    return date.toLocaleString('default', { month: 'long' });
  };
  
  const formatDate = (year: number, month: number, day: number) => {
    return `${getMonthName(month)} ${day}, ${year}`;
  };

  const filteredRecognitions = recognitions.filter(rec => 
    rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.year.toString().includes(searchTerm)
  );

  if (!isAdmin) return null;

  return (
    <>
      <Helmet>
        <title>Manage Recognitions - Maker Brains</title>
        <meta name="description" content="Manage recognitions for Maker Brains" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Manage Recognitions</h1>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recognitions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Recognition
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Recognition</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newRecognition.title}
                      onChange={(e) => setNewRecognition({...newRecognition, title: e.target.value})}
                      placeholder="Recognition title"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={newRecognition.year}
                        onChange={(e) => setNewRecognition({...newRecognition, year: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="month">Month</Label>
                      <Select
                        value={newRecognition.month.toString()}
                        onValueChange={(value) => setNewRecognition({...newRecognition, month: parseInt(value)})}
                      >
                        <SelectTrigger id="month">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {months.map((month) => (
                              <SelectItem key={month} value={month.toString()}>
                                {getMonthName(month)}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="day">Day</Label>
                      <Select
                        value={newRecognition.day.toString()}
                        onValueChange={(value) => setNewRecognition({...newRecognition, day: parseInt(value)})}
                      >
                        <SelectTrigger id="day">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {generateDays(newRecognition.year, newRecognition.month).map((day) => (
                              <SelectItem key={day} value={day.toString()}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link">Link</Label>
                    <Input
                      id="link"
                      value={newRecognition.link}
                      onChange={(e) => setNewRecognition({...newRecognition, link: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleCreate} disabled={!newRecognition.title}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-2 flex-grow">
                    <Skeleton className="h-5 w-full max-w-[300px]" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRecognitions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No recognitions found. Try a different search term or create a new one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecognitions.map((recognition) => (
              <Card key={recognition.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-medium">{recognition.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(recognition.year, recognition.month, recognition.day)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setEditingRecognition(recognition)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Recognition</DialogTitle>
                        </DialogHeader>
                        {editingRecognition && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-title">Title</Label>
                              <Input
                                id="edit-title"
                                value={editingRecognition.title}
                                onChange={(e) => setEditingRecognition({
                                  ...editingRecognition, 
                                  title: e.target.value
                                })}
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-year">Year</Label>
                                <Input
                                  id="edit-year"
                                  type="number"
                                  value={editingRecognition.year}
                                  onChange={(e) => setEditingRecognition({
                                    ...editingRecognition, 
                                    year: parseInt(e.target.value)
                                  })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-month">Month</Label>
                                <Select
                                  value={editingRecognition.month.toString()}
                                  onValueChange={(value) => setEditingRecognition({
                                    ...editingRecognition, 
                                    month: parseInt(value)
                                  })}
                                >
                                  <SelectTrigger id="edit-month">
                                    <SelectValue placeholder="Month" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {months.map((month) => (
                                        <SelectItem key={month} value={month.toString()}>
                                          {getMonthName(month)}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-day">Day</Label>
                                <Select
                                  value={editingRecognition.day.toString()}
                                  onValueChange={(value) => setEditingRecognition({
                                    ...editingRecognition, 
                                    day: parseInt(value)
                                  })}
                                >
                                  <SelectTrigger id="edit-day">
                                    <SelectValue placeholder="Day" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {generateDays(
                                        editingRecognition.year,
                                        editingRecognition.month
                                      ).map((day) => (
                                        <SelectItem key={day} value={day.toString()}>
                                          {day}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-link">Link</Label>
                              <Input
                                id="edit-link"
                                value={editingRecognition.link}
                                onChange={(e) => setEditingRecognition({
                                  ...editingRecognition, 
                                  link: e.target.value
                                })}
                              />
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
                      onClick={() => handleDelete(recognition.id)}
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

export default ManageRecognitions;
