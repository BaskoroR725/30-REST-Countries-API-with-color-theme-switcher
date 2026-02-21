import { createRoute } from '@tanstack/react-router';
import { useCountryStore } from '../store/useCountryStore';
import { Route as rootRoute } from './__root';
import { Search, ChevronDown } from 'lucide-react';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeComponent,
});

function HomeComponent() {
  const { filteredCountries, searchQuery, setSearchQuery, regionFilter, setRegionFilter } = useCountryStore();

  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  return (
    <div className="px-4 md:px-20 py-12">
      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12">
        {/* Search Input */}
        <div className="relative w-full md:max-w-[480px]">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for a country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-elements-light dark:bg-elements-dark shadow-md rounded-md py-4 pl-20 pr-8 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Region Filter */}
        <div className="relative w-full max-w-[200px]">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full appearance-none bg-elements-light dark:bg-elements-dark shadow-md rounded-md py-4 px-6 pr-12 font-semibold outline-none cursor-pointer"
          >
            <option value="">Filter by Region</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
        {filteredCountries.map((country) => (
          <div key={country.alpha3Code} className="bg-elements-light dark:bg-elements-dark shadow-md rounded-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300">
            <img src={country.flags.png} alt={country.name} className="w-full h-40 object-cover" />
            <div className="p-6 pb-10">
              <h3 className="font-extrabold text-lg mb-4 truncate">{country.name}</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
                <p><span className="font-semibold">Region:</span> {country.region}</p>
                <p><span className="font-semibold">Capital:</span> {country.capital || 'N/A'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCountries.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl opacity-50">No countries found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}