"use client";

import { useAuth } from '@/components/auth/auth-provider';
import { MainLayout } from '@/components/layout/main-layout';
import { redirect } from 'next/navigation';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (!isLoading && !user) {
    redirect('/login');
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
} 