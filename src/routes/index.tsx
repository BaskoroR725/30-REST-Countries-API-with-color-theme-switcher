import { createRoute, Link } from "@tanstack/react-router";
import { useCountryStore } from "../store/useCountryStore";
import { Route as rootRoute } from "./__root";
import { Search, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeComponent,
});

function HomeComponent() {
  const {
    filteredCountries,
    searchQuery,
    setSearchQuery,
    regionFilter,
    setRegionFilter,
    fetchCountries,
    isLoading,
    error,
    countries,
  } = useCountryStore();

  const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

  useEffect(() => {
    if (countries.length === 0) {
      fetchCountries();
    }
  }, [fetchCountries, countries.length]);

  return (
    <div className="px-4 md:px-20 py-12">
      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12">
        {/* Search Input */}
        <div className="relative w-full md:max-w-[480px]">
          <Search
            className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
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
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-xl font-medium opacity-60">Loading countries...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-40 gap-4 text-red-500">
          <AlertCircle size={48} />
          <p className="text-xl font-medium">{error}</p>
          <button
            onClick={() => fetchCountries()}
            className="mt-4 px-6 py-2 bg-elements-light dark:bg-elements-dark shadow-md rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Countries Grid */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={searchQuery + regionFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="contents"
              >
                {filteredCountries.map((country) => (
                  <div key={country.alpha3Code}>
                    <Link
                      to="/country/$countryCode"
                      params={{ countryCode: country.alpha3Code }}
                      className="block h-full bg-elements-light dark:bg-elements-dark shadow-md rounded-md overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                    >
                      <img
                        src={country.flags.png}
                        alt={country.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-6 pb-10">
                        <h3 className="font-extrabold text-lg mb-4 truncate">
                          {country.name}
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-semibold">Population:</span>{" "}
                            {country.population.toLocaleString()}
                          </p>
                          <p>
                            <span className="font-semibold">Region:</span>{" "}
                            {country.region}
                          </p>
                          <p>
                            <span className="font-semibold">Capital:</span>{" "}
                            {country.capital || "N/A"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {filteredCountries.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl opacity-50">
                No countries found matching your criteria.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
