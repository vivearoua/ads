import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

// Components
import AdCard from '../components/ads/AdCard'
import CategoryCard from '../components/categories/CategoryCard'

const HomePage = () => {
  const [recentAds, setRecentAds] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Dans une implémentation réelle, ces données viendraient de l'API
        // Pour l'instant, nous utilisons des données fictives
        
        // Simuler le chargement des catégories
        const categoriesData = [
          { id: 1, name: 'Immobilier', slug: 'immobilier', icon: '🏠', count: 1250 },
          { id: 2, name: 'Véhicules', slug: 'vehicules', icon: '🚗', count: 876 },
          { id: 3, name: 'Emploi', slug: 'emploi', icon: '💼', count: 543 },
          { id: 4, name: 'Services', slug: 'services', icon: '🔧', count: 321 },
          { id: 5, name: 'Multimédia', slug: 'multimedia', icon: '📱', count: 654 },
          { id: 6, name: 'Maison', slug: 'maison', icon: '🛋️', count: 432 }
        ]
        
        // Simuler le chargement des annonces récentes
        const recentAdsData = [
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
        
        setCategories(categoriesData)
        setRecentAds(recentAdsData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        setError('Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  return (
    <div>
      {/* Hero section */}
      <section className="bg-primary-600 text-white py-12 px-4 rounded-lg mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Publiez votre annonce gratuitement en Belgique</h1>
          <p className="text-xl mb-8">Des milliers d'annonces dans toute la Belgique. Achetez, vendez, louez et trouvez des services près de chez vous.</p>
          <Link to="/publier-annonce" className="bg-white text-primary-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
            Publier une annonce
          </Link>
        </div>
      </section>

      {/* Categories section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Catégories populaires</h2>
          <Link to="/categories" className="text-primary-600 hover:underline">Voir toutes les catégories</Link>
        </div>
        
        {loading ? (
          <div className="text-center py-8">Chargement des catégories...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Recent ads section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Annonces récentes</h2>
          <Link to="/annonces" className="text-primary-600 hover:underline">Voir toutes les annonces</Link>
        </div>
        
        {loading ? (
          <div className="text-center py-8">Chargement des annonces...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentAds.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage