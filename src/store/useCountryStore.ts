import { create } from "zustand";
import type { Country } from "../types/country";

/* import countriesData from "../../data.json"; */

interface CountryState {
  countries: Country[];
  filteredCountries: Country[];
  searchQuery: string;
  regionFilter: string;
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  setRegionFilter: (region: string) => void;
  fetchCountries: () => Promise<void>;
}

// Helper function filter
const filterLogic = (countries: Country[], query: string, region: string) => {
  return countries.filter((c) => {
    const matchesSearch = (c.name || "")
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesRegion = region === "" || c.region === region;
    return matchesSearch && matchesRegion;
  });
};

interface RestCountryApi {
  name: {
    common: string;
    nativeName?: Record<string, { common: string }>;
  };
  population: number;
  region: string;
  subregion?: string;
  capital?: string[];
  flags: {
    svg: string;
    png: string;
  };
  cca3: string;
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
  borders?: string[];
  tld?: string[];
}

export const useCountryStore = create<CountryState>((set) => ({
  countries: [],
  filteredCountries: [],
  searchQuery: "",
  regionFilter: "",
  isLoading: false,
  error: null,

  fetchCountries: async () => {
    set({ isLoading: true, error: null });
    try {
      // REST Countries API sekarang WAJIB menggunakan parameter fields (maks 10)
      // Kita drop 'tld' karena kurang penting dibanding 'subregion'
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,population,flags,cca3,currencies,languages,borders",
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch countries (${response.status})`,
        );
      }

      const data: RestCountryApi[] = await response.json();

      // Map data dari v3.1 ke format Country lama agar tidak merusak komponen lain
      const mappedCountries: Country[] = data.map((item) => ({
        name: item.name?.common || "Unknown",
        nativeName:
          Object.values(item.name?.nativeName || {})[0]?.common ||
          item.name?.common ||
          "Unknown",
        population: item.population,
        region: item.region,
        subregion: item.subregion || "",
        capital: item.capital?.[0] || "",
        topLevelDomain: item.tld || [],
        currencies: item.currencies
          ? Object.entries(item.currencies).map(([code, c]) => ({
              code,
              name: c.name,
              symbol: c.symbol,
            }))
          : [],
        languages: item.languages
          ? Object.values(item.languages).map((name) => ({
              name,
            }))
          : [],
        borders: item.borders || [],
        alpha3Code: item.cca3,
        flags: item.flags,
      }));

      set({
        countries: mappedCountries,
        filteredCountries: mappedCountries,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "An unknown error occurred",
        isLoading: false,
      });
    }
  },

  setSearchQuery: (query) =>
    set((state) => ({
      searchQuery: query,
      filteredCountries: filterLogic(
        state.countries,
        query,
        state.regionFilter,
      ),
    })),

  setRegionFilter: (region) =>
    set((state) => ({
      regionFilter: region,
      filteredCountries: filterLogic(
        state.countries,
        state.searchQuery,
        region,
      ),
    })),
}));
