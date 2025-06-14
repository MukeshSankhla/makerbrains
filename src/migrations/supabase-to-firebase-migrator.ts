
// Migration script to export data from Supabase and prepare for Firebase import
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/config/firebase";
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';

interface MigrationData {
  projects: any[];
  achievements: any[];
  magazines: any[];
  sponsors: any[];
  recognitions: any[];
}

export class SupabaseToFirebaseMigrator {
  async exportSupabaseData(): Promise<MigrationData> {
    console.log('Starting Supabase data export...');
    
    try {
      // Export all tables
      const [projects, achievements, magazines, sponsors, recognitions] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('achievements').select('*'),
        supabase.from('magazines').select('*'),
        supabase.from('sponsors').select('*'),
        supabase.from('recognitions').select('*')
      ]);

      const migrationData = {
        projects: projects.data || [],
        achievements: achievements.data || [],
        magazines: magazines.data || [],
        sponsors: sponsors.data || [],
        recognitions: recognitions.data || []
      };

      // Save to JSON file for backup
      const dataBlob = new Blob([JSON.stringify(migrationData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(dataBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `makerbrains-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      console.log('Data exported successfully');
      return migrationData;
      
    } catch (error) {
      console.error('Error exporting Supabase data:', error);
      throw error;
    }
  }

  async importToFirebase(data: MigrationData): Promise<void> {
    console.log('Starting Firebase import...');
    
    try {
      // Use batched writes for better performance
      const batch = writeBatch(db);
      let operationCount = 0;
      
      // Import projects
      for (const project of data.projects) {
        const docRef = doc(collection(db, 'projects'));
        batch.set(docRef, {
          ...project,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        operationCount++;
        
        // Firestore batch limit is 500 operations
        if (operationCount >= 450) {
          await batch.commit();
          operationCount = 0;
        }
      }

      // Import other collections
      const collections = [
        { name: 'achievements', data: data.achievements },
        { name: 'magazines', data: data.magazines },
        { name: 'sponsors', data: data.sponsors },
        { name: 'recognitions', data: data.recognitions }
      ];

      for (const { name, data: collectionData } of collections) {
        for (const item of collectionData) {
          const docRef = doc(collection(db, name));
          batch.set(docRef, {
            ...item,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          operationCount++;
          
          if (operationCount >= 450) {
            await batch.commit();
            operationCount = 0;
          }
        }
      }

      // Commit remaining operations
      if (operationCount > 0) {
        await batch.commit();
      }

      console.log('Firebase import completed successfully');
      
    } catch (error) {
      console.error('Error importing to Firebase:', error);
      throw error;
    }
  }

  async runFullMigration(): Promise<void> {
    try {
      console.log('Starting full migration process...');
      
      // Step 1: Export from Supabase
      const data = await this.exportSupabaseData();
      
      // Step 2: Import to Firebase
      await this.importToFirebase(data);
      
      console.log('Migration completed successfully!');
      
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
}

// Utility function to run migration
export const runMigration = async () => {
  const migrator = new SupabaseToFirebaseMigrator();
  await migrator.runFullMigration();
};
