
// Firebase equivalent of the current project context
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface FirebaseProject {
  id: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  url?: string;
  author: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useFirebaseProjects = () => {
  const [projects, setProjects] = useState<FirebaseProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchProjects = async (loadMore = false) => {
    try {
      setIsLoading(true);
      
      let q = query(
        collection(db, 'projects'),
        orderBy('createdAt', 'desc'),
        limit(6)
      );

      if (loadMore && lastDoc) {
        q = query(
          collection(db, 'projects'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(6)
        );
      }

      const querySnapshot = await getDocs(q);
      const newProjects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseProject[];

      if (loadMore) {
        setProjects(prev => [...prev, ...newProjects]);
      } else {
        setProjects(newProjects);
      }

      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(querySnapshot.docs.length === 6);

    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = async (projectData: Omit<FirebaseProject, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Add to local state
      const newProject = {
        id: docRef.id,
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setProjects(prev => [newProject, ...prev]);
      
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProject = async (projectId: string, updates: Partial<FirebaseProject>) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      // Update local state
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { ...project, ...updates, updatedAt: new Date() }
            : project
        )
      );
      
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const getProject = async (projectId: string): Promise<FirebaseProject | null> => {
    try {
      const docRef = doc(db, 'projects', projectId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as FirebaseProject;
      }
      
      return null;
      
    } catch (error) {
      console.error('Error getting project:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
    hasMore,
    fetchProjects,
    addProject,
    updateProject,
    getProject,
    loadMore: () => fetchProjects(true)
  };
};
