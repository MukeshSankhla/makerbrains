
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useProjects } from "@/pages/ProjectContext";

const CreateProject = () => {
  const { addProject } = useProjects();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !description || !image || !author) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      await addProject({
        title,
        description,
        content,
        image,
        url,
        author,
      });
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
      navigate("/admin");
    } catch (err) {
      toast({
        title: "Error",
        description: "There was a problem creating the project.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Project - MakerBrains</title>
      </Helmet>
      <div className="my-12 flex flex-col items-center justify-center">
        <Card className="w-full max-w-xl shadow-lg border">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Project Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  placeholder="A brief summary of the project"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Details</Label>
                <Textarea
                  id="content"
                  placeholder="Full project details"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  placeholder="Project Author"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL *</Label>
                <Input
                  id="image"
                  placeholder="Direct link to a project image"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="url">Project Link (optional)</Label>
                <Input
                  id="url"
                  placeholder="Link to more project resources"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                * Required fields
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateProject;

