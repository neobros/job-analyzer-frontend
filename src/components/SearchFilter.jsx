import { useEffect, useMemo, useState } from 'react';
import { Briefcase, Globe2, MapPin, SlidersHorizontal, Tags } from 'lucide-react';
import { apiRequest } from '../api.js';
import CustomSelect from './CustomSelect.jsx';

export default function SearchFilter({ compact = false, filters, onFiltersChange }) {
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [localFilters, setLocalFilters] = useState({ keyword: '', category: '', country: '', city: '' });
  const currentFilters = filters || localFilters;

  useEffect(() => {
    Promise.all([apiRequest('/locations'), apiRequest('/categories')])
      .then(([locationData, categoryData]) => {
        setLocations(locationData);
        setCategories(categoryData);
      })
      .catch(() => {
        setLocations([]);
        setCategories([]);
      });
  }, []);

  const cities = useMemo(() => {
    return locations.find((location) => location.country === currentFilters.country)?.cities || [];
  }, [currentFilters.country, locations]);

  function updateFilter(name, value) {
    const nextFilters = {
      ...currentFilters,
      [name]: value,
      ...(name === 'country' ? { city: '' } : {})
    };

    if (onFiltersChange) onFiltersChange(nextFilters);
    else setLocalFilters(nextFilters);
  }

  return (
    <form className={`search-filter ${compact ? 'compact' : ''}`}>
      <label>
        <Briefcase size={18} />
        <input value={currentFilters.keyword || ''} onChange={(event) => updateFilter('keyword', event.target.value)} placeholder="Job title, gig, or skill" />
      </label>
      <CustomSelect
        icon={Tags}
        value={currentFilters.category || ''}
        placeholder="Category"
        options={categories.map((category) => ({ value: category.name, label: category.name }))}
        onChange={(value) => updateFilter('category', value)}
      />
      <CustomSelect
        icon={Globe2}
        value={currentFilters.country || ''}
        placeholder="Country"
        options={locations.map((location) => ({ value: location.country, label: location.country }))}
        onChange={(value) => updateFilter('country', value)}
      />
      <CustomSelect
        icon={MapPin}
        value={currentFilters.city || ''}
        placeholder={currentFilters.country ? 'City' : 'Choose country first'}
        disabled={!currentFilters.country}
        options={cities.map((item) => ({ value: item.name, label: item.name }))}
        onChange={(value) => updateFilter('city', value)}
      />
      <button className="primary-button" type="button"><SlidersHorizontal size={17} /> Search</button>
    </form>
  );
}
