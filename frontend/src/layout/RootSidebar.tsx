"use client";

import Link from "next/link";
import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Flag,
  FlaskConical,
  Code2,
  FileCode2,
  CircleQuestionMark,
  CircleUser,
  Settings,
  UserPlus,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
type RootSidebarProps = {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
};

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard/overview" },
  { label: "Feature Flags", icon: Flag, href: "/dashboard#flags" },
  { label: "Evaluation", icon: FlaskConical, href: "/dashboard#evaluate" },
];

export default function RootSidebar({
  collapsed,
  setCollapsed,
}: RootSidebarProps) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState<"#flags" | "#evaluate">(
    "#flags",
  );
  const { resolvedTheme, setTheme } = useTheme();

  const handleLogout = () => {
    toast.error("not implemented");
  };

  const isDark = resolvedTheme === "dark";
  const isItemActive = (href: string): boolean => {
    if (href === "/dashboard/overview") {
      return pathname === href;
    }

    if (href.startsWith("/dashboard#")) {
      const hash = href.slice(href.indexOf("#")) as "#flags" | "#evaluate";
      return pathname === "/dashboard" && activeHash === hash;
    }

    return pathname === href;
  };

  return (
    <TooltipProvider delayDuration={100}>
      <aside
        className={`h-screen flex flex-col bg-[#f9f8f7] border-r border-gray-200 dark:border-[#302f2f] dark:bg-[#202020] text-gray-700 dark:text-gray-300 ${collapsed ? "w-[72px]" : "w-[260px]"}`}
      >
        <div className="border-b border-border px-2 py-2">
          <div className="rounded-md px-2 py-1 hover:bg-accent">
            <div className="flex items-center justify-between">
              {!collapsed && (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-center justify-between w-full cursor-pointer">
                      <Button variant="ghost" className="px-1">
                        <CircleUser className="w-4 h-4" /> User
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={'ghost'}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCollapsed(!collapsed);
                            }}
                            className="text-muted-foreground"
                          >
                            <ChevronLeft size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          <p>Close sidebar</p>
                          <p>Ctrl+/</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    className="w-80 gap-0 rounded-lg border border-border p-0"
                  >
                    <div className="grid gap-4 rounded-t-lg border-b border-border bg-popover p-2">
                      <div className="flex items-center flex-nowrap gap-2 text-xs">
                        <CircleUser className="w-6 h-6 opacity-80 " />
                        <div className="flex flex-col">
                          <span className="text-sm">User&apos;s Space</span>
                          <span className="text-muted-foreground">
                            user@gmail.com
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center flex-nowrap gap-2">
                        <Button className="flex items-center justify-center flex-nowrap border border-border bg-card text-muted-foreground hover:bg-accent text-xs ">
                          <Settings className="max-w-3.5 max-h-3.5" /> Settings
                        </Button>
                        <Button className="flex items-center justify-center flex-nowrap border border-border bg-card text-muted-foreground hover:bg-accent text-xs">
                          <UserPlus className="max-w-3.5 max-h-3.5" /> Invite
                          members
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-b-lg bg-popover p-2">
                      <Button
                        onClick={handleLogout}
                        variant={'ghost'}
                        className="w-full justify-start font-medium text-red-500  hover:text-red-600"
                      >
                        Logout
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {collapsed && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setCollapsed(!collapsed)}
                      variant={'ghost'}
                      className="text-muted-foreground"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    <p>Expand sidebar</p>
                    <p>Ctrl+/</p>
                  </TooltipContent>
                </Tooltip>
              )}

            </div>

          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-2 py-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    if (item.href.startsWith("/dashboard#")) {
                      setActiveHash(
                        item.href.slice(item.href.indexOf("#")) as
                          | "#flags"
                          | "#evaluate",
                      );
                    }
                  }}
                  className={`flex items-center rounded-md px-2 py-1.5 text-sm transition ${collapsed ? "justify-center" : "gap-2"} ${active ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "hover:bg-accent"}`}
                >
                  <Icon className="h-4 w-4 opacity-80" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>

          <Section title="Upcoming features" collapsed={collapsed}>
            <SidebarGhostItem
              icon={<Code2 className="h-4 w-4 opacity-80" />}
              label="SDK Environments"
              collapsed={collapsed}
            />
          </Section>

          <Section title="Private" collapsed={collapsed}>
            <SidebarGhostItem
              icon={<FileCode2 className="h-4 w-4 opacity-80" />}
              label="Flag Audit Logs"
              collapsed={collapsed}
            />
          </Section>
        </div>

        <div className="border-t border-border p-2">
          <div className="mb-2 flex gap-2">
            <Button variant="ghost" size="icon" aria-label="Help">
              <CircleQuestionMark className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Theme"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

function SidebarGhostItem({
  icon,
  label,
  collapsed,
}: {
  icon: ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <div
      className={`flex cursor-not-allowed items-center rounded-md px-2 py-1.5 text-sm text-gray-500 ${collapsed ? "justify-center" : "gap-2"}`}
    >
      {icon}
      {!collapsed && <span className="truncate">{label}</span>}
    </div>
  );
}

function Section({
  title,
  children,
  collapsed,
}: {
  title: string;
  children: ReactNode;
  collapsed: boolean;
}) {
  if (collapsed) return null;

  return (
    <div>
      <p className="mb-1 px-2 text-xs text-gray-500">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
