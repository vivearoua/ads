import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

// Context
import { useAuth } from '../contexts/AuthContext'

const LoginPage = () => {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loginError, setLoginError] = useState(null)
  
  // Rediriger vers la page précédente après connexion si applicable
  const from = location.state?.from || '/'
  
  // Schéma de validation
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Adresse email invalide')
      .required('L\'email est obligatoire'),
    password: Yup.string()
      .required('Le mot de passe est obligatoire')
  })
  
  // Gérer la soumission du formulaire
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoginError(null)
      await login(values.email, values.password)
      
      toast.success('Connexion réussie!')
      
      // Rediriger vers la page précédente ou la page d'accueil
      navigate(from)
    } catch (error) {
      console.error('Erreur de connexion:', error)
      setLoginError(error.response?.data?.message || 'Email ou mot de passe incorrect')
      toast.error('Échec de la connexion')
    } finally {
      setSubmitting(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Connexion</h1>
      
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white shadow-md rounded-lg p-6">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {loginError}
              </div>
            )}
            
            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="form-label">Email</label>
              <Field 
                type="email" 
                id="email" 
                name="email" 
                className="form-input"
                placeholder="votre@email.com"
              />
              <ErrorMessage name="email" component="div" className="form-error" />
            </div>
            
            {/* Mot de passe */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="form-label">Mot de passe</label>
                <Link to="/mot-de-passe-oublie" className="text-sm text-primary-600 hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
              <Field 
                type="password" 
                id="password" 
                name="password" 
                className="form-input"
                placeholder="Votre mot de passe"
              />
              <ErrorMessage name="password" component="div" className="form-error" />
            </div>
            
            {/* Bouton de connexion */}
            <div className="mb-6">
              <button 
                type="submit"
                className={`btn w-full py-3 ${isSubmitting || loading ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'}`}
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : 'Se connecter'}
              </button>
            </div>
            
            {/* Lien d'inscription */}
            <div className="text-center text-sm">
              Pas encore de compte? <Link to="/register" className="text-primary-600 hover:underline">Créer un compte</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default LoginPage