import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { PhoneIcon, EnvelopeIcon, MapPinIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline'

// Context
import { useAuth } from '../contexts/AuthContext'

const AdDetailsPage = () => {
  const { categorySlug, adSlug } = useParams()
  const { currentUser } = useAuth()
  const [ad, setAd] = useState(null)
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showContact, setShowContact] = useState(false)

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Dans une implémentation réelle, ces données viendraient de l'API
        // Pour l'instant, nous utilisons des données fictives
        
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Données fictives d'annonces
        const adsData = [
          {
            id: 1,
            title: 'Appartement 2 chambres à Bruxelles',
            description: 'Bel appartement rénové avec 2 chambres, proche des transports et commerces. Cuisine équipée, salle de bain avec douche italienne, salon lumineux. Disponible immédiatement. Charges comprises dans le loyer. Caution de 2 mois demandée.',
            price: 850,
            location: 'Bruxelles',
            category: 'Immobilier',
            categorySlug: 'immobilier',
            subcategory: 'Appartements',
            images: [
              'https://via.placeholder.com/800x600',
              'https://via.placeholder.com/800x600',
              'https://via.placeholder.com/800x600'
            ],
            date: '2023-09-15',
            slug: 'appartement-2-chambres-bruxelles',
            features: {
              surface: '75 m²',
              rooms: '2 chambres',
              furnished: 'Non meublé',
              floor: '3ème étage'
            },
            user_id: 1
          },
          {
            id: 2,
            title: 'Volkswagen Golf 7 essence',
            description: 'Golf 7 en parfait état, 45000 km, essence, année 2019. Première main, carnet d\'entretien complet, non fumeur. Climatisation, GPS, caméra de recul, sièges chauffants. Contrôle technique récent.',
            price: 15900,
            location: 'Liège',
            category: 'Véhicules',
            categorySlug: 'vehicules',
            subcategory: 'Voitures',
            images: [
              'https://via.placeholder.com/800x600',
              'https://via.placeholder.com/800x600',
              'https://via.placeholder.com/800x600'
            ],
            date: '2023-09-14',
            slug: 'volkswagen-golf-7-essence',
            features: {
              brand: 'Volkswagen',
              model: 'Golf 7',
              year: '2019',
              mileage: '45000 km',
              fuel: 'Essence',
              transmission: 'Manuelle'
            },
            user_id: 2
          }
        ]
        
        // Trouver l'annonce correspondante
        const adData = adsData.find(a => a.slug === adSlug && a.categorySlug === categorySlug)
        
        if (!adData) {
          console.error(`Annonce non trouvée - slug: ${adSlug}, categorySlug: ${categorySlug}`)
          throw new Error(`L'annonce "${adSlug}" dans la catégorie "${categorySlug}" n'existe pas. Veuillez vérifier l'URL ou retourner à la page précédente.`)
        }
        
        setAd(adData)
        
        // Simuler les données du vendeur
        const sellerData = {
          id: adData.user_id,
          name: 'Jean Dupont',
          memberSince: '2022-05-10',
          phone: '+32 470 12 34 56',
          email: 'jean.dupont@example.com',
          rating: 4.8,
          reviewCount: 15
        }
        
        setSeller(sellerData)
      } catch (error) {
        console.error('Erreur lors du chargement de l\'annonce:', error)
        setError(error.message || 'Une erreur est survenue lors du chargement de l\'annonce. Veuillez réessayer plus tard.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchAdDetails()
  }, [categorySlug, adSlug])

  const handleContactClick = () => {
    if (!currentUser) {
      toast.info('Vous devez être connecté pour contacter le vendeur')
      return
    }
    
    setShowContact(true)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement de l'annonce...</p>
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
    <div className="max-w-6xl mx-auto">
      {/* Fil d'Ariane */}
      <nav className="text-sm mb-6">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 hover:text-primary-600">Accueil</Link>
            <span className="mx-2 text-gray-500">/</span>
          </li>
          <li className="flex items-center">
            <Link to={`/${ad.categorySlug}`} className="text-gray-500 hover:text-primary-600">{ad.category}</Link>
            <span className="mx-2 text-gray-500">/</span>
          </li>
          <li className="flex items-center">
            <span className="text-gray-900">{ad.title}</span>
          </li>
        </ol>
      </nav>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2">
          {/* Galerie d'images */}
          <div className="mb-6">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={ad.images[0]} 
                alt={ad.title} 
                className="w-full h-96 object-cover"
              />
            </div>
            
            {ad.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {ad.images.slice(1).map((image, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${ad.title} - Image ${index + 2}`} 
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Titre et prix */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{ad.title}</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-1" />
                <span>{ad.location}</span>
              </div>
              <div className="text-2xl font-bold text-primary-600">
                {ad.price ? `${ad.price.toLocaleString('fr-BE')} €` : 'Prix non spécifié'}
              </div>
            </div>
          </div>
          
          {/* Caractéristiques */}
          {ad.features && Object.keys(ad.features).length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold mb-3">Caractéristiques</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(ad.features).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="ml-2 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 whitespace-pre-line">{ad.description}</p>
            </div>
          </div>
        </div>
        
        {/* Colonne latérale */}
        <div>
          {/* Carte du vendeur */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Informations sur le vendeur</h2>
            
            <div className="mb-4">
              <div className="font-medium text-lg">{seller.name}</div>
              <div className="text-gray-600 text-sm flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Membre depuis {new Date(seller.memberSince).toLocaleDateString('fr-BE', { year: 'numeric', month: 'long' })}
              </div>
            </div>
            
            {showContact ? (
              <div className="space-y-3">
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-600 mr-2" />
                  <a href={`tel:${seller.phone}`} className="text-primary-600 hover:underline">{seller.phone}</a>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-600 mr-2" />
                  <a href={`mailto:${seller.email}`} className="text-primary-600 hover:underline">{seller.email}</a>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleContactClick}
                className="btn btn-primary w-full"
              >
                Contacter le vendeur
              </button>
            )}
          </div>
          
          {/* Informations sur l'annonce */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Informations sur l'annonce</h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <TagIcon className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-700">ID: {ad.id}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-700">
                  Publiée le {new Date(ad.date).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-gray-600 hover:text-red-600 text-sm">
                Signaler cette annonce
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Annonces similaires */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Annonces similaires</h2>
        <p className="text-gray-600 italic">Aucune annonce similaire pour le moment.</p>
      </div>
    </div>
  )
}

export default AdDetailsPage