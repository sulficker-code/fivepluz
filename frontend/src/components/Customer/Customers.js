import React, { useCallback, useEffect, useState } from "react";
import { getCustomers,  deleteCustomer } from "../../api/customerAPI";
import AddCustomerModal from "./AddCustomerModal";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const fetchCustomers = useCallback(async () => {
    const data = await getCustomers(page, search);
    setCustomers(data.data); 
    setTotalPages(data.pagination.totalPages); 
  }, [page, search]);
  

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        fetchCustomers(); 
      } catch (err) {
        alert("Failed to delete customer: " + err.message);
      }
    }
  };


  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };
  


  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Customers</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Customer
        </button>
      </div>  

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or number..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Customer Name</th>
            <th>Phone</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {(customers && customers.length > 0) ? (
            customers.map((c, index) => (
              <tr key={c.id}>
                <td>{c.customer_number}</td>
                <td>{c.consignee_name}</td>
                <td>{c.phone || "-"}</td>
                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                <td className=" gap-2">
                  <button className="btn btn-sm bg-primary mr-4 text-light">
                    View Invoices
                  </button>

                  <button
                    className="btn btn-sm bg-danger mr-4 text-light"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-sm bg-warning text-dark"
                    onClick={()=> handleEdit(c)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No customers found
              </td>
            </tr>
          )}
        </tbody>

      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {[...Array(totalPages)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${page === i + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <AddCustomerModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCustomer(null);

        }}
        onCustomerAdded={fetchCustomers}
        editingCustomer={editingCustomer} 

      />
    </div>
  );
}

export default Customers;
