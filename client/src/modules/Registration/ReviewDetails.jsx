import React, { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { mode } from '../../store/atom'; // Importing the mode atom for dark mode
import RegistrationContext from './RegistrationContext';
import { notify } from '../common/notification';
import { useNavigate } from 'react-router-dom';

const btnDivStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '5px',
};

const renderFields = (key, value, dark) => {
  if (
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0) ||
    (typeof value === 'string' && key === 'password') ||
    key === 'confirmPassword'
  ) {
    return null; // Don't render empty fields
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    return (
      <div key={key}>
        {Object.entries(value).map(([nestedKey, nestedValue]) =>
          renderFields(nestedKey, nestedValue, dark),
        )}
      </div>
    );
  } else if (Array.isArray(value)) {
    return (
      <div key={key}>
        <h3 className={`font-bold mb-1 ${dark === 'dark' ? 'text-yellow-400' : 'text-gray-700'}`}>
          {`${key.charAt(0).toUpperCase() + key.slice(1)}:`}
        </h3>
        {value.map((item) => (
          <h3 key={key} className={`ml-1 mb-1 ${dark === 'dark' ? 'text-yellow-400' : 'text-gray-500'}`}>
            {`${item}`}
          </h3>
        ))}
      </div>
    );
  } else {
    return (
      <h1 className={`mb-2 font-bold ${dark === 'dark' ? 'text-yellow-400' : 'text-gray-700'}`}>
        {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
      </h1>
    );
  }
};

function ReviewDetails() {
  const { basicDetails, otherDetails, prevStep } = useContext(RegistrationContext);
  const navigate = useNavigate();
  const dark = useRecoilValue(mode); // Using Recoil state for dark mode

  const handleRegister = async (e) => {
    e.preventDefault();

    const endpoint = 'https://medi-connect-f671.onrender.com/auth/register';
    const payload = { ...basicDetails, ...otherDetails };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        notify('Registration successful', 'success');
        navigate('/login');
      } else {
        notify(data.message || 'An error occurred. Please try again.', 'warn');
      }
    } catch (error) {
      notify('Error connecting to the server', 'error');
      console.error('Network Error:', error);
    }
  };

  return (
    <>
      <div className={`row ${dark === 'dark' ? 'bg-gray-900 text-yellow-400' : 'bg-white text-gray-700'} p-4 rounded-md`}>
        <div className="col-md-6">
          {Object.entries(basicDetails).map(([key, value]) =>
            renderFields(key, value, dark),
          )}
        </div>
        <div className="col-md-6">
          {Object.entries(otherDetails).map(([key, value]) =>
            renderFields(key, value, dark),
          )}
        </div>
      </div>
      <div className="row w-100 mt-2">
        <div style={btnDivStyle}>
          <button
            type="button"
            className={`auth-button ${dark === 'dark' ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
            onClick={prevStep}
          >
            Back
          </button>
          <button
            type="button"
            className={`auth-button ${dark === 'dark' ? 'bg-yellow-400 text-gray-900' : 'bg-blue-600 text-white'}`}
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
}

export default ReviewDetails;
