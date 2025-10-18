export default function AdminFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>© 2025 PhotoHub Admin Panel</span>
            <span className="hidden md:inline">•</span>
            <span className="text-green-600 font-medium">System Online</span>
          </div>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a
              href="/admin/help"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Help & Support
            </a>
            <a
              href="/admin/system-status"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              System Status
            </a>
            <a
              href="/privacy"
              target="_blank"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="mt-2 sm:mt-0">
              <span>Logged in as Admin</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
