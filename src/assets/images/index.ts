import heroBotanicalHerbs from './hero_botanical_herbs_1791286124950.jpg';
import artisanHerbalistGarden from './artisan_herbalist_garden_1791286139406.jpg';
import productSalveJar from './product_salve_jar_1791286153683.jpg';
import productTinctureAmber from './product_tincture_amber_1791286167082.jpg';

export const HERO_IMAGE = heroBotanicalHerbs;
export const ABOUT_IMAGE = artisanHerbalistGarden;
export const SALVE_IMAGE = productSalveJar;
export const TINCTURE_IMAGE = productTinctureAmber;

/**
 * Resolves any image path or legacy AI Studio /src/assets/ string to the bundled Vite asset URL.
 */
export const resolveImageUrl = (path?: string | null): string => {
  if (!path) return TINCTURE_IMAGE;
  
  if (path.includes('hero_botanical_herbs')) {
    return HERO_IMAGE;
  }
  if (path.includes('artisan_herbalist_garden')) {
    return ABOUT_IMAGE;
  }
  if (path.includes('product_salve_jar')) {
    return SALVE_IMAGE;
  }
  if (path.includes('product_tincture_amber')) {
    return TINCTURE_IMAGE;
  }

  return path;
};
