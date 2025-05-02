"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className="bg-purple-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Insyd
        </Link>

        <nav>
          <ul className="flex space-x-4">
            {user && (
              <>
                <li>
                  <button onClick={logout} className="hover:text-purple-200">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
