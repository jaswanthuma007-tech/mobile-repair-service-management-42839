import { supabase } from './supabaseClient';

/**
 * Catalog helpers for the multi-step booking flow.
 *
 * Tables per spec:
 * - brands(id, name, logo_url)
 * - device_models(id, brand_id, model_name)
 * - services(id, model_id, name, price)
 */

// PUBLIC_INTERFACE
export async function listBrands() {
  /** Lists available brands ordered by name. */
  const { data, error } = await supabase.from('brands').select('id,name,logo_url').order('name', { ascending: true });
  if (error) throw error;
  return data || [];
}

// PUBLIC_INTERFACE
export async function listModelsForBrand({ brandId }) {
  /** Lists device models for a brand via FK. */
  if (!brandId) throw new Error('brandId is required');

  const { data, error } = await supabase
    .from('device_models')
    .select('id,brand_id,model_name')
    .eq('brand_id', brandId)
    .order('model_name', { ascending: true });

  if (error) throw error;
  return data || [];
}

// PUBLIC_INTERFACE
export async function listServicesForModel({ modelId }) {
  /** Lists services (issues) for a device model. */
  if (!modelId) throw new Error('modelId is required');

  const { data, error } = await supabase
    .from('services')
    .select('id,model_id,name,price')
    .eq('model_id', modelId)
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}
