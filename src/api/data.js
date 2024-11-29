import { endpoints } from './config';

export const getData = async (param, range, startDate, endDate) => {
  let url = `${endpoints.getData}?param=${param}`;
  
  if (startDate && endDate) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  } else {
    url += `&range=${range}`;
  }

  try {
    if (!url) {
      return { status: 'error', message: 'API endpoint is not defined' };
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const textResponse = await response.text();

    try {
      const data = JSON.parse(textResponse);
      if (data.status === 'error') {
        return { status: 'error', message: 'Error displaying data' };
      }
      return { status: 'success', data: data.data };
    } catch (jsonError) {
      console.error('Invalid JSON response:', textResponse);
      return { status: 'error', message: 'Invalid response from the server' };
    }
  } catch (error) {
    console.error('Error during fetching data:', error);
    return { status: 'error', message: 'An error occurred while fetching data. Please try again.' };
  }
};

export const getRecentData = async () => {
  try {
    const response = await fetch(endpoints.getRecentData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const textResponse = await response.text();

    try {
      const data = JSON.parse(textResponse);
      if (data.status === 'error') {
        return { status: 'error', message: 'Error displaying recent data' };
      }
      return { status: 'success', data: data.data };
    } catch (jsonError) {
      console.error('Invalid JSON response:', textResponse);
      return { status: 'error', message: 'Invalid response from the server' };
    }
  } catch (error) {
    console.error('Error during fetching recent data:', error);
    return { status: 'error', message: 'An error occurred while fetching recent data. Please try again.' };
  }
};

export const fetchHistory = async (page = 1, recordsPerPage = 50) => {
  try {
    // Construct the URL with query parameters
    const url = `${endpoints.getHistory}?page=${page}&records_per_page=${recordsPerPage}`;
    
    // Fetch data from the API
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Parse the response text
    const textResponse = await response.text();

    try {
      // Attempt to parse the JSON response
      const data = JSON.parse(textResponse);

      // Handle the response status
      if (data.status === 'error') {
        return { status: 'error', message: data.message || 'Error displaying history data' };
      }

      // Return the success response including the data and pagination details
      return {
        status: 'success',
        data: data.data,
        pagination: data.pagination,
      };
    } catch (jsonError) {
      // Handle invalid JSON
      console.error('Invalid JSON response:', textResponse);
      return { status: 'error', message: 'Invalid response from the server' };
    }
  } catch (error) {
    // Handle fetch errors
    console.error('Error during fetching history data:', error);
    return { status: 'error', message: 'An error occurred while fetching history data. Please try again.' };
  }
};

export const deleteHistory = async (history_id) => {
  try {
    const url = `${endpoints.deleteHistory}?history_id=${history_id}`;
    
    // Fetch the delete request from the API
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Parse the response text
    const textResponse = await response.text();

    try {
      // Attempt to parse the JSON response
      const data = JSON.parse(textResponse);

      // Handle the response status
      if (data.status === 'error') {
        return { status: 'error', message: data.message || 'Error deleting history data' };
      }

      // Return the success response indicating successful deletion
      return {
        status: 'success',
        message: data.message || 'History record deleted successfully',
      };
    } catch (jsonError) {
      // Handle invalid JSON
      console.error('Invalid JSON response:', textResponse);
      return { status: 'error', message: 'Invalid response from the server' };
    }
  } catch (error) {
    // Handle fetch errors
    console.error('Error during deleting history data:', error);
    return { status: 'error', message: 'An error occurred while deleting history data. Please try again.' };
  }
};