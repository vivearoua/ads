import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Papa from 'papaparse';

// Context
import { useAuth } from '../contexts/AuthContext';

const ImportCSVPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Vérifier l'extension du fichier
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Veuillez sélectionner un fichier CSV valide');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Lire et parser le fichier CSV
    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Erreur lors de la lecture du fichier CSV');
          return;
        }
        setPreviewData(results.data.slice(0, 5)); // Afficher seulement les 5 premières lignes
      },
      error: (error) => {
        setError('Erreur lors de la lecture du fichier CSV');
      }
    });
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      toast.info('Vous devez être connecté pour importer des annonces');
      navigate('/login');
      return;
    }

    if (!file) {
      setError('Veuillez sélectionner un fichier CSV');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Dans une implémentation réelle, nous enverrions le fichier à l'API
      // Pour l'instant, nous simulons un délai réseau
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Les annonces ont été importées avec succès!');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      setError('Une erreur est survenue lors de l\'importation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Importer des annonces depuis un fichier CSV</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionnez un fichier CSV
          </label>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          <p className="mt-1 text-sm text-gray-500">
            Le fichier CSV doit contenir les colonnes: titre, description, prix, localisation, catégorie, etc.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {previewData.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Aperçu des données</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(previewData[0]).map((key) => (
                      <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((value, j) => (
                        <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading || !file}
          className={`btn w-full py-3 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'}`}
        >
          {isLoading ? 'Importation en cours...' : 'Importer les annonces'}
        </button>
      </div>
    </div>
  );
};

export default ImportCSVPage;