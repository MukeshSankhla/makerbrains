
import React, { useEffect, useState } from "react";
import { FaTrophy, FaMedal, FaStar, FaLink, FaAward, FaRegNewspaper } from "react-icons/fa";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Achievement {
  id: number;
  year: number;
  title: string;
  link: string;
  icon: string;
}

interface Recognition {
  id: number;
  year: number;
  title: string;
  link: string;
}

export default function AchievementsAndRecognition() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch achievements
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .order('year', { ascending: false });
        
        if (achievementsError) throw achievementsError;
        
        // Fetch recognitions
        const { data: recognitionsData, error: recognitionsError } = await supabase
          .from('recognitions')
          .select('*')
          .order('year', { ascending: false });
        
        if (recognitionsError) throw recognitionsError;
        
        setAchievements(achievementsData || []);
        setRecognitions(recognitionsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Function to render the icon based on the icon type
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'trophy':
        return <FaTrophy className="text-yellow-500 text-3xl" />;
      case 'medal':
        return <FaMedal className="text-green-500 text-3xl" />;
      case 'star':
        return <FaStar className="text-blue-500 text-3xl" />;
      case 'award':
        return <FaAward className="text-purple-500 text-3xl" />;
      default:
        return <FaTrophy className="text-yellow-500 text-3xl" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-5">
      <div className="max-w-full mx-auto">
        {/* Achievements Section */}
        <div className="mb-6">
          <h2 className="text-4xl mb-2">Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex flex-col items-center bg-white dark:bg-[#333333] shadow rounded-lg p-4 space-y-4 relative"
                onClick={() => achievement.link && window.open(achievement.link, "_blank", "noopener,noreferrer")}
                style={{ cursor: achievement.link ? 'pointer' : 'default' }}
              >
                {/* Icon */}
                <div className="text-center mb-2">{renderIcon(achievement.icon)}</div>

                {/* Title */}
                <h3 className="text-md font-semibold text-gray-900 dark:text-white text-center line-clamp-3 break-words">
                  {achievement.title}
                </h3>

                {/* View Details */}
                <div className="w-full">
                  {achievement.link && (
                    <a
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm absolute bottom-2 left-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaLink className="inline-block mr-1" /> View Details
                    </a>
                  )}

                  {/* Year */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 absolute bottom-2 right-2">
                    {achievement.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recognitions Section */}
        <div>
          <h2 className="text-4xl mb-2">Recognitions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {recognitions.map((recognition) => (
              <div
                key={recognition.id}
                className="flex flex-col items-center bg-white dark:bg-[#333333] shadow rounded-lg p-4 space-y-4 relative"
                onClick={() => recognition.link && window.open(recognition.link, "_blank", "noopener,noreferrer")}
                style={{ cursor: recognition.link ? 'pointer' : 'default' }}
              >
                <div className="text-center mb-2">
                  <FaRegNewspaper className="text-primary text-3xl" />
                </div>
                {/* Title */}
                <h3 className="text-md font-semibold text-gray-900 dark:text-white text-center line-clamp-3 break-words">
                  {recognition.title}
                </h3>

                {/* Read More */}
                <div className="w-full">
                  {recognition.link && (
                    <a
                      href={recognition.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm absolute bottom-2 left-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaLink className="inline-block mr-1" /> Read More
                    </a>
                  )}

                  {/* Year */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 absolute bottom-2 right-2">
                    {recognition.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
