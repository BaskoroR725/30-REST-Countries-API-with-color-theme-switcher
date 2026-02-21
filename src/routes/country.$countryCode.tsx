import {
  createRoute,
  Link,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { useCountryStore } from "../store/useCountryStore";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/country/$countryCode",
  component: CountryDetailComponent,
});

function CountryDetailComponent() {
  const { countryCode } = useParams({ from: Route.fullPath });
  const navigate = useRouter().history.back;
  const { countries, fetchCountries, isLoading } = useCountryStore();

  useEffect(() => {
    if (countries.length === 0) {
      fetchCountries();
    }
  }, [countries.length, fetchCountries]);

  const country = countries.find((c) => c.alpha3Code === countryCode);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-xl font-medium opacity-60">
          Loading country details...
        </p>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Country not found.</h2>
        <Link to="/" className="text-blue-500 hover:underline">
          Go back to home
        </Link>
      </div>
    );
  }

  // Helper untuk mencari nama negara berdasarkan border code
  const getCountryName = (code: string) => {
    return countries.find((c) => c.alpha3Code === code)?.name || code;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="px-4 md:px-20 py-10 md:py-20"
    >
      <button
        onClick={() => navigate()}
        className="flex items-center gap-3 bg-elements-light dark:bg-elements-dark shadow-[0_0_10px_rgba(0,0,0,0.1)] px-8 py-2 rounded-md mb-16 hover:shadow-md transition-all active:scale-95"
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          src={country.flags.png}
          alt={country.name}
          className="w-full shadow-lg rounded-sm"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8">
            {country.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Native Name:</span>{" "}
                {country.nativeName}
              </p>
              <p>
                <span className="font-semibold">Population:</span>{" "}
                {country.population.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Region:</span> {country.region}
              </p>
              <p>
                <span className="font-semibold">Sub Region:</span>{" "}
                {country.subregion}
              </p>
              <p>
                <span className="font-semibold">Capital:</span>{" "}
                {country.capital || "N/A"}
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <span className="font-semibold">Top Level Domain:</span>{" "}
                {country.topLevelDomain.join(", ")}
              </p>
              <p>
                <span className="font-semibold">Currencies:</span>{" "}
                {country.currencies?.map((c) => c.name).join(", ")}
              </p>
              <p>
                <span className="font-semibold">Languages:</span>{" "}
                {country.languages.map((l) => l.name).join(", ")}
              </p>
            </div>
          </div>

          {country.borders && country.borders.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className="font-semibold whitespace-nowrap">
                Border Countries:
              </span>
              <div className="flex flex-wrap gap-2">
                {country.borders.map((border, index) => (
                  <motion.div
                    key={border}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                  >
                    <Link
                      to="/country/$countryCode"
                      params={{ countryCode: border }}
                      className="inline-block bg-elements-light dark:bg-elements-dark shadow-[0_0_5px_rgba(0,0,0,0.1)] px-6 py-1 rounded-sm text-sm hover:shadow-md transition-all active:scale-95"
                    >
                      {getCountryName(border)}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
