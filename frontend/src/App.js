import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

// Public Pages
import { HomePage } from "./pages/HomePage";
import { VisionPage, MissionPage, JourneyPage, AboutPage } from "./pages/CorporatePages";
import { SOPPage, PoliciesPage, SafetyPage } from "./pages/CompliancePages";
import { ITServicesPage, HRServicesPage, FAServicesPage } from "./pages/ServicePages";
import { NewsPage } from "./pages/NewsPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { EventsPage } from "./pages/EventsPage";
import { GalleryPage } from "./pages/GalleryPage";

// Admin Pages
import { AdminLogin } from "./pages/AdminLogin";
import { AdminLayout } from "./pages/AdminLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminNews } from "./pages/AdminNews";
import { AdminEvents } from "./pages/AdminEvents";
import { AdminGallery } from "./pages/AdminGallery";
import { AdminEmployees } from "./pages/AdminEmployees";
import { AdminHero } from "./pages/AdminHero";
// import { AdminUsers } from "./pages/AdminUsers";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            
            {/* Corporate Routes */}
            <Route path="/corporate/vision" element={<VisionPage />} />
            <Route path="/corporate/mission" element={<MissionPage />} />
            <Route path="/corporate/journey" element={<JourneyPage />} />
            <Route path="/corporate/about" element={<AboutPage />} />
            
            {/* Compliance Routes */}
            <Route path="/compliance/sop" element={<SOPPage />} />
            <Route path="/compliance/policies" element={<PoliciesPage />} />
            <Route path="/compliance/safety" element={<SafetyPage />} />
            
            {/* Services Routes */}
            <Route path="/services/it" element={<ITServicesPage />} />
            <Route path="/services/hr" element={<HRServicesPage />} />
            <Route path="/services/fa" element={<FAServicesPage />} />
            
            {/* Communication Routes */}
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="news" element={<AdminNews />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="employees" element={<AdminEmployees />} />
              <Route path="hero" element={<AdminHero />} />
              {/* <Route path="users" element={<AdminUsers />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e2e8f0',
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;
