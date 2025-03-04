"use client";


import { AuthProvider} from "./context/AuthProvider"; 
import { DashboardProvider } from "./context/DashboardContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        <DashboardProvider>{children}</DashboardProvider>
     </AuthProvider>
  );
}
