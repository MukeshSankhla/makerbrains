import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, Calendar as CalendarIcon } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Instead, show a message to users for now.
const CreateProject = () => {
  return (
    <div className="my-32 flex items-center justify-center">
      <div className="bg-white dark:bg-[#292929] rounded-lg px-8 py-10 shadow-lg border max-w-xl w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Feature Unavailable</h2>
        <p>
          Project creation is temporarily disabled. <br /> Please contact the site admin for more information or check back soon!
        </p>
      </div>
    </div>
  );
};
export default CreateProject;
