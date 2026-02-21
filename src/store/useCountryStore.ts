import { create } from "zustand";
import type { Country } from "../types/country";

import countriesData from "../../data.json";

interface CountryState {
  countries: Country[];
  filteredCountries: Country[];
  searchQuery: string;
  regionFilter: string;
  setSearchQuery: (query: string) => void;
  setRegionFilter: (region: string) => void;
}

// Helper function filter
const filterLogic = (countries: Country[], query: string, region: string) => {
  return countries.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(query.toLowerCase());
    const matchesRegion = region === "" || c.region === region;
    return matchesSearch && matchesRegion;
  });
};

export const useCountryStore = create<CountryState>((set) => ({
  // 1. Inisialisasi: Saat aplikasi baru jalan, kita isi datanya
  countries: countriesData as Country[],
  filteredCountries: countriesData as Country[],
  searchQuery: "",
  regionFilter: "",

  // 2. Fungsi untuk mengubah Query Pencarian
  setSearchQuery: (query) =>
    set((state) => ({
      searchQuery: query,
      filteredCountries: filterLogic(
        state.countries,
        query,
        state.regionFilter,
      ),
    })),

  // 3. Fungsi untuk mengubah Filter Region
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
