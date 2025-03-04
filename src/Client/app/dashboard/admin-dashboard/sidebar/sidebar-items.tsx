import {type SidebarItem} from "./sidebar";

export const items: SidebarItem[] = [
  {
    key: "home",
    href: "/",
    icon: "solar:home-2-linear",
    title: "Home",
  },
  {
    key: "exam-management",
    href: "/admin_dashboard/exam-management",
    icon: "solar:widget-2-outline",
    title: "Exam Management",
  },
  {
    key: "candidate-management",
    href: "#",
    icon: "solar:checklist-minimalistic-outline",
    title: "Candidate Management",
  },
  {
    key: "reviewer-management",
    href: "#",
    icon: "solar:sort-by-time-linear",
    title: "Reviewer Management",
  },
  {
    key: "live-monitoring",
    href: "#",
    icon: "solar:chart-outline",
    title: "Live Monitoring",
  },
  {
    key: "settings",
    href: "#",
    icon: "solar:settings-outline",
    title: "Settings",
  },
];