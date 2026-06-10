// src/features/sales/services/sales.service.js
import axiosInstance from '../../../shared/services/axiosInstance.js';

function stripEmptyParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== ''
    )
  );
}

export async function createSale(payload) {
  try {
    const { data } = await axiosInstance.post('/sales', payload);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getSales(params) {
  try {
    const { data } = await axiosInstance.get('/sales', {
      params: stripEmptyParams(params),
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getSaleById(id) {
  try {
    const { data } = await axiosInstance.get(`/sales/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getTodaySummary() {
  try {
    const { data } = await axiosInstance.get('/sales/summary/today');
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getSummaryByRange(startDate, endDate) {
  try {
    const { data } = await axiosInstance.get('/sales/summary/range', {
      params: stripEmptyParams({ startDate, endDate }),
    });
    return data;
  } catch (error) {
    throw error;
  }
}
