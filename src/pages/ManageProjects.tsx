
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
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SeoStructuredData from "@/components/SeoStructuredData";

const ManageProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAdminAuth();

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/maker-admin-access");
    }
  }, [isAdmin, navigate]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(projects.filter(project => project.id !== id));
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) return null;

  return (
    <>
      <Helmet>
        <title>Manage Projects - Maker Brains</title>
        <meta name="description" content="Manage projects for Maker Brains" />
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
              name: "Manage Projects",
              item: "https://makerbrains.com/manage-projects"
            }
          ]
        }}
      />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Manage Projects</h1>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link to="/create">
              <Button className="whitespace-nowrap">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex justify-end space-x-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found. Try a different search term or create a new project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <div className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{project.description}</p>
                    <p className="text-xs text-muted-foreground">
                      By {project.author} on {project.date}
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(project.id)}
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
    </>
  );
};

export default ManageProjects;
