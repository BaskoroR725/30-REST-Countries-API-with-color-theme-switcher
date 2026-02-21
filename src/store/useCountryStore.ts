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
      // Menentukan field yang dibutuhkan (maksimal 10 fields untuk /all endpoint di restcountries.com saat ini)
      const fields =
        "name,capital,region,subregion,population,flags,cca3,currencies,languages,borders";
      const response = await fetch(
        `https://restcountries.com/v3.1/all?fields=${fields}`,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch countries (${response.status})`,
        );
      }

      const data = await response.json();

      // Map data dari v3.1 ke format Country lama agar tidak merusak komponen lain
      const mappedCountries: Country[] = data.map((item: any) => ({
        name: item.name.common,
        nativeName: item.name.nativeName
          ? (Object.values(item.name.nativeName)[0] as any).common
          : item.name.common,
        population: item.population,
        region: item.region,
        subregion: item.subregion || "",
        capital: item.capital?.[0] || "",
        topLevelDomain: item.tld || [],
        currencies: item.currencies
          ? Object.values(item.currencies).map((c: any) => ({ name: c.name }))
          : [],
        languages: item.languages
          ? Object.values(item.languages).map((name: any) => ({
              name: name as string,
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
