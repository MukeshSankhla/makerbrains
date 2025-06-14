import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Settings, List } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const { isAdmin } = useAdminAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate("/maker-admin-access");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const adminOptions = [
    {
      title: "Projects",
      description: "Create and manage all projects",
      icon: List,
      actions: [
        { 
          label: "Create New Project", 
          icon: PlusCircle, 
          link: "/create",
          color: "text-emerald-600"
        },
        { 
          label: "Manage Projects", 
          icon: Settings, 
          link: "/manage-projects",
          color: "text-blue-600"
        },
      ],
    },
    {
      title: "Home Page Content",
      description: "Manage achievements, recognitions, magazine features and sponsors",
      icon: List,
      actions: [
        { 
          label: "Manage Home Content", 
          icon: Settings, 
          link: "/manage-achievements",
          color: "text-purple-600"
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminOptions.map((option, index) => (
          <Card key={index} className="hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <option.icon className="h-6 w-6" />
                <CardTitle className="text-xl">{option.title}</CardTitle>
              </div>
              <p className="text-sm">
                {option.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {option.actions.map((action, actionIndex) => (
                  <Link
                    key={actionIndex}
                    to={action.link}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-200"
                  >
                    <action.icon className={`h-5 w-5 ${action.color || 'text-primary'}`} />
                    <span className="font-medium">{action.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;