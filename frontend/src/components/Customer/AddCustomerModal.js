import React, { useEffect, useState } from "react";
import { createCustomer, updateCustomer } from "../../api/customerAPI";

function AddCustomerModal({ show, onClose, onCustomerAdded, editingCustomer }) {
  const [consignee_name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.consignee_name || "");
      setPhone(editingCustomer.phone || "");
    } else {
      setName("");
      setPhone("");
    }
  }, [editingCustomer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consignee_name.trim()) {
      setError("Customer name is required");
      return;
    }



    try {
      setLoading(true);
      setError("");

      if (editingCustomer) {
        // ✅ UPDATE EXISTING CUSTOMER
        await updateCustomer(editingCustomer.id, { consignee_name, phone });
      } else {
        // ✅ ADD NEW CUSTOMER
        await createCustomer({ consignee_name, phone });
      }

      onCustomerAdded(); // refresh list
      onClose(); // close modal
    } catch (err) {
      setError("Error saving customer");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={consignee_name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              {/* <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button> */}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading
                  ? "Saving..."
                  : editingCustomer
                    ? "Update"
                    : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCustomerModal;
