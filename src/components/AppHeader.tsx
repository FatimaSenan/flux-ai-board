import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, LogOut, User2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isMain = location.pathname === "/projects";
  const isPublic = location.pathname === "/" || location.pathname === "/login";
  const shouldShowBack = !isPublic && !isMain;

  const handleBack = () => {
    // Retourne vers la page des projets par défaut
    navigate("/projects");
  };

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    navigate("/login", { replace: true });
  };

  const getUserInitials = () => {
    const name = (localStorage.getItem("userName") || "User").trim();
    const parts = name.split(/\s+/);
    const first = parts[0]?.[0] || "U";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E293B] bg-[#0F172A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0F172A]/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-16 md:px-6">
        <div className="flex items-center gap-3">
          {shouldShowBack ? (
            <button
              aria-label="Retour"
              onClick={handleBack}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-[#F97316]/40 bg-[#1E293B] px-3 text-[#F8FAFC] hover:bg-[#F97316]/90 hover:text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 shadow-sm hover:shadow-[0_0_16px_rgba(249,115,22,0.25)] transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden md:inline text-sm font-medium">Back</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#2563EB] to-[#38BDF8] text-white font-bold">
                F
              </div>
              <span className="text-sm font-semibold tracking-wide text-[#F8FAFC] md:text-base">
                Flux AI Board
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="h-9 w-9 border border-[#1E293B] shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-[#2563EB] to-[#38BDF8] text-white text-sm font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44 border-[#1E293B] bg-[#0F172A] text-[#F8FAFC]">
              <DropdownMenuLabel className="text-[#94A3B8]">Compte</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#1E293B]" />
              <DropdownMenuItem className="focus:bg-[#1E293B] focus:text-[#F8FAFC]">
                <User2 className="mr-2 h-4 w-4" /> Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="focus:bg-[#1E293B] focus:text-[#F8FAFC] text-red-400">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;


