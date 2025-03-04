'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {usePathname} from "next/navigation";

interface DashboardContextProps {
    dashboardType: "candidate" | "admin" | 'reviewer'|null;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

interface DashboardProviderProps {
    children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {

    const [dashboardType, setDashboardType] = useState<"candidate" | "admin" | "reviewer"|null>(null);
  const path= usePathname();
  console.log("path : ",path);
    useEffect(() => {
        if (path.includes("candidate-dashboard")) {
            setDashboardType("candidate");
        } else if (path.includes("admin-dashboard")) {
            setDashboardType("admin");
        } else if (path.includes("reviewer-dashboard")){
            setDashboardType('reviewer');
        }
    }, [path]);
    return (
        <DashboardContext.Provider value={{ dashboardType }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = (): DashboardContextProps => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("Error");
    }
    return context;
};
