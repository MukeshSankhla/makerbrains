import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

// Define Step type
type Step = {
  title: string;
  content: string; // can be rich text
};

// Update Project type to include steps (array of Step)
export interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  url?: string;
  author: string;
  date: string;
  steps: Step[]; // <-- Added
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'date'>) => void;
  getProject: (id: string) => Project | undefined;
  updateProject: (project: Project) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  // Fetch all projects from Firestore (order by most recent)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, "projects"), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data: Project[] = querySnapshot.docs.map(docSnap => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            title: d.title,
            description: d.description,
            content: d.content || "",
            image: d.image,
            url: d.url || "",
            author: d.author,
            date: d.date || (d.createdAt?.toDate?.().toLocaleDateString?.('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) ?? ""),
            steps: d.steps || [], // <-- Added
          }
        });
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  // Add a project to Firestore
  const addProject = async (projectData: Omit<Project, 'id' | 'date'>) => {
    const dateString = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    try {
      const docRef = await addDoc(collection(db, "projects"), {
        ...projectData,
        // For display, also store in original "date" field as string
        date: dateString,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setProjects(prev => [{
        id: docRef.id,
        ...projectData,
        date: dateString,
      }, ...prev]);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  // Get a single project by ID from the local state (if already loaded)
  const getProject = (id: string) => {
    return projects.find(project => project.id === id);
  };

  // Update an existing project in Firestore
  const updateProject = async (updatedProject: Project) => {
    try {
      const projectRef = doc(db, "projects", updatedProject.id);
      await updateDoc(projectRef, {
        ...updatedProject,
        updatedAt: serverTimestamp(),
      });
      setProjects(prev =>
        prev.map(project =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, getProject, updateProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
