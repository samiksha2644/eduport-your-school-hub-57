import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DataProvider } from "@/contexts/DataContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Index from "./pages/Index";
import VisionMission from "./pages/VisionMission";
import GalleryPage from "./pages/GalleryPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import VisitingHours from "./pages/VisitingHours";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ExaminationsPage from "./pages/ExaminationsPage";
import CareerGuidancePage from "./pages/CareerGuidancePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/vision-mission" element={<VisionMission />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/announcements" element={<AnnouncementsPage />} />
                    <Route path="/visiting-hours" element={<VisitingHours />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/examinations" element={<ExaminationsPage />} />
                    <Route path="/career-guidance" element={<CareerGuidancePage />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
