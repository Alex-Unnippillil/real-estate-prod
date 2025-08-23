"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  useGetAuthUserQuery,
  useGetTenantDashboardQuery,
} from "@/state/api";
import Link from "next/link";
import {
  Heart,
  FileText,
  Calendar,
  MessageSquare,
} from "lucide-react";

const TenantDashboard = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const { data, isLoading, error } = useGetTenantDashboardQuery(
    authUser?.cognitoInfo?.userId || "",
    { skip: !authUser?.cognitoInfo?.userId }
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading dashboard</div>;

  const items = [
    {
      href: "/tenants/favorites",
      icon: Heart,
      label: "Favorites",
      count: data?.favorites.length || 0,
    },
    {
      href: "/tenants/applications",
      icon: FileText,
      label: "Applications",
      count: data?.applications.length || 0,
    },
    {
      href: "/tenants/tour-requests",
      icon: Calendar,
      label: "Tour Requests",
      count: data?.tourRequests.length || 0,
    },
    {
      href: "/tenants/messages",
      icon: MessageSquare,
      label: "Messages",
      count: data?.messages.length || 0,
    },
  ];

  return (
    <div className="dashboard-container">
      <Header title="Dashboard" subtitle="Quick overview of your activity" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(({ href, icon: Icon, label, count }) => (
          <Link key={href} href={href} className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">{label}</h2>
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TenantDashboard;
