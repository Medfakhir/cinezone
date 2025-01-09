"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
    LayoutDashboard, 
    Film, 
    Settings, 
    LogOut, 
    ChevronLeft,
    User
} from "lucide-react";

export default function AdminLayout({ children }) {
    const [username, setUsername] = useState(null);
    const [error, setError] = useState(null);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const storedUsername = localStorage.getItem("username");

                if (!token || !storedUsername) {
                    router.push("/login");
                    return;
                }

                setUsername(storedUsername);
            } catch (err) {
                setError("Failed to fetch user details.");
                router.push("/login");
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        router.push("/login");
    };

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/movies", label: "Movies", icon: Film },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    if (!username) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-slate-200 rounded"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
                <div className="flex items-center justify-between p-4 border-b">
                    {!isSidebarCollapsed && (
                        <h1 className="text-2xl font-bold text-gray-800">CimZoneAdmin</h1>
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ChevronLeft className={`transform transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                
                <div className="p-4 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        {!isSidebarCollapsed && (
                            <div>
                                <p className="text-sm font-medium text-gray-700">{username}</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                    isActive 
                                        ? 'bg-indigo-50 text-indigo-600' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
                                {!isSidebarCollapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                    
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        {!isSidebarCollapsed && <span>Logout</span>}
                    </button>
                </nav>
            </aside>

            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage your content and settings
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}