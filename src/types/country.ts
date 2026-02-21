export interface Country {
  name: string;
  nativeName: string;
  population: number;
  region: string;
  subregion: string;
  capital?: string;
  topLevelDomain: string[];
  currencies?: Array<{ code: string; name: string; symbol: string }>;
  languages: Array<{ name: string }>;
  borders?: string[];
  alpha3Code: string;
  flags: {
    svg: string;
    png: string;
  };
}
