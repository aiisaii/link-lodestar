import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Navbar from "./components/Navbar";
import { LayoutShell } from "./components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Collections from "./pages/Collections";
import People from "./pages/People";
import PersonDetail from "./pages/PersonDetail";
import Torrents from "./pages/Torrents";
import TorrentDetail from "./pages/TorrentDetail";
import TagEditor from "./pages/TagEditor";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LayoutShell>
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/people" element={<People />} />
              <Route path="/people/:id" element={<PersonDetail />} />
              <Route path="/torrents" element={<Torrents />} />
              <Route path="/torrents/:id" element={<TorrentDetail />} />
              <Route path="/tag-editor" element={<TagEditor />} />
              <Route path="/search" element={<Search />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LayoutShell>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
