'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">PhotoHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <div className="relative group">
                <button className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                  Photo Books
                  <svg className="ml-1 w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link href="/albums" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                      All Photo Books
                    </Link>
                    <Link href="/albums?category=wedding" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                      Wedding Albums
                    </Link>
                    <Link href="/albums?category=travel" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                      Travel Books
                    </Link>
                    <Link href="/albums?category=family" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                      Family Albums
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/home-decor" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Home Decor
              </Link>
              <Link href="/cards" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Cards
              </Link>
              <Link href="/calendars" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Calendars
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Pricing
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                  My Albums
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {session.user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span>{session.user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                        Dashboard
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                        My Orders
                      </Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                        Profile
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                  Sign In
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
            <Link href="/albums" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md">
              Photo Books
            </Link>
            <Link href="/home-decor" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md">
              Home Decor
            </Link>
            <Link href="/cards" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md">
              Cards
            </Link>
            <Link href="/calendars" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md">
              Calendars
            </Link>
            <Link href="/pricing" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md">
              Pricing
            </Link>
            
            <hr className="my-4" />
            
            {session ? (
              <div className="space-y-1">
                <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md">
                  My Albums
                </Link>
                <Link href="/orders" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md">
                  My Orders
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md">
                  Sign In
                </Link>
                <Link href="/register" className="block mx-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-base font-medium text-center">
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
