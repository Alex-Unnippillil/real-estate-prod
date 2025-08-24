"use client";

import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useGetAuthUserQuery } from "@/state/api";
import {
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} from "@/state/api";

const NotificationBell = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const cognitoId = authUser?.cognitoInfo?.userId;
  const { data: notifications = [] } = useGetNotificationsQuery(cognitoId!, {
    skip: !cognitoId,
  });
  const [markNotificationsRead] = useMarkNotificationsReadMutation();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleOpenChange = (open: boolean) => {
    if (open && unreadCount > 0 && cognitoId) {
      markNotificationsRead(cognitoId);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className="relative focus:outline-none">
        <Bell className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-secondary-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white text-primary-700 max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="whitespace-normal">
              {notification.message}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>No notifications</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
