import React, { useState, useEffect } from 'react'
import axios from 'axios'

const LocationAutocomplete = ({ value, onChange }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Initialiser le champ de recherche avec la valeur existante
  useEffect(() => {
    if (value && value.name) {
      setQuery(value.name)
    }
  }, [value])

  // Fonction pour rechercher les villes
  const searchLocations = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([])
      return
    }

    try {
      setIsLoading(true)
      
      // Dans une implémentation réelle, nous ferions un appel API
      // Pour l'instant, nous simulons avec des données fictives
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Données fictives de villes belges
      const mockCities = [
        { id: 1, name: 'Bruxelles', postal_code: '1000' },
        { id: 2, name: 'Anvers', postal_code: '2000' },
        { id: 3, name: 'Gand', postal_code: '9000' },
        { id: 4, name: 'Charleroi', postal_code: '6000' },
        { id: 5, name: 'Liège', postal_code: '4000' },
        { id: 6, name: 'Bruges', postal_code: '8000' },
        { id: 7, name: 'Namur', postal_code: '5000' },
        { id: 8, name: 'Louvain', postal_code: '3000' },
        { id: 9, name: 'Mons', postal_code: '7000' },
        { id: 10, name: 'Wavre', postal_code: '1300' },
        { id: 11, name: 'Tournai', postal_code: '7500' },
        { id: 12, name: 'Hasselt', postal_code: '3500' },
        { id: 13, name: 'Arlon', postal_code: '6700' },
        { id: 14, name: 'Ostende', postal_code: '8400' },
        { id: 15, name: 'Malines', postal_code: '2800' }
      ]
      
      // Filtrer les villes qui correspondent à la recherche
      const filteredCities = mockCities.filter(city => {
        const cityName = city.name.toLowerCase()
        const postalCode = city.postal_code
        const searchLower = searchQuery.toLowerCase()
        
        return cityName.includes(searchLower) || postalCode.includes(searchQuery)
      })
      
      setResults(filteredCities)
    } catch (error) {
      console.error('Erreur lors de la recherche de villes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Gérer le changement dans le champ de recherche
  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setShowResults(true)
    searchLocations(value)
  }

  // Sélectionner une ville
  const handleSelectLocation = (location) => {
    onChange(location)
    setQuery(`${location.postal_code} ${location.name}`)
    setShowResults(false)
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowResults(true)}
        className="form-input w-full"
        placeholder="Entrez un code postal ou une ville"
        autoComplete="off"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-3">
          <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      
      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {results.map(location => (
              <li
                key={location.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectLocation(location)}
              >
                <span className="font-medium">{location.postal_code}</span> {location.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {showResults && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <p className="px-4 py-2 text-gray-500">Aucune ville trouvée</p>
        </div>
      )}
    </div>
  )
}

export default LocationAutocomplete