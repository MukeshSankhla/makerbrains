
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Hero from "./pages/hero";
import PortfolioHero from "./pages/AboutMe";
import Legal from "./pages/Legal";
import Mag from "./pages/magzines";
import Sponsors from "./pages/sponsors";
import Story from "./pages/story";
import Ach from "./pages/achivements";
import CreateProject from "./pages/CreateProject";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import ManageProducts from "./pages/ManageProducts";
import { ProjectProvider } from "@/pages/ProjectContext";
import { ShopProvider } from "@/contexts/ShopContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import AdminLogin from "./pages/AdminLogin";
import ManageAchievements from "./pages/ManageAchievements";
import AdminPanel from "./pages/AdminPanel";
import ManageProjects from "./pages/ManageProjects";
import ManageRecognitions from "./pages/ManageRecognitions";
import ManageMagazines from "./pages/ManageMagazines";
import ManageSponsors from "./pages/ManageSponsors";
import Contact from "./pages/ContactUs";
import { useAdminAuth } from "./contexts/AdminAuthContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAdminAuth();
  
  if (!isAdmin) {
    return <Navigate to="/admin-login" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="maker-brains-theme">
        <AdminAuthProvider>
          <ProjectProvider>
            <ShopProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <div className="min-h-screen">
                    <Navbar />
                    <main className="container mx-auto py-6">
                      <Routes>
                        <Route path="/" element={
                          <div className="">
                            <Hero />
                            <Index />
                            <PortfolioHero />
                            <Ach />
                            <Mag />
                            <Sponsors />
                            {/* <Story/> */}
                          </div>
                        } />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/legal" element={<Legal />} />
                        <Route path="/maker-admin-access" element={<AdminLogin />} />
                        <Route path="/admin-login" element={<Navigate to="/maker-admin-access" />} />
                        <Route path="/admin" element={
                          <ProtectedRoute>
                            <AdminPanel />
                          </ProtectedRoute>
                        } />
                        <Route path="/create" element={
                          <ProtectedRoute>
                            <CreateProject />
                          </ProtectedRoute>
                        } />
                        <Route path="/manage-achievements" element={
                          <ProtectedRoute>
                            <ManageAchievements />
                          </ProtectedRoute>
                        } />
                        <Route path="/manage-projects" element={
                          <ProtectedRoute>
                            <ManageProjects />
                          </ProtectedRoute>
                        } />
                        <Route path="/manage-products" element={
                          <ProtectedRoute>
                            <ManageProducts />
                          </ProtectedRoute>
                        } />
                        <Route path="/manage-recognitions" element={
                          <ProtectedRoute>
                            <ManageRecognitions />
                          </ProtectedRoute>
                        } />
                        <Route path="/manage-magazines" element={
                          <ProtectedRoute>
                            <ManageMagazines />
                          </ProtectedRoute>
                        } />
                        <Route path="/manage-sponsors" element={
                          <ProtectedRoute>
                            <ManageSponsors />
                          </ProtectedRoute>
                        } />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </BrowserRouter>
              </TooltipProvider>
            </ShopProvider>
          </ProjectProvider>
        </AdminAuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
