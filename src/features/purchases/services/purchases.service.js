// src/features/purchases/services/purchases.service.js
import axiosInstance from '../../../shared/services/api.js';

function stripEmptyParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== ''
    )
  );
}

export async function createPurchase(payload) {
  try {
    const { data } = await axiosInstance.post('/purchases', payload);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPurchases(params) {
  try {
    const { data } = await axiosInstance.get('/purchases', {
      params: stripEmptyParams(params),
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPurchaseById(id) {
  try {
    const { data } = await axiosInstance.get(`/purchases/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function receivePurchase(id) {
  try {
    const { data } = await axiosInstance.put(`/purchases/${id}/receive`, {});
    return data;
  } catch (error) {
    throw error;
  }
}

export async function cancelPurchase(id) {
  try {
    const { data } = await axiosInstance.put(`/purchases/${id}/cancel`, {});
    return data;
  } catch (error) {
    throw error;
  }
}
