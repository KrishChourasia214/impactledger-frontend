import Sidebar from './Sidebar'

export default function DashboardLayout({ children, sidebarItems, userType }) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar on the left */}
      <Sidebar items={sidebarItems} userType={userType} />

      {/* Main content area */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}