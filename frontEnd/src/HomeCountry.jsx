import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const countryData = [
  { id: '19', name: 'Абхазия', iso: 'ge' },
  { id: '9', name: 'Аргентина', iso: 'ar' },
  { id: '11', name: 'Германия', iso: 'de' },
  { id: '18', name: 'Египет', iso: 'eg' },
  { id: '12', name: 'Индия', iso: 'in' },
  { id: '27', name: 'Ирландия', iso: 'ie' },
  { id: '26', name: 'Исландия', iso: 'is' },
  { id: '10', name: 'Италия', iso: 'it' },
  { id: '8', name: 'Китай', iso: 'cn' },
  { id: '14', name: 'Мальдивы', iso: 'mv' },
  { id: '20', name: 'Мексика', iso: 'mx' },
  { id: '25', name: 'Норвегия', iso: 'no' },
  { id: '17', name: 'ОАЭ', iso: 'ae' },
  { id: '22', name: 'Португалия', iso: 'pt' },
  { id: '7', name: 'Россия', iso: 'ru' },
  { id: '13', name: 'Тайланд', iso: 'th' },
  { id: '15', name: 'Турция', iso: 'tr' },
  { id: '28', name: 'Франция', iso: 'fr' },
  { id: '24', name: 'Швейцария', iso: 'ch' },
  { id: '23', name: 'Швеция', iso: 'se' },
  { id: '16', name: 'Шри-Ланка', iso: 'lk' },
  { id: '21', name: 'Япония', iso: 'jp' },
];

function HomeCountry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const sortedCountries = countryData.sort((a, b) => a.name.localeCompare(b.name));
    setCountries(sortedCountries);
  }, []);

  const handleSelectCountry = (countryName) => {
    navigate(`/tours/${id}/${countryName}`);
  };

  // Навигация как в компоненте клиентов
  const navigateToFirst = () => setCurrentIndex(0);
  const navigateToPrev = () => setCurrentIndex(prev => Math.max(0, prev - 1));
  const navigateToNext = () => setCurrentIndex(prev => Math.min(countries.length - 1, prev + 1));
  const navigateToLast = () => setCurrentIndex(countries.length - 1);

  if (countries.length === 0) {
    return <div className="d-flex vh-100 bg-white justify-content-center align-items-center">Loading...</div>;
  }

  return (
    <div className='d-flex vh-100 bg-white justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <div className='d-flex justify-content-between mb-4'>
          <h2>Выберите страну</h2>
          <Link to="/" className='btn btn-primary'>Назад</Link>
        </div>

        {/* Карточка страны */}
        <div className='card mb-4'>
          <div className='card-body text-center'>
            <img
              src={`https://flagcdn.com/w320/${countries[currentIndex].iso}.png`}
              alt={`Флаг ${countries[currentIndex].name}`}
              className="img-fluid mb-3"
              style={{ maxHeight: '150px' }}
            />
            <h5 className='card-title'>{countries[currentIndex].name}</h5>
          </div>
        </div>

        {/* Кнопки навигации - такие же как у клиентов */}
        <div className='d-flex justify-content-center mb-4 gap-2'>
          <button 
            onClick={navigateToFirst}
            className='btn btn-outline-secondary'
            disabled={currentIndex === 0 || countries.length === 0}
            title="Первая страна"
          >
            |←
          </button>
          <button 
            onClick={navigateToPrev}
            className='btn btn-outline-secondary'
            disabled={currentIndex === 0 || countries.length === 0}
            title="Предыдущая"
          >
            ←
          </button>
          <button 
            onClick={navigateToNext}
            className='btn btn-outline-secondary'
            disabled={currentIndex === countries.length - 1 || countries.length === 0}
            title="Следующая"
          >
            →
          </button>
          <button 
            onClick={navigateToLast}
            className='btn btn-outline-secondary'
            disabled={currentIndex === countries.length - 1 || countries.length === 0}
            title="Последняя страна"
          >
            →|
          </button>
        </div>

        {/* Кнопка выбора */}
        <div className='d-flex justify-content-center'>
          <button
            onClick={() => handleSelectCountry(countries[currentIndex].name)}
            className='btn btn-success'
            disabled={countries.length === 0}
          >
            Выбрать
          </button>
        </div>

        {/* Горизонтальная полоса флагов */}
        <div className="mt-4 overflow-auto">
          <div className="d-flex flex-nowrap gap-2 py-2">
            {countries.map((country, index) => (
              <div 
                key={country.id} 
                className={`flex-shrink-0 cursor-pointer ${currentIndex === index ? 'border border-primary' : ''}`}
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={`https://flagcdn.com/w40/${country.iso}.png`}
                  alt={`Флаг ${country.name}`}
                  className="img-thumbnail"
                  style={{ width: '60px', height: '40px' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeCountry;