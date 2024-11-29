export const BASE_URL = process.env.REACT_APP_BASE_URL;

export const endpoints = {
  insertData: `${BASE_URL}/api/v1/data`,
  getData: `${BASE_URL}/api/v1/data`,
  getRecentData: `${BASE_URL}/api/v1/recent`,
  getHistory: `${BASE_URL}/api/v1/history`,
  deleteHistory: `${BASE_URL}/api/v1/history`,
};