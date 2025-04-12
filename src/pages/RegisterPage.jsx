import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

// Context
import { useAuth } from '../contexts/AuthContext'

const RegisterPage = () => {
  const { register, login, loading } = useAuth()
  const navigate = useNavigate()
  const [registerError, setRegisterError] = useState(null)
  
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
    password: Yup.string()
      .required('Le mot de passe est obligatoire')
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
        'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
      .required('La confirmation du mot de passe est obligatoire'),
    terms: Yup.boolean()
      .oneOf([true], 'Vous devez accepter les conditions d\'utilisation')
  })
  
  // Gérer la soumission du formulaire
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setRegisterError(null)
      
      // Préparer les données pour l'API
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password
      }
      
      // Enregistrer l'utilisateur
      await register(userData)
      
      toast.success('Compte créé avec succès!')
      
      // Connecter automatiquement l'utilisateur
      await login(values.email, values.password)
      
      // Rediriger vers la page d'accueil
      navigate('/')
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
      setRegisterError(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription')
      toast.error('Échec de l\'inscription')
    } finally {
      setSubmitting(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Créer un compte</h1>
      
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          terms: false
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white shadow-md rounded-lg p-6">
            {registerError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {registerError}
              </div>
            )}
            
            {/* Prénom */}
            <div className="mb-6">
              <label htmlFor="firstName" className="form-label">Prénom</label>
              <Field 
                type="text" 
                id="firstName" 
                name="firstName" 
                className="form-input"
                placeholder="Votre prénom"
              />
              <ErrorMessage name="firstName" component="div" className="form-error" />
            </div>
            
            {/* Nom */}
            <div className="mb-6">
              <label htmlFor="lastName" className="form-label">Nom</label>
              <Field 
                type="text" 
                id="lastName" 
                name="lastName" 
                className="form-input"
                placeholder="Votre nom"
              />
              <ErrorMessage name="lastName" component="div" className="form-error" />
            </div>
            
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
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <Field 
                type="password" 
                id="password" 
                name="password" 
                className="form-input"
                placeholder="Votre mot de passe"
              />
              <ErrorMessage name="password" component="div" className="form-error" />
              <p className="text-xs text-gray-500 mt-1">
                Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre.
              </p>
            </div>
            
            {/* Confirmation du mot de passe */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
              <Field 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                className="form-input"
                placeholder="Confirmez votre mot de passe"
              />
              <ErrorMessage name="confirmPassword" component="div" className="form-error" />
            </div>
            
            {/* Conditions d'utilisation */}
            <div className="mb-6">
              <label className="flex items-center">
                <Field 
                  type="checkbox" 
                  name="terms" 
                  className="mr-2"
                />
                <span className="text-sm">
                  J'accepte les <Link to="/conditions" className="text-primary-600 hover:underline">conditions d'utilisation</Link> et la <Link to="/confidentialite" className="text-primary-600 hover:underline">politique de confidentialité</Link>
                </span>
              </label>
              <ErrorMessage name="terms" component="div" className="form-error" />
            </div>
            
            {/* Bouton d'inscription */}
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
                    Inscription en cours...
                  </>
                ) : 'Créer un compte'}
              </button>
            </div>
            
            {/* Lien de connexion */}
            <div className="text-center text-sm">
              Déjà un compte? <Link to="/login" className="text-primary-600 hover:underline">Se connecter</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default RegisterPage