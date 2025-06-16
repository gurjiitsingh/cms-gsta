'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Plus, LayoutDashboard } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "All Customers", href: "/dashboard/customers", icon: Users },
  { name: "All Services", href: "/dashboard/services", icon: Users },
  { name: "New Customer", href: "/dashboard/customers/new", icon: Plus },
   { name: "New Service", href: "/dashboard/services/new", icon: Plus },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-2xl font-bold mb-6">Client CMS</h2>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
