import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import axios from 'axios'
import { XMarkIcon, ExclamationTriangleIcon, PhotoIcon } from '@heroicons/react/24/solid'

// Context
import { useAuth } from '../contexts/AuthContext'

// Components
import LocationAutocomplete from '../components/forms/LocationAutocomplete'

// Services
import { annoncesService, categoriesService } from '../services/api'

const PublishAdPage = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!currentUser) {
      toast.info('Vous devez être connecté pour publier une annonce')
      navigate('/login', { state: { from: '/publier-annonce' } })
    }
  }, [currentUser, navigate])
  
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [brands, setBrands] = useState([])
  const [models, setModels] = useState([])
  const [serviceTypes, setServiceTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState([])
  
  // État pour les champs conditionnels
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true)
        
        // Utiliser le service API pour récupérer les catégories
        // Dans une implémentation réelle, nous utiliserions:
        // const categoriesData = await categoriesService.getAll()
        
        // Pour l'instant, nous utilisons des données fictives
        const categoriesData = [
          { id: 1, name: 'Immobilier', value: '1' },
          { id: 2, name: 'Véhicules', value: '2' },
          { id: 3, name: 'Emploi', value: '3' },
          { id: 4, name: 'Services', value: '4' },
          { id: 5, name: 'Multimédia', value: '5' },
          { id: 6, name: 'Maison', value: '6' }
        ]
        
        setCategories(categoriesData)
        setLoading(false)
      } catch (error) {
        console.error('Erreur lors du chargement des données du formulaire:', error)
        toast.error('Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.')
        setLoading(false)
      }
    }
    
    fetchFormData()
  }, [])
  
  // Charger les sous-catégories lorsqu'une catégorie est sélectionnée
  useEffect(() => {
    if (selectedCategory) {
      const fetchSubcategories = async () => {
        try {
          // Utiliser le service API pour récupérer les sous-catégories
          // Dans une implémentation réelle, nous utiliserions:
          // const subcategoriesData = await categoriesService.getSubcategories(selectedCategory)
          
          // Simuler le chargement des sous-catégories
          let subcategoriesData = []
          
          if (selectedCategory === '1') { // Immobilier
            subcategoriesData = [
              { id: 1, name: 'Appartements', value: '1' },
              { id: 2, name: 'Maisons', value: '2' },
              { id: 3, name: 'Terrains', value: '3' },
              { id: 4, name: 'Bureaux', value: '4' },
            ]
          } else if (selectedCategory === '2') { // Véhicules
            subcategoriesData = [
              { id: 5, name: 'Voitures', value: '5' },
              { id: 6, name: 'Motos', value: '6' },
              { id: 7, name: 'Utilitaires', value: '7' },
            ]
          } else if (selectedCategory === '3') { // Emploi
            subcategoriesData = [
              { id: 8, name: 'Offres d\'emploi', value: '8' },
              { id: 9, name: 'Demandes d\'emploi', value: '9' },
            ]
          }
          
          setSubcategories(subcategoriesData)
        } catch (error) {
          console.error('Erreur lors du chargement des sous-catégories:', error)
          toast.error('Erreur lors du chargement des sous-catégories. Veuillez réessayer.')
        }
      }
      
      fetchSubcategories()
    } else {
      setSubcategories([])
    }
  }, [selectedCategory])
  
  // Charger les marques lorsqu'une sous-catégorie de véhicules est sélectionnée
  useEffect(() => {
    if (selectedCategory === '2' && selectedSubcategory) {
      const fetchBrands = async () => {
        try {
          // Simuler le chargement des marques
          const brandsData = [
            { id: 1, name: 'Volkswagen', value: '1' },
            { id: 2, name: 'Renault', value: '2' },
            { id: 3, name: 'Peugeot', value: '3' },
            { id: 4, name: 'Toyota', value: '4' },
            { id: 5, name: 'BMW', value: '5' },
          ]
          
          setBrands(brandsData)
        } catch (error) {
          console.error('Erreur lors du chargement des marques:', error)
        }
      }
      
      fetchBrands()
    } else {
      setBrands([])
    }
  }, [selectedCategory, selectedSubcategory])
  
  // Charger les modèles lorsqu'une marque est sélectionnée
  useEffect(() => {
    if (selectedBrand) {
      const fetchModels = async () => {
        try {
          // Simuler le chargement des modèles
          let modelsData = []
          
          if (selectedBrand === '1') { // Volkswagen
            modelsData = [
              { id: 1, name: 'Golf', value: '1' },
              { id: 2, name: 'Polo', value: '2' },
              { id: 3, name: 'Passat', value: '3' },
            ]
          } else if (selectedBrand === '2') { // Renault
            modelsData = [
              { id: 4, name: 'Clio', value: '4' },
              { id: 5, name: 'Megane', value: '5' },
              { id: 6, name: 'Captur', value: '6' },
            ]
          }
          
          setModels(modelsData)
        } catch (error) {
          console.error('Erreur lors du chargement des modèles:', error)
        }
      }
      
      fetchModels()
    } else {
      setModels([])
    }
  }, [selectedBrand])
  
  // Charger les types de services si la catégorie Services est sélectionnée
  useEffect(() => {
    if (selectedCategory === '4') { // Services
      const fetchServiceTypes = async () => {
        try {
          // Simuler le chargement des types de services
          const serviceTypesData = [
            { id: 1, name: 'Plombier', value: '1' },
            { id: 2, name: 'Électricien', value: '2' },
            { id: 3, name: 'Maintenance informatique', value: '3' },
            { id: 4, name: 'Déménagement', value: '4' },
            { id: 5, name: 'Soin et Beauté', value: '5' },
          ]
          
          setServiceTypes(serviceTypesData)
        } catch (error) {
          console.error('Erreur lors du chargement des types de services:', error)
        }
      }
      
      fetchServiceTypes()
    } else {
      setServiceTypes([])
    }
  }, [selectedCategory])
  
  // Configuration de la dropzone pour les images avec prévisualisation améliorée
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': []
    },
    maxFiles: 5,
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      // Vérifier si le nombre total de fichiers ne dépasse pas 5
      if (uploadedFiles.length + acceptedFiles.length > 5) {
        toast.warning('Vous ne pouvez pas télécharger plus de 5 images')
        const allowedFiles = acceptedFiles.slice(0, 5 - uploadedFiles.length)
        
        const newFiles = allowedFiles.map(file => 
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
        
        setUploadedFiles(prev => [...prev, ...newFiles])
      } else {
        const newFiles = acceptedFiles.map(file => 
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
        
        setUploadedFiles(prev => [...prev, ...newFiles])
      }
    },
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(({ file, errors }) => {
        if (errors[0]?.code === 'file-too-large') {
          toast.error(`Le fichier ${file.name} est trop volumineux. Taille maximale: 5MB`)
        } else if (errors[0]?.code === 'file-invalid-type') {
          toast.error(`Le fichier ${file.name} n'est pas un format d'image valide`)
        } else {
          toast.error(`Erreur avec le fichier ${file.name}`)
        }
      })
    }
  })
  
  // Supprimer une image
  const removeFile = (index) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }
  
  // Schéma de validation Yup
  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Le titre est obligatoire')
      .min(5, 'Le titre doit contenir au moins 5 caractères')
      .max(100, 'Le titre ne doit pas dépasser 100 caractères'),
    description: Yup.string()
      .required('La description est obligatoire')
      .min(100, 'La description doit contenir au moins 100 caractères')
      .max(1000, 'La description ne doit pas dépasser 1000 caractères'),
    category: Yup.string()
      .required('La catégorie est obligatoire'),
    subcategory: Yup.string()
      .when('category', {
        is: (val) => val && val !== '',
        then: Yup.string().required('La sous-catégorie est obligatoire')
      }),
    price: Yup.number()
      .typeError('Le prix doit être un nombre')
      .required('Le prix est obligatoire')
      .min(0, 'Le prix ne peut pas être négatif'),
    location: Yup.object()
      .shape({
        id: Yup.number().required('La ville est obligatoire'),
        name: Yup.string().required('La ville est obligatoire')
      })
      .required('La ville est obligatoire')
  })
  
  // Gérer la soumission du formulaire
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Vérifier si l'utilisateur est connecté
      if (!currentUser) {
        toast.error('Vous devez être connecté pour publier une annonce')
        navigate('/login', { state: { from: '/publier-annonce' } })
        return
      }
      
      // Vérifier si au moins une image a été téléchargée
      if (uploadedFiles.length === 0) {
        toast.warning('Veuillez ajouter au moins une image à votre annonce')
        setSubmitting(false)
        return
      }
      
      // Préparer les données pour l'API
      const annonceData = {
        ...values,
        user_id: currentUser.id,
        ville_id: values.location.id,
        images: uploadedFiles
      }
      
      // Afficher un toast de chargement
      const loadingToast = toast.loading('Publication de votre annonce en cours...')
      
      // Dans une implémentation réelle, nous utiliserions le service API
      // Simuler un appel API réussi pour le moment
      // const response = await annoncesService.create(annonceData)
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mettre à jour le toast de chargement
      toast.update(loadingToast, {
        render: 'Votre annonce a été publiée avec succès!',
        type: 'success',
        isLoading: false,
        autoClose: 5000
      })
      
      // Nettoyer les prévisualisations d'images
      uploadedFiles.forEach(file => {
        URL.revokeObjectURL(file.preview)
      })
      
      resetForm()
      setUploadedFiles([])
      
      // Rediriger vers la page d'accueil après un court délai
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      console.error('Erreur lors de la publication de l\'annonce:', error)
      toast.error(error.response?.data?.message || 'Une erreur est survenue lors de la publication de votre annonce. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }
  
  // Si l'utilisateur n'est pas connecté, afficher un message
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Connexion requise</h1>
        <p className="text-lg text-gray-600 mb-6">Vous devez être connecté pour publier une annonce.</p>
        <Link to="/login" className="btn btn-primary px-6 py-3">
          Se connecter
        </Link>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Publier une annonce gratuite en Belgique</h1>
      <p className="text-gray-600 mb-6">Remplissez le formulaire ci-dessous pour publier votre annonce. Les champs marqués d'un astérisque (*) sont obligatoires.</p>
      
      {loading ? (
        <div className="text-center py-8">Chargement du formulaire...</div>
      ) : (
        <Formik
          initialValues={{
            title: '',
            description: '',
            category: '',
            subcategory: '',
            brand: '',
            model: '',
            color: '',
            energy: '',
            power: '',
            year: '',
            mileage: '',
            surface: '',
            furnished: '',
            serviceType: '',
            price: '',
            size: '',
            location: null
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form className="bg-white shadow-md rounded-lg p-6">
              {/* Message d'erreur général */}
              {Object.keys(errors).length > 0 && Object.keys(touched).some(key => touched[key]) && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  Veuillez corriger les erreurs dans le formulaire.
                </div>
              )}
              
              {/* Titre */}
              <div className="mb-6">
                <label htmlFor="title" className="form-label">Titre *</label>
                <Field 
                  type="text" 
                  id="title" 
                  name="title" 
                  className="form-input"
                  placeholder="Ex: Volkswagen Golf 5 essence à Bruxelles"
                />
                <ErrorMessage name="title" component="div" className="form-error" />
                <p className="text-xs text-gray-500 mt-1">
                  Un titre bien clair permet d'obtenir 15 fois plus de visites.
                </p>
              </div>
              
              {/* Localisation */}
              <div className="mb-6">
                <label htmlFor="location" className="form-label">Ville *</label>
                <LocationAutocomplete 
                  value={values.location}
                  onChange={(location) => setFieldValue('location', location)}
                />
                {errors.location && touched.location && (
                  <div className="form-error">{typeof errors.location === 'string' ? errors.location : 'La ville est obligatoire'}</div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Tapez le code postal ou le nom de la ville de votre annonce.
                </p>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="form-label">Description *</label>
                <Field 
                  as="textarea" 
                  id="description" 
                  name="description" 
                  className="form-input h-32"
                  placeholder="Décrivez votre annonce en détail..."
                />
                <ErrorMessage name="description" component="div" className="form-error" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <p>
                    Votre description doit avoir entre 100 et 1000 caractères.
                  </p>
                  <p>
                    {values.description.length} / 1000 caractères
                  </p>
                </div>
              </div>
              
              {/* Catégorie */}
              <div className="mb-6">
                <label htmlFor="category" className="form-label">Catégorie *</label>
                <Field 
                  as="select" 
                  id="category" 
                  name="category" 
                  className="form-input"
                  onChange={(e) => {
                    const { value } = e.target
                    setFieldValue('category', value)
                    setFieldValue('subcategory', '')
                    setFieldValue('brand', '')
                    setFieldValue('model', '')
                    setFieldValue('serviceType', '')
                    setSelectedCategory(value)
                    setSelectedSubcategory('')
                    setSelectedBrand('')
                  }}
                >
                  <option value="">Choisir une catégorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.value}>{category.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="div" className="form-error" />
              </div>
              
              {/* Sous-catégorie (conditionnelle) */}
              {subcategories.length > 0 && (
                <div className="mb-6">
                  <label htmlFor="subcategory" className="form-label">Sous-catégorie *</label>
                  <Field 
                    as="select" 
                    id="subcategory" 
                    name="subcategory" 
                    className="form-input"
                    onChange={(e) => {
                      const { value } = e.target
                      setFieldValue('subcategory', value)
                      setSelectedSubcategory(value)
                    }}
                  >
                    <option value="">Choisir une sous-catégorie</option>
                    {subcategories.map(subcategory => (
                      <option key={subcategory.id} value={subcategory.value}>{subcategory.name}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="subcategory" component="div" className="form-error" />
                </div>
              )}
              
              {/* Marque (conditionnelle pour les véhicules) */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <label htmlFor="brand" className="form-label">Marque</label>
                  <Field 
                    as="select" 
                    id="brand" 
                    name="brand" 
                    className="form-input"
                    onChange={(e) => {
                      const { value } = e.target
                      setFieldValue('brand', value)
                      setFieldValue('model', '')
                      setSelectedBrand(value)
                    }}
                  >
                    <option value="">Choisir une marque</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.value}>{brand.name}</option>
                    ))}
                  </Field>
                </div>
              )}
              
              {/* Modèle (conditionnelle pour les véhicules avec marque sélectionnée) */}
              {models.length > 0 && (
                <div className="mb-6">
                  <label htmlFor="model" className="form-label">Modèle</label>
                  <Field 
                    as="select" 
                    id="model" 
                    name="model" 
                    className="form-input"
                  >
                    <option value="">Choisir un modèle</option>
                    {models.map(model => (
                      <option key={model.id} value={model.value}>{model.name}</option>
                    ))}
                  </Field>
                </div>
              )}
              
              {/* Couleur (conditionnelle pour les véhicules) */}
              {selectedCategory === '2' && (
                <div className="mb-6">
                  <label htmlFor="color" className="form-label">Couleur</label>
                  <Field 
                    as="select" 
                    id="color" 
                    name="color" 
                    className="form-input"
                  >
                    <option value="">Choisir une couleur</option>
                    <option value="blanc">Blanc</option>
                    <option value="noir">Noir</option>
                    <option value="gris">Gris</option>
                    <option value="bleu">Bleu</option>
                    <option value="rouge">Rouge</option>
                    <option value="vert">Vert</option>
                    <option value="jaune">Jaune</option>
                    <option value="orange">Orange</option>
                    <option value="marron">Marron</option>
                    <option value="beige">Beige</option>
                  </Field>
                </div>
              )}
              
              {/* Énergie (conditionnelle pour les véhicules) */}
              {selectedCategory === '2' && (
                <div className="mb-6">
                  <label htmlFor="energy" className="form-label">Énergie</label>
                  <Field 
                    as="select" 
                    id="energy" 
                    name="energy" 
                    className="form-input"
                  >
                    <option value="">Choisir une énergie</option>
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="GPL">GPL</option>
                    <option value="Electrique">Électrique</option>
                    <option value="Hybride">Hybride</option>
                  </Field>
                </div>
              )}
              
              {/* Année (conditionnelle pour les véhicules) */}
              {selectedCategory === '2' && (
                <div className="mb-6">
                  <label htmlFor="year" className="form-label">Année</label>
                  <Field 
                    as="select" 
                    id="year" 
                    name="year" 
                    className="form-input"
                  >
                    <option value="">Choisir une année</option>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Field>
                </div>
              )}
              
              {/* Kilométrage (conditionnelle pour les véhicules) */}
              {selectedCategory === '2' && (
                <div className="mb-6">
                  <label htmlFor="mileage" className="form-label">Kilométrage</label>
                  <div className="flex items-center">
                    <Field 
                      type="text" 
                      id="mileage" 
                      name="mileage" 
                      className="form-input"
                      placeholder="Ex: 45000"
                    />
                    <span className="ml-2">KM</span>
                  </div>
                </div>
              )}
              
              {/* Surface (conditionnelle pour l'immobilier) */}
              {selectedCategory === '1' && (
                <div className="mb-6">
                  <label htmlFor="surface" className="form-label">Surface</label>
                  <div className="flex items-center">
                    <Field 
                      type="text" 
                      id="surface" 
                      name="surface" 
                      className="form-input"
                      placeholder="Ex: 85"
                    />
                    <span className="ml-2">m²</span>
                  </div>
                </div>
              )}
              
              {/* Meublé (conditionnelle pour l'immobilier) */}
              {selectedCategory === '1' && (
                <div className="mb-6">
                  <label className="form-label">Meublé</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <Field 
                        type="radio" 
                        name="furnished" 
                        value="T" 
                        className="mr-2"
                      />
                      Oui
                    </label>
                    <label className="inline-flex items-center">
                      <Field 
                        type="radio" 
                        name="furnished" 
                        value="F" 
                        className="mr-2"
                      />
                      Non
                    </label>
                  </div>
                </div>
              )}
              
              {/* Type de service (conditionnelle pour les services) */}
              {serviceTypes.length > 0 && (
                <div className="mb-6">
                  <label htmlFor="serviceType" className="form-label">Type de service</label>
                  <Field 
                    as="select" 
                    id="serviceType" 
                    name="serviceType" 
                    className="form-input"
                  >
                    <option value="">Choisir un type de service</option>
                    {serviceTypes.map(serviceType => (
                      <option key={serviceType.id} value={serviceType.value}>{serviceType.name}</option>
                    ))}
                  </Field>
                </div>
              )}
              
              {/* Prix */}
              <div className="mb-6">
                <label htmlFor="price" className="form-label">Prix *</label>
                <div className="flex items-center">
                  <Field 
                    type="text" 
                    id="price" 
                    name="price" 
                    className="form-input"
                    placeholder="Ex: 150"
                  />
                  <span className="ml-2">€</span>
                </div>
                <ErrorMessage name="price" component="div" className="form-error" />
              </div>
              
              {/* Taille (optionnelle) */}
              <div className="mb-6">
                <label htmlFor="size" className="form-label">Taille</label>
                <Field 
                  type="text" 
                  id="size" 
                  name="size" 
                  className="form-input"
                  placeholder="Ex: XL, 42, etc."
                />
              </div>
              
              {/* Photos */}
              <div className="mb-6">
                <label className="form-label">Photos</label>
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500'}`}
                >
                  <input {...getInputProps()} />
                  <PhotoIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  {isDragActive ? (
                    <p className="text-primary-600">Déposez les images ici...</p>
                  ) : (
                    <>
                      <p>Glissez et déposez des images ici, ou cliquez pour sélectionner des fichiers</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG ou GIF • 5 images maximum • 5MB max par image</p>
                    </>
                  )}
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">{uploadedFiles.length} image{uploadedFiles.length > 1 ? 's' : ''} téléchargée{uploadedFiles.length > 1 ? 's' : ''}</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={file.preview} 
                            alt={`Aperçu ${index + 1}`} 
                            className="h-24 w-full object-cover rounded-md border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Supprimer cette image"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Message d'aide pour les photos */}
                <p className="text-xs text-gray-500 mt-2">
                  Les annonces avec photos reçoivent jusqu'à 10 fois plus de visites. Ajoutez jusqu'à 5 photos de qualité.
                </p>
              </div>
              
              {/* Bouton de soumission */}
              <div className="mt-8">
                <button 
                  type="submit"
                  className={`btn w-full py-3 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publication en cours...
                    </>
                  ) : 'Publier mon annonce'}
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  En publiant cette annonce, vous acceptez nos <Link to="/conditions" className="text-primary-600 hover:underline">conditions d'utilisation</Link> et notre <Link to="/confidentialite" className="text-primary-600 hover:underline">politique de confidentialité</Link>.
                </p>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  )
}

export default PublishAdPage