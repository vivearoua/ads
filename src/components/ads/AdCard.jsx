import React from 'react'
import { Link } from 'react-router-dom'

const AdCard = ({ ad }) => {
  const {
    id,
    title,
    description,
    price,
    location,
    category,
    subcategory,
    image,
    date,
    slug
  } = ad

  // Formater la date
  const formattedDate = new Date(date).toLocaleDateString('fr-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  // Formater le prix
  const formattedPrice = price !== null
    ? `${price.toLocaleString('fr-BE')} €`
    : 'Prix non spécifié'

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <Link to={`/${category.toLowerCase()}/${slug}`}>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link 
            to={`/${category.toLowerCase()}/${slug}`}
            className="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-2"
          >
            {title}
          </Link>
          <span className="font-bold text-primary-600">{formattedPrice}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
          <div className="text-gray-500">{formattedDate}</div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <Link 
            to={`/${category.toLowerCase()}`}
            className="text-xs bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full hover:bg-secondary-200"
          >
            {category}
          </Link>
          {subcategory && (
            <Link 
              to={`/${category.toLowerCase()}/${subcategory.toLowerCase()}`}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full hover:bg-gray-200"
            >
              {subcategory}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdCard