import React, { useEffect, useState } from 'react';

// Components
import RemoveSvg from '../assets/svg/remove.svg';
import { motion } from 'framer-motion';

// API
import { fetchHistory, deleteHistory } from '../api/data';

// SweetAlert2
import Swal from 'sweetalert2';

const History = ({ close }) => {
  const [historyData, setHistoryData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch history data when the component mounts or when the currentPage changes
  useEffect(() => {
    const getHistory = async () => {
      setIsLoading(true);
      const result = await fetchHistory(currentPage, 50); // Fetch 50 records per page.
      if (result.status === 'success') {
        setHistoryData(result.data);
        setPagination(result.pagination);
      } else {
        console.error(result.message);
      }
      setIsLoading(false);
    };

    getHistory();
  }, [currentPage]);

  // Handle page navigation
  const goToNextPage = () => {
    if (pagination.current_page < pagination.total_pages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (pagination.current_page > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Handle history item deletion with SweetAlert2
  const handleDelete = async (history_id) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the history record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      // Proceed with deletion if confirmed
      const deleteResult = await deleteHistory(history_id);

      if (deleteResult.status === 'success') {
        Swal.fire('Deleted!', 'The history record has been deleted.', 'success');
        // Remove the deleted history item from the state
        setHistoryData((prevData) => prevData.filter((item) => item.history_id !== history_id));
      } else {
        Swal.fire('Error!', 'There was a problem deleting the history record. Please try again.', 'error');
        console.error(deleteResult.message);
      }
    } else {
      Swal.fire('Cancelled', 'The history record is safe!', 'info');
    }
  };

  // Handle delete all history
  const handleDeleteAll = async () => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete all history records.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete all!',
    });

    if (result.isConfirmed) {
      const deleteResult = await deleteHistory('all'); // Pass 'all' as the history_id

      if (deleteResult.status === 'success') {
        Swal.fire('Deleted!', 'All history records have been deleted.', 'success');
        setHistoryData([]); // Clear all history data from the state
      } else {
        Swal.fire('Error!', 'There was a problem deleting all history records. Please try again.', 'error');
        console.error(deleteResult.message);
      }
    }
  };

  return (
    <>
      <div className="popup-overlay">
        <motion.div
          className="popup-layer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="title">
            Out of Range History
            <button onClick={close}>Close</button>
          </div>

          {isLoading ? (
            <p>Loading history...</p>
          ) : (
            <>
              {historyData.length > 0 && (
                <button onClick={handleDeleteAll} className="dlt">
                  Delete All
                </button>
              )}
              <div className="history-grid">
                {historyData.map((item) => (
                  <div className="item" key={item.id}>
                    <button onClick={() => handleDelete(item.id)}>
                      <img src={RemoveSvg} alt="Remove" />
                    </button>
                    <h3>
                      {item.title} [{item.value}]
                    </h3>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="pagination-controls">
                <button onClick={goToPrevPage} disabled={pagination.current_page === 1}>
                  Previous
                </button>
                <span>
                  Page {pagination.current_page} of {pagination.total_pages}
                </span>
                <button onClick={goToNextPage} disabled={pagination.current_page === pagination.total_pages}>
                  Next
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default History;
