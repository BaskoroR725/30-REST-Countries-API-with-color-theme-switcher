import { createRoute } from "@tanstack/react-router";
import { useCountryStore } from "../store/useCountryStore";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeComponent,
});

function HomeComponent() {
  const filteredCountries = useCountryStore((state) => state.filteredCountries);

  return (
    <div className="px-4 md:px-20 py-8">
      <h2 className="text-xl mb-4">
        Total Countries: {filteredCountries.length}
      </h2>
      {/* Search dan Filter akan kita buat di sini nanti */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {filteredCountries.slice(0, 8).map((country) => (
          <div
            key={country.alpha3Code}
            className="bg-elements-light dark:bg-elements-dark shadow-md rounded-md overflow-hidden"
          >
            <img
              src={country.flags.png}
              alt={country.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-6">
              <h3 className="font-extrabold text-lg mb-4">{country.name}</h3>
              <p>
                <span className="font-semibold">Population:</span>{" "}
                {country.population.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Region:</span> {country.region}
              </p>
              <p>
                <span className="font-semibold">Capital:</span>{" "}
                {country.capital}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
