
import React, { useState, useEffect } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, Timestamp } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Plus, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

type HomeContentItem = {
  id: string;
  type: string; // e.g., 'achievement', 'recognition', 'magazine', 'sponsor'
  title: string;
  description: string;
  image?: string;
  link?: string;
  createdAt?: Timestamp;
};

const ManageHomeContent = () => {
  const [contentList, setContentList] = useState<HomeContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<HomeContentItem>>({});
  const { toast } = useToast();
  const { isAdmin } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/maker-admin-access");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "homepage_content"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setContentList(snap.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as HomeContentItem[]);
      } catch (e) {
        toast({ title: "Error", description: "Failed to fetch homepage content.", variant: "destructive" });
      }
      setIsLoading(false);
    };
    fetchContent();
  }, [toast]);

  const handleAdd = () => {
    setForm({ title: "", description: "", type: "achievement", image: "", link: "" });
    setIsAdding(true);
    setIsEditing(null);
  };

  const handleEdit = (item: HomeContentItem) => {
    setForm({ ...item });
    setIsEditing(item.id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
    setForm({});
  };

  const handleChange = (field: keyof HomeContentItem, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.title || !form.type) {
      toast({ title: "Missing Fields", description: "Title and type are required.", variant: "destructive" });
      return;
    }
    try {
      if (isAdding) {
        const ref = await addDoc(collection(db, "homepage_content"), {
          ...form,
          createdAt: Timestamp.now()
        });
        setContentList([{ id: ref.id, ...form, createdAt: Timestamp.now() } as HomeContentItem, ...contentList]);
        toast({ title: "Success", description: "Content added." });
      } else if (isEditing && form.id) {
        await updateDoc(doc(db, "homepage_content", form.id), { ...form });
        setContentList(contentList.map(c => (c.id === form.id ? { ...form } as HomeContentItem : c)));
        toast({ title: "Success", description: "Content updated." });
      }
      handleCancel();
    } catch (e) {
      toast({ title: "Error", description: "Failed to save content.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await deleteDoc(doc(db, "homepage_content", id));
      setContentList(contentList.filter(c => c.id !== id));
      toast({ title: "Success", description: "Content deleted." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete content.", variant: "destructive" });
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="py-8">
      <Helmet>
        <title>Manage Home Content - Maker Brains</title>
      </Helmet>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Home Page Content</h1>
        <Button onClick={handleAdd} disabled={isAdding || !!isEditing}>
          <Plus className="mr-2 h-4 w-4" /> Add New Content
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <Card className="mb-6">
          <CardContent className="space-y-4 py-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Type<span className="text-primary">*</span></label>
                <select
                  className="w-full border outline-none rounded-md py-2 px-3"
                  value={form.type || ""}
                  onChange={e => handleChange("type", e.target.value)}
                >
                  <option value="achievement">Achievement</option>
                  <option value="recognition">Recognition</option>
                  <option value="magazine">Magazine Feature</option>
                  <option value="sponsor">Sponsor</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Title<span className="text-primary">*</span></label>
                <Input
                  placeholder="Title"
                  value={form.title || ""}
                  onChange={e => handleChange("title", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <Textarea
                placeholder="Description"
                value={form.description || ""}
                onChange={e => handleChange("description", e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Image URL</label>
                <Input
                  placeholder="Image url (optional)"
                  value={form.image || ""}
                  onChange={e => handleChange("image", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Link</label>
                <Input
                  placeholder="Associated link (optional)"
                  value={form.link || ""}
                  onChange={e => handleChange("link", e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save</Button>
              <Button variant="outline" onClick={handleCancel}><X className="mr-2 h-4 w-4" /> Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content List */}
      {isLoading ? (
        <div>Loading...</div>
      ) : contentList.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">No homepage content yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentList.map(content => (
            <Card key={content.id}>
              <CardContent className="py-4 flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                  <span className="bg-muted px-2 py-1 rounded-md text-xs font-semibold">{content.type}</span>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(content)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(content.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <h3 className="text-lg font-bold">{content.title}</h3>
                <div className="text-sm text-muted-foreground">{content.description}</div>
                {content.image && (
                  <img src={content.image} alt={content.title} className="w-full max-h-36 object-contain rounded-md bg-gray-100 mt-2" />
                )}
                {content.link && (
                  <a href={content.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs mt-1 underline">
                    {content.link}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageHomeContent;
