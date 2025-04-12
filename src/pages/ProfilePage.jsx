import React, { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

// Context
import { useAuth } from '../contexts/AuthContext'

const ProfilePage = () => {
  const { id } = useParams()
  const { currentUser, updateProfile, logout, loading } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Dans une implémentation réelle, nous ferions un appel API
        // Pour l'instant, nous utilisons les données de l'utilisateur connecté
        if (currentUser && currentUser.id === parseInt(id)) {
          // Simuler un délai réseau
          await new Promise(resolve => setTimeout(resolve, 500))
          
          setProfileData({
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            phone: currentUser.phone || '',
            createdAt: currentUser.createdAt || new Date().toISOString()
          })
        } else {
          setError('Vous n\'avez pas accès à ce profil')
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error)
        setError('Une erreur est survenue lors du chargement du profil')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProfileData()
  }, [currentUser, id])
  
  // Schéma de validation
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required('Le prénom est obligatoire')
      .min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: Yup.string()
      .required('Le nom est obligatoire')
      .min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: Yup.string()
      .email('Adresse email invalide')
      .required('L\'email est obligatoire'),
    phone: Yup.string()
      .matches(/^(\+?[0-9]{9,15})?$/, 'Numéro de téléphone invalide')
  })
  
  // Gérer la soumission du formulaire
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Préparer les données pour l'API
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone
      }
      
      // Mettre à jour le profil
      await updateProfile(userData)
      
      toast.success('Profil mis à jour avec succès!')
      
      // Mettre à jour les données locales
      setProfileData(prev => ({ ...prev, ...userData }))
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      toast.error('Échec de la mise à jour du profil')
    } finally {
      setSubmitting(false)
    }
  }
  
  // Gérer la déconnexion
  const handleLogout = () => {
    logout()
    toast.info('Vous avez été déconnecté')
  }
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!currentUser) {
    return <Navigate to="/login" />
  }
  
  // Si l'ID dans l'URL ne correspond pas à l'ID de l'utilisateur connecté
  if (currentUser && currentUser.id !== parseInt(id)) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
        <p className="text-lg text-gray-600 mb-6">Vous n'avez pas accès à ce profil.</p>
      </div>
    )
  }
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement du profil...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Erreur</h1>
        <p className="text-lg text-gray-600 mb-6">{error}</p>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mon profil</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations personnelles</h2>
          
          <Formik
            initialValues={{
              firstName: profileData?.firstName || '',
              lastName: profileData?.lastName || '',
              email: profileData?.email || '',
              phone: profileData?.phone || ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Prénom */}
                  <div>
                    <label htmlFor="firstName" className="form-label">Prénom</label>
                    <Field 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      className="form-input"
                    />
                    <ErrorMessage name="firstName" component="div" className="form-error" />
                  </div>
                  
                  {/* Nom */}
                  <div>
                    <label htmlFor="lastName" className="form-label">Nom</label>
                    <Field 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      className="form-input"
                    />
                    <ErrorMessage name="lastName" component="div" className="form-error" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="form-label">Email</label>
                    <Field 
                      type="email" 
                      id="email" 
                      name="email" 
                      className="form-input"
                    />
                    <ErrorMessage name="email" component="div" className="form-error" />
                  </div>
                  
                  {/* Téléphone */}
                  <div>
                    <label htmlFor="phone" className="form-label">Téléphone (optionnel)</label>
                    <Field 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      className="form-input"
                      placeholder="+32 XXX XX XX XX"
                    />
                    <ErrorMessage name="phone" component="div" className="form-error" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className={`btn btn-primary ${isSubmitting || loading ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting || loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mise à jour...
                      </>
                    ) : 'Enregistrer les modifications'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mes annonces</h2>
          
          <p className="text-gray-600 italic">Vous n'avez pas encore publié d'annonces.</p>
          
          <div className="mt-4">
            <a href="/publier-annonce" className="text-primary-600 hover:underline">
              Publier une annonce
            </a>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sécurité</h2>
          
          <div className="space-y-4">
            <div>
              <a href="/changer-mot-de-passe" className="text-primary-600 hover:underline">
                Changer mon mot de passe
              </a>
            </div>
            
            <div>
              <button 
                onClick={handleLogout}
                className="text-red-600 hover:underline"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage