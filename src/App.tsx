
import React, { useRef } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from '@/context/AppContext';
import Index from "./pages/Index";
import Lessons from "./pages/Lessons";
import Simulations from "./pages/Simulations";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";
import VoiceInterface from "./components/VoiceInterface";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

function App() {
  // Create a stable reference to the QueryClient that persists across renders
  const queryClientRef = useRef<QueryClient | null>(null);
  
  // Initialize QueryClient only once
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/simulations" element={<Simulations />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <VoiceInterface />
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
