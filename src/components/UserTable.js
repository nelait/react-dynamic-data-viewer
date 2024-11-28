import React, { useState, useEffect } from 'react';
import './UserTable.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function UserTable({ apiSettings }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [jumpToPage, setJumpToPage] = useState('');

  useEffect(() => {
    fetchData();
  }, [apiSettings]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let headers = {};
      if (apiSettings.headers) {
        try {
          headers = JSON.parse(apiSettings.headers);
        } catch (e) {
          console.warn('Invalid headers JSON:', e);
        }
      }

      const response = await fetch(apiSettings.apiUrl, {
        method: apiSettings.method,
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let jsonData = await response.json();

      // Handle different API response formats
      if (Array.isArray(jsonData)) {
        setData(jsonData);
      } else if (jsonData.results && Array.isArray(jsonData.results)) {
        setData(jsonData.results);
      } else if (typeof jsonData === 'object') {
        // Convert single object to array if needed
        setData([jsonData]);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPage);
    if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
      setJumpToPage('');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Data Export', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
    
    // Get table headers
    const headers = Object.keys(data[0] || {}).map(key => 
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()
    );
    
    // Transform data for the table
    const rows = data.map(item => Object.values(item).map(value => 
      typeof value === 'object' ? JSON.stringify(value) : String(value)
    ));
    
    // Generate the table
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 30,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      columnStyles: {
        // Adjust column widths if needed
        0: { cellWidth: 20 },
      },
      didDrawPage: (data) => {
        // Add footer
        doc.setFontSize(8);
        doc.text(
          `Page ${data.pageNumber}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
    });
    
    // Save the PDF
    doc.save('table-export.pdf');
  };

  // Filter data based on search term
  const filteredData = data.filter(item =>
    Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Get table headers from first item
  const headers = currentItems.length > 0
    ? Object.keys(currentItems[0]).filter(key => typeof currentItems[0][key] !== 'object')
    : [];

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    // Always show first page
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push('...');
      }
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);

    return (
      <div className="pagination-container">
        <div className="pagination-controls">
          <div className="pagination-buttons">
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              title="First Page"
            >
              ⟪
            </button>
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              title="Previous Page"
            >
              ←
            </button>

            {pageNumbers.map((number, index) => (
              number === '...' ? (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">•••</span>
              ) : (
                <button
                  key={number}
                  className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </button>
              )
            ))}

            <button
              className="pagination-button"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Next Page"
            >
              →
            </button>
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              title="Last Page"
            >
              ⟫
            </button>
          </div>

          <div className="pagination-jump">
            <span>Go to:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJumpToPage()}
            />
            <button onClick={handleJumpToPage}>Go</button>
          </div>
        </div>

        <div className="pagination-info">
          <div className="pagination-stats">
            Showing {startIndex}-{endIndex} of {filteredData.length} items
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="table-container">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <button 
          className="export-button"
          onClick={exportToPDF}
          disabled={!data.length}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" 
              fill="currentColor"
            />
          </svg>
          Export PDF
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {headers.map(header => (
                <th
                  key={header}
                  onClick={() => handleSort(header)}
                  className={sortConfig.key === header ? sortConfig.direction : ''}
                >
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                  {sortConfig.key === header && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                {headers.map(header => (
                  <td key={header}>
                    {typeof item[header] === 'boolean'
                      ? item[header].toString()
                      : item[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderPagination()}
    </div>
  );
}

export default UserTable;
