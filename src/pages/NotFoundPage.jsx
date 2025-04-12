import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Page non trouvée</h2>
      <p className="text-lg text-gray-600 mb-8">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn btn-primary px-6 py-3">
        Retour à l'accueil
      </Link>
    </div>
  )
}

export default NotFoundPage