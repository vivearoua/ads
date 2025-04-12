import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Les Annonces
          </Link>

          {/* Navigation principale */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600">
              Accueil
            </Link>
            <Link to="/publier-annonce" className="text-gray-700 hover:text-primary-600">
              Publier une annonce
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary-600">
                Catégories
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                {/* Ces catégories seront chargées dynamiquement depuis l'API */}
                <Link to="/immobilier" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Immobilier
                </Link>
                <Link to="/vehicules" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Véhicules
                </Link>
                <Link to="/emploi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Emploi
                </Link>
              </div>
            </div>
          </nav>

          {/* Authentification */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link to={`/profil/${currentUser.id}`} className="text-gray-700 hover:text-primary-600">
                  Mon profil
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Connexion
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Inscription
                </Link>
              </div>
            )}
            <Link to="/publier-annonce" className="btn btn-primary hidden sm:block">
              Publier une annonce
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header