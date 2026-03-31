import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardSkeleton, ProjectSkeleton, PageSkeleton, AuthSkeleton } from "@/components/SkeletonScreens";

// Lazy load all pages
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectDashboard = lazy(() => import("./pages/ProjectDashboard"));
const Contact = lazy(() => import("./pages/Contact"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Admin = lazy(() => import("./pages/Admin"));
const About = lazy(() => import("./pages/About"));
const Careers = lazy(() => import("./pages/Careers"));
const RequestDemo = lazy(() => import("./pages/RequestDemo"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Named export lazy loaders
const Terms = lazy(() => import("./pages/Legal").then(m => ({ default: m.Terms })));
const Privacy = lazy(() => import("./pages/Legal").then(m => ({ default: m.Privacy })));
const DPA = lazy(() => import("./pages/Legal").then(m => ({ default: m.DPA })));
const AcceptableUse = lazy(() => import("./pages/Legal").then(m => ({ default: m.AcceptableUse })));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Suspense fallback={<PageSkeleton />}><Index /></Suspense>} />
            <Route path="/auth" element={<Suspense fallback={<AuthSkeleton />}><Auth /></Suspense>} />
            <Route path="/pricing" element={<Suspense fallback={<PageSkeleton />}><Pricing /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<PageSkeleton />}><Contact /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<PageSkeleton />}><About /></Suspense>} />
            <Route path="/careers" element={<Suspense fallback={<PageSkeleton />}><Careers /></Suspense>} />
            <Route path="/request-demo" element={<Suspense fallback={<PageSkeleton />}><RequestDemo /></Suspense>} />
            <Route path="/terms" element={<Suspense fallback={<PageSkeleton />}><Terms /></Suspense>} />
            <Route path="/privacy" element={<Suspense fallback={<PageSkeleton />}><Privacy /></Suspense>} />
            <Route path="/dpa" element={<Suspense fallback={<PageSkeleton />}><DPA /></Suspense>} />
            <Route path="/acceptable-use" element={<Suspense fallback={<PageSkeleton />}><AcceptableUse /></Suspense>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<DashboardSkeleton />}><Dashboard /></Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:projectId"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<ProjectSkeleton />}><ProjectDashboard /></Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<DashboardSkeleton />}><Transactions /></Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<DashboardSkeleton />}><Admin /></Suspense>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Suspense fallback={<PageSkeleton />}><NotFound /></Suspense>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
