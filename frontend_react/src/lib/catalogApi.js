import { supabase } from './supabaseClient';

/**
 * Catalog helpers for the multi-step booking flow.
 *
 * The spec calls for:
 * - brands(id, name, logo_url)
 * - device_models(id, brand_id, model_name)
 *
 * Some environments may still have a legacy device_models table:
 * - device_models(id, brand, model_name)
 *
 * We support both shapes (best-effort).
 */

// PUBLIC_INTERFACE
export async function listBrands() {
  /** Lists available brands ordered by name. */
  const { data, error } = await supabase.from('brands').select('id,name,logo_url').order('name', { ascending: true });
  if (error) throw error;
  return data || [];
}

// PUBLIC_INTERFACE
export async function listModelsForBrand({ brandId, brandName }) {
  /**
   * Lists models for a brand.
   * - Prefer brandId + FK (device_models.brand_id)
   * - Fall back to legacy string column (device_models.brand)
   */
  if (!brandId && !brandName) throw new Error('brandId or brandName is required');

  // Prefer FK schema.
  if (brandId) {
    const { data, error } = await supabase
      .from('device_models')
      .select('id,brand_id,model_name')
      .eq('brand_id', brandId)
      .order('model_name', { ascending: true });

    if (!error) return data || [];

    // If FK schema isn't present, continue to legacy fallback.
    // eslint-disable-next-line no-console
    console.warn('[catalogApi] FK models query failed; trying legacy schema:', error?.message || error);
  }

  // Legacy schema: device_models.brand is text.
  const { data, error } = await supabase
    .from('device_models')
    .select('id,brand,model_name')
    .eq('brand', brandName)
    .order('model_name', { ascending: true });

  if (error) throw error;
  return data || [];
}
