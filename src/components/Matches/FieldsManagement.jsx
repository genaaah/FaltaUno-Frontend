import React, { useState, useEffect } from 'react';
import { fieldsService } from "../../services/fieldsService";
import { sweetAlert } from "../../utils/sweetAlert";
import { useAuth } from "../../context/AuthContext";

const LoadingSpinner = ({ text = "Cargando..." }) => (
  <div className="text-center py-8">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    <p className="mt-2 text-gray-500">{text}</p>
  </div>
);

const AddIcon = () => (
  <svg className="w-5 h-5 mr-2 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
  </svg>
);

const FieldsManagement = () => {
  const { user } = useAuth();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({ nombre: '' });
  const [formErrors, setFormErrors] = useState({});

  const isAdmin = user?.rol === 'admin'

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      setLoading(true);
      const data = await fieldsService.getAllFields();
      console.log('Datos recibidos del backend:', data); // Para debug
      if (data && data.length > 0) {
        console.log('Primer campo recibido:', data[0]); // Para debug
        console.log('Campos disponibles en el primer objeto:', Object.keys(data[0])); // Para debug
      }
      setFields(data);
    } catch (error) {
      sweetAlert.error('Error', 'No se pudieron cargar las canchas');
      console.error('Error loading fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFieldDate = (field) => {
    if (!field || typeof field !== 'object') {
      return 'Fecha no disponible';
    }

    const possibleDateFields = [
      'creado_en',
      'creadoEn',
      'createdAt',
      'fecha_creacion',
      'fechaCreacion',
      'creado',
      'fecha_creado',
      'fechaCreado',
      'created_at',
      'creadoEn',
      'creado_en',
      'date_created',
      'dateCreated'
    ];

    let dateValue = null;
    
    for (const fieldName of possibleDateFields) {
      if (field[fieldName] !== undefined && field[fieldName] !== null) {
        dateValue = field[fieldName];
        console.log(`Encontrada fecha en campo "${fieldName}":`, dateValue);
        break;
      }
    }

    if (!dateValue && field.creado) {
      if (typeof field.creado === 'object') {
        dateValue = field.creado.en || field.creado.at || field.creado.date;
      } else {
        dateValue = field.creado;
      }
    }

    if (!dateValue) {
      console.log('No se encontró campo de fecha. Objeto completo:', field);
      return 'Fecha no disponible';
    }

    try {
      const date = new Date(dateValue);
      
      if (isNaN(date.getTime())) {
        console.log('Fecha inválida recibida:', dateValue);
        
        const alternativeFormats = [
          dateValue,
          dateValue.replace(' ', 'T') + 'Z',
          dateValue + 'T00:00:00',
          dateValue + 'T00:00:00Z',
          dateValue.split('T')[0]
        ];
        
        for (const format of alternativeFormats) {
          const testDate = new Date(format);
          if (!isNaN(testDate.getTime())) {
            return testDate.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          }
        }
        
        return 'Fecha inválida';
      }
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formateando fecha:', dateValue, error);
      return 'Error en fecha';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (editingField) {
        await fieldsService.updateField(editingField.id, formData.nombre);
        sweetAlert.success('¡Éxito!', 'Cancha actualizada correctamente');
      } else {
        await fieldsService.createField(formData.nombre);
        sweetAlert.success('¡Éxito!', 'Cancha creada correctamente');
      }
      loadFields();
      handleCloseModal();
    } catch (error) {
      sweetAlert.error('Error', error.userMessage || error.message || 'Error al guardar la cancha');
    }
  };

  const handleEdit = (field) => {
    setEditingField(field);
    setFormData({ nombre: field.nombre });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, nombre) => {
    const result = await sweetAlert.confirm(
      'Eliminar Cancha',
      `¿Estás seguro de que deseas eliminar la cancha "${nombre}"?`,
      'eliminar'
    );
    
    if (result.isConfirmed) {
      try {
        await fieldsService.deleteField(id);
        sweetAlert.success('¡Éxito!', 'Cancha eliminada correctamente');
        loadFields();
      } catch (error) {
        sweetAlert.error('Error', error.userMessage || error.message || 'Error al eliminar la cancha');
      }
    }
  };

  const handleOpenModal = () => {
    setEditingField(null);
    setFormData({ nombre: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingField(null);
    setFormData({ nombre: '' });
    setFormErrors({});
  };

  const cardStyles = "bg-white shadow overflow-hidden rounded-lg";
  const buttonStyles = "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out";
  const actionButtonStyles = "inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <LoadingSpinner text="Verificando permisos..." />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <svg className="mx-auto h-16 w-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-red-800 mt-4 mb-2">Acceso Restringido</h2>
            <p className="text-red-600 mb-4">Solo los administradores pueden gestionar canchas.</p>
            <div className="mt-6">
              <p className="text-gray-600 text-sm">Tu perfil: <span className="font-medium">{user?.email || 'No autenticado'}</span></p>
              <p className="text-gray-600 text-sm">Rol: <span className="font-medium">{user?.rol || user?.role || 'No definido'}</span></p>
            </div>
            <div className="mt-6">
              <a 
                href="/" 
                className={buttonStyles}
              >
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Canchas</h1>
            <p className="mt-2 text-gray-600">Administra las canchas disponibles para los partidos</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <p className="text-sm text-gray-500">
              Administrador: <span className="font-medium">{user?.nombre} {user?.apellido}</span>
            </p>
          </div>
        </div>
        <div className="mb-6 ">
          <button
            onClick={handleOpenModal}
            className={buttonStyles}
          >
            <AddIcon />
            Nueva Cancha
          </button>
        </div>
        <div className={cardStyles}>
          {loading ? (
            <LoadingSpinner text="Cargando canchas..." />
          ) : fields.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay canchas registradas</h3>
              <p className="mt-1 text-sm text-gray-500">Comienza creando tu primera cancha.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th scope="col" className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Creación
                    </th>
                    <th scope="col" className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fields.map((field) => (
                    <tr key={field.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-500 font-mono">
                        #{field.id}
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-green-400 mr-3 flex-shrink-0"></div>
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none">
                            {field.nombre}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-500">
                        {formatFieldDate(field)}
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(field)}
                            className={`${actionButtonStyles} text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500`}
                          >
                            <EditIcon />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(field.id, field.nombre)}
                            className={`${actionButtonStyles} text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500`}
                          >
                            <DeleteIcon />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingField ? 'Editar Cancha' : 'Nueva Cancha'}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4">
                <div className="mb-6">
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Cancha *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={`block w-full px-3 sm:px-4 py-2.5 border ${formErrors.nombre ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 text-sm transition duration-150 ease-in-out`}
                    placeholder="Ej: Cancha Principal"
                    autoFocus
                  />
                  {formErrors.nombre && (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {formErrors.nombre}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Mínimo 3 caracteres.
                  </p>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="inline-flex justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out order-2 sm:order-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out order-1 sm:order-2"
                  >
                    {editingField ? 'Actualizar' : 'Crear Cancha'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className={cardStyles}>
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total de Canchas
              </dt>
              <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">
                {fields.length}
              </dd>
            </div>
          </div>
          <div className={cardStyles}>
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Administrador
              </dt>
              <dd className="mt-1 text-base sm:text-lg font-semibold text-gray-900 truncate">
                {user?.nombre} {user?.apellido}
              </dd>
            </div>
          </div>
          <div className={cardStyles}>
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Última actualización
              </dt>
              <dd className="mt-1 text-base sm:text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldsManagement;