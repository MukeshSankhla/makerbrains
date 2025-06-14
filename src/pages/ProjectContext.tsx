
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Define the project type
export interface Project {
  id: number;
  title: string;
  description: string;
  content?: string;
  image: string;
  url?: string;
  author: string;
  date: string;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'date'>) => void;
  getProject: (id: number) => Project | undefined;
  updateProject: (project: Project) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Fetch projects from Supabase on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: false });
        
        if (error) {
          console.error('Error fetching projects:', error);
          return;
        }
        
        if (data) {
          setProjects(data as Project[]);
        }
      } catch (error) {
        console.error('Error in fetchProjects:', error);
      }
    };
    
    fetchProjects();
  }, []);

  const addProject = async (projectData: Omit<Project, 'id' | 'date'>) => {
    const newProject = {
      ...projectData,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select();
      
      if (error) {
        console.error('Error adding project:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setProjects(prevProjects => [data[0] as Project, ...prevProjects]);
      }
    } catch (error) {
      console.error('Error in addProject:', error);
    }
  };

  const getProject = (id: number) => {
    return projects.find(project => project.id === id);
  };

  const updateProject = async (updatedProject: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updatedProject)
        .eq('id', updatedProject.id);
        
      if (error) {
        console.error('Error updating project:', error);
        return;
      }
      
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === updatedProject.id ? updatedProject : project
        )
      );
    } catch (error) {
      console.error('Error in updateProject:', error);
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
