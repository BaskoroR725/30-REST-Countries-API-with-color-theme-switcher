import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCountryStore } from "../store/useCountryStore";

// Mocking fetch for API tests
globalThis.fetch = vi.fn();

const mockCountries = [
  {
    name: "Germany",
    alpha3Code: "DEU",
    region: "Europe",
    population: 83000000,
    flags: { svg: "", png: "" },
    languages: [],
    topLevelDomain: [],
    nativeName: "Deutschland",
    subregion: "Western Europe",
  },
  {
    name: "Indonesia",
    alpha3Code: "IDN",
    region: "Asia",
    population: 273000000,
    flags: { svg: "", png: "" },
    languages: [],
    topLevelDomain: [],
    nativeName: "Indonesia",
    subregion: "South-Eastern Asia",
  },
];

describe("useCountryStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCountryStore.setState({
      countries: mockCountries,
      filteredCountries: mockCountries,
      searchQuery: "",
      regionFilter: "",
      isLoading: false,
      error: null,
    });
  });

  it("should filter countries by name", () => {
    const { setSearchQuery } = useCountryStore.getState();
    setSearchQuery("Indo");
    expect(useCountryStore.getState().filteredCountries).toHaveLength(1);
    expect(useCountryStore.getState().filteredCountries[0].name).toBe(
      "Indonesia",
    );
  });

  it("should filter countries by region", () => {
    const { setRegionFilter } = useCountryStore.getState();
    setRegionFilter("Europe");
    expect(useCountryStore.getState().filteredCountries).toHaveLength(1);
    expect(useCountryStore.getState().filteredCountries[0].name).toBe(
      "Germany",
    );
  });

  it("should combine search and region filters", () => {
    const { setSearchQuery, setRegionFilter } = useCountryStore.getState();
    setSearchQuery("Indo");
    setRegionFilter("Europe");
    expect(useCountryStore.getState().filteredCountries).toHaveLength(0);

    setRegionFilter("Asia");
    expect(useCountryStore.getState().filteredCountries).toHaveLength(1);
  });

  it("should handle empty search query", () => {
    const { setSearchQuery } = useCountryStore.getState();
    setSearchQuery("");
    expect(useCountryStore.getState().filteredCountries).toHaveLength(2);
  });
});
