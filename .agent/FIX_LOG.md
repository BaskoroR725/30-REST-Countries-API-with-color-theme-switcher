# Fix Log — REST Countries API Project

Log perbaikan bug yang ditemukan selama development. **Baca ini sebelum mengubah file terkait** agar tidak mengulangi kesalahan yang sama.

---

## 1. Tailwind CSS v4 — Dark Mode Configuration

**File:** `src/index.css`

### ❌ Salah (Tidak Bekerja di Tailwind 4)

```css
@theme {
  --dark-mode: selector(.dark); /* INI TIDAK DIKENALI */
}
```

`--dark-mode` di dalam `@theme` **bukan sintaks Tailwind 4 yang valid**. Block `@theme` hanya untuk CSS custom properties (warna, font, dsb). Ini menyebabkan semua utility `dark:*` tidak bekerja sama sekali.

### ✅ Benar (Sintaks Resmi Tailwind 4)

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* hanya variabel CSS di sini */
}
```

- `@custom-variant` harus di **top level**, sejajar dengan `@import`.
- Sintaks `(&:where(.dark, .dark *))` memastikan semua child dari `.dark` juga terpengaruh.
- Referensi: https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually

---

## 2. REST Countries API — Batas 10 Fields

**File:** `src/store/useCountryStore.ts`

### ❌ Salah

```ts
// Tanpa fields → 400 Bad Request
fetch("https://restcountries.com/v3.1/all");

// Lebih dari 10 fields → 400 Bad Request
fetch(
  "https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,population,flags,cca3,currencies,languages,borders,tld",
);
```

API `restcountries.com/v3.1/all` sekarang **WAJIB** menggunakan parameter `fields` dan **MAKSIMAL 10 fields**. Tanpa `fields` atau lebih dari 10 akan mengembalikan:

```json
{
  "message": "'fields' query not specified or you're requesting more than 10 fields",
  "status": 400
}
```

### ✅ Benar (Tepat 10 Fields)

```ts
fetch(
  "https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,population,flags,cca3,currencies,languages,borders",
);
```

- Kita drop `tld` karena kurang penting → `topLevelDomain` diset ke `[]`.
- Jika butuh `tld`, drop `subregion` sebagai gantinya.
- **Selalu hitung jumlah fields** sebelum menambah field baru.

---

## 3. Zustand Persist — Theme Hydration Race Condition

**File:** `src/store/useThemeStore.ts`

### ❌ Masalah

Zustand `persist` memuat state dari `localStorage` secara async. Jika `useEffect` di `__root.tsx` berjalan sebelum rehydration selesai, class `.dark` tidak akan di-sync ke DOM → theme stuck.

### ✅ Solusi

Gunakan `onRehydrateStorage` callback untuk sync class `.dark` segera setelah state dimuat:

```ts
const applyThemeClass = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () =>
        set((state) => {
          const newValue = !state.isDarkMode;
          applyThemeClass(newValue);
          return { isDarkMode: newValue };
        }),
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeClass(state.isDarkMode);
      },
    },
  ),
);
```

---

## 4. Framer Motion — Animasi Search yang Mengganggu

**File:** `src/routes/index.tsx`

### ❌ Salah (Kartu Terbang/Zoom-Out Saat Search)

```tsx
<motion.div layout>  {/* layout → kartu terbang saat posisi berubah */}
  <AnimatePresence mode="popLayout">  {/* popLayout → kartu keluar dari flow */}
    <motion.div
      exit={{ opacity: 0, scale: 0.9 }}  {/* scale → zoom-out effect */}
      transition={{ delay: index * 0.02 }}  {/* stagger → gelombang kacau */}
    >
```

Kombinasi `layout` + `popLayout` + `scale exit` + stagger delay menyebabkan animasi chaos saat user mengetik di search bar.

### ✅ Benar (Fade Sederhana per Grup)

```tsx
<div className="grid ...">
  <AnimatePresence mode="wait">
    <motion.div
      key={searchQuery + regionFilter}  {/* re-render seluruh grup */}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="contents"  {/* penting: agar grid layout tetap bekerja */}
    >
      {filteredCountries.map((country) => (
        <div key={country.alpha3Code}>...</div>  {/* div biasa, bukan motion.div */}
      ))}
    </motion.div>
  </AnimatePresence>
</div>
```

- `key={searchQuery + regionFilter}` → trigger fade saat filter berubah
- `className="contents"` → wrapper tidak merusak CSS grid
- Tidak ada `layout`, `scale`, atau stagger → bersih dan profesional

---

## 5. TypeScript — `any` Type di Store

**File:** `src/store/useCountryStore.ts`

### ❌ Salah

```ts
const data = await response.json();
data.map((item: any) => ({ ... }))
```

### ✅ Benar

Definisikan interface untuk response API:

```ts
interface RestCountryApi {
  name: { common: string; nativeName?: Record<string, { common: string }> };
  population: number;
  region: string;
  subregion?: string;
  capital?: string[];
  flags: { svg: string; png: string };
  cca3: string;
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
  borders?: string[];
  tld?: string[];
}

const data: RestCountryApi[] = await response.json();
data.map((item) => ({ ... }))  // TypeScript sekarang tahu tipe item
```

---

## Prinsip Umum

1. **Selalu cek dokumentasi resmi** untuk sintaks framework (Tailwind 4 ≠ Tailwind 3).
2. **Test API dengan `curl`** sebelum menyalahkan browser cache.
3. **Hindari `layout` animation** pada list yang sering berubah (search/filter).
4. **Gunakan `onRehydrateStorage`** saat zustand persist perlu sync ke DOM.
5. **Hitung jumlah fields** saat menggunakan REST Countries API (maks 10).
