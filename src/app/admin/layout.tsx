import type { Metadata } from 'next';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminFooter from '@/components/admin/AdminFooter';
import Providers from '@/components/Providers';
import AdminRoute from '@/components/AdminRoute';

export const metadata: Metadata = {
  title: 'PhotoHub Admin Panel',
  description: 'Administrative dashboard for PhotoHub',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <AdminRoute>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <AdminHeader />
          <main className="flex-1">
            {children}
          </main>
          <AdminFooter />
        </div>
      </AdminRoute>
    </Providers>
  );
}
