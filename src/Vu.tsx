
import { useState, useEffect } from "react";



export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface DashboardLayoutProps {
  user: AuthUser;
}

export default function DashboardLayout({
  user,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#0A0A09]">
  
	<main className="flex-1 p-6 text-[#EEEDE7]">
		<div className="space-y-6">
			hello {user.name}
		</div>
	</main>
    </div>
  );
}
