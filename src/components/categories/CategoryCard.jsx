import React from 'react'
import { Link } from 'react-router-dom'

const CategoryCard = ({ category }) => {
  const { name, slug, icon, count } = category

  return (
    <Link 
      to={`/${slug}`}
      className="card p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="font-semibold text-gray-900">{name}</h3>
      <p className="text-sm text-gray-500">{count} annonces</p>
    </Link>
  )
}

export default CategoryCard