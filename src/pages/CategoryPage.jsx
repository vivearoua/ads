import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

// Components
import AdCard from '../components/ads/AdCard'

const CategoryPage = () => {
  const { categorySlug } = useParams()
  const [category, setCategory] = useState(null)
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Dans une implémentation réelle, ces données viendraient de l'API
        // Pour l'instant, nous utilisons des données fictives
        
        // Simuler le chargement de la catégorie
        let categoryData = null
        
        // Données fictives des catégories
        const categoriesData = [
          { id: 1, name: 'Immobilier', slug: 'immobilier', icon: '🏠', count: 1250 },
          { id: 2, name: 'Véhicules', slug: 'vehicules', icon: '🚗', count: 876 },
          { id: 3, name: 'Emploi', slug: 'emploi', icon: '💼', count: 543 },
          { id: 4, name: 'Services', slug: 'services', icon: '🔧', count: 321 },
          { id: 5, name: 'Multimédia', slug: 'multimedia', icon: '📱', count: 654 },
          { id: 6, name: 'Maison', slug: 'maison', icon: '🛋️', count: 432 }
        ]
        
        // Trouver la catégorie correspondante
        categoryData = categoriesData.find(cat => cat.slug === categorySlug)
        
        if (!categoryData) {
          throw new Error('Catégorie non trouvée')
        }
        
        setCategory(categoryData)
        
        // Simuler le chargement des annonces de cette catégorie
        const adsData = [
          {
            id: 1,
            title: 'Appartement 2 chambres à Bruxelles',
            description: 'Bel appartement rénové avec 2 chambres, proche des transports et commerces.',
            price: 850,
            location: 'Bruxelles',
            category: 'Immobilier',
            subcategory: 'Appartements',
            image: 'https://via.placeholder.com/300x200',
            date: '2023-09-15',
            slug: 'appartement-2-chambres-bruxelles'
          },
          {
            id: 2,
            title: 'Volkswagen Golf 7 essence',
            description: 'Golf 7 en parfait état, 45000 km, essence, année 2019.',
            price: 15900,
            location: 'Liège',
            category: 'Véhicules',
            subcategory: 'Voitures',
            image: 'https://via.placeholder.com/300x200',
            date: '2023-09-14',
            slug: 'volkswagen-golf-7-essence'
          },
          {
            id: 3,
            title: 'Développeur web full-stack',
            description: 'Recherche développeur web full-stack pour projet à long terme.',
            price: null,
            location: 'Namur',
            category: 'Emploi',
            subcategory: 'Informatique',
            image: 'https://via.placeholder.com/300x200',
            date: '2023-09-13',
            slug: 'developpeur-web-full-stack'
          },
          {
            id: 4,
            title: 'iPhone 13 Pro Max 256Go',
            description: 'iPhone 13 Pro Max en parfait état, 256Go, couleur graphite.',
            price: 750,
            location: 'Anvers',
            category: 'Multimédia',
            subcategory: 'Téléphones',
            image: 'https://via.placeholder.com/300x200',
            date: '2023-09-12',
            slug: 'iphone-13-pro-max-256go'
          },
          {
            id: 5,
            title: 'Plombier professionnel',
            description: 'Plombier expérimenté pour tous vos travaux de plomberie.',
            price: null,
            location: 'Gand',
            category: 'Services',
            subcategory: 'Travaux',
            image: 'https://via.placeholder.com/300x200',
            date: '2023-09-11',
            slug: 'plombier-professionnel'
          },
          {
            id: 6,
            title: 'Canapé d\'angle en cuir',
            description: 'Canapé d\'angle en cuir noir, très bon état, peu utilisé.',
            price: 450,
            location: 'Charleroi',
            category: 'Maison',
            subcategory: 'Meubles',
            image: 'https://via.placeholder.com/300x200',
            date: '2023-09-10',
            slug: 'canape-angle-cuir'
          }
        ]
        
        // Filtrer les annonces par catégorie
        const filteredAds = adsData.filter(ad => ad.category.toLowerCase() === categoryData.name.toLowerCase())
        
        setAds(filteredAds)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        setError('Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategoryData()
  }, [categorySlug])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement des annonces...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block mb-4">
          <p>{error}</p>
        </div>
        <Link to="/" className="text-primary-600 hover:underline">Retour à l'accueil</Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header de la catégorie */}
      <div className="bg-primary-50 rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <span className="mr-2">{category.icon}</span>
          {category.name}
        </h1>
        <p className="text-gray-600">{category.count} annonces disponibles</p>
      </div>
      
      {/* Filtres */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Filtrer les résultats</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Prix */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
            <select id="price" className="form-input">
              <option value="">Tous les prix</option>
              <option value="0-100">Moins de 100 €</option>
              <option value="100-500">100 € - 500 €</option>
              <option value="500-1000">500 € - 1000 €</option>
              <option value="1000+">Plus de 1000 €</option>
            </select>
          </div>
          
          {/* Localisation */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
            <select id="location" className="form-input">
              <option value="">Toute la Belgique</option>
              <option value="bruxelles">Bruxelles</option>
              <option value="anvers">Anvers</option>
              <option value="liege">Liège</option>
              <option value="gand">Gand</option>
              <option value="charleroi">Charleroi</option>
            </select>
          </div>
          
          {/* Tri */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Trier par</label>
            <select id="sort" className="form-input">
              <option value="date-desc">Date: Plus récentes</option>
              <option value="date-asc">Date: Plus anciennes</option>
              <option value="price-asc">Prix: Croissant</option>
              <option value="price-desc">Prix: Décroissant</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Résultats */}
      {ads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Aucune annonce trouvée dans cette catégorie.</p>
          <Link to="/publier-annonce" className="btn btn-primary">
            Publier une annonce dans cette catégorie
          </Link>
        </div>
      )}
    </div>
  )
}

export default CategoryPage