"use strict";

const UpdateInventoryModal = (props) => {
  const [warehouseId, setWarehouseId] = React.useState(props.warehouseId);
  const [productName, setProductName] = React.useState(props.productName);
  const [sku, setSku] = React.useState(props.sku);
  const [quantity, setQuantity] = React.useState(props.quantity);
  const [description, setDescription] = React.useState(props.description);

  const updateExistingInventory = () => {
    fetch(`/api/update_inventory/id:${props.inventoryId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        warehouseId,
        productName,
        sku,
        quantity,
        description,
      }),
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        console.log(jsonResponse);
        props.getInventory();
      });
  };

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id={`modal-update-inventory-${props.inventoryId}`}
        tabIndex="-1"
        aria-labelledby={`modal-update-inventory-${props.inventoryId}-label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={`modal-update-inventory-${props.inventoryId}-label`}
              >
                Update Inventory Row
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="warehouseId">Warehouse ID *</label>
                <select
                  className="form-select"
                  aria-label="Select Warehouse ID"
                  id="warehouse-id"
                  onChange={(event) => setWarehouseId(event.target.value)}
                >
                  <option value={props.warehouseId} selected>
                    {props.warehouseId}
                  </option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((wh) => (
                    <option value={wh}>{wh}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="sku">SKU *</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  className="form-control input-lg"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="productName">Product Name *</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  className="form-control input-lg"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description">Description</label>
                <textarea
                  className="form-control"
                  name="body"
                  rows="2"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="totalTimeInput">Quantity *</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="form-control input-lg"
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-sm btn-outline-dark btn-block"
                  type="submit"
                  data-bs-dismiss="modal"
                  onClick={updateExistingInventory}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary btn-block"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const DeleteInventoryModal = (props) => {
  const [comments, setComments] = React.useState("");

  const deleteExistingInventory = () => {
    fetch(`/api/delete_inventory/id:${props.inventoryId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        comments,
      }),
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        console.log(jsonResponse);
        props.getInventory();
      });
  };

  return (
    <React.Fragment>
      <div
        className="modal fade"
        id={`modal-delete-inventory-${props.inventoryId}`}
        tabIndex="-1"
        aria-labelledby={`modal-delete-inventory-${props.inventoryId}-label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={`modal-delete-inventory-${props.inventoryId}-label`}
              >
                Delete Inventory Row
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="comment">Deletion Comments</label>
                <textarea
                  className="form-control"
                  name="body"
                  rows="2"
                  onChange={(event) => setComments(event.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-sm btn-outline-dark btn-block"
                  type="submit"
                  data-bs-dismiss="modal"
                  onClick={deleteExistingInventory}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary btn-block"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const InventoryTableRow = (props) => {
  // Process restore
  const restoreInventory = () => {
    fetch(`/api/restore_inventory/id:${props.inventoryId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        console.log(jsonResponse);
        props.getDeletedInventory();
      });
  };
  return (
    <tr>
      <td>
        <span>
          <small>{props.inventoryId}</small>
        </span>
      </td>
      <td>
        <span>
          <small>{props.warehouseId}</small>
        </span>
      </td>
      <td>
        <span>
          <small>{props.sku}</small>
        </span>
      </td>
      <td>
        <span>
          <small>{props.productName}</small>
        </span>
      </td>
      <td>
        <span>
          <small>{props.description}</small>
        </span>
      </td>
      <td>
        <span>
          <small>{props.quantity}</small>
        </span>
      </td>
      {props.deleted === false ? (
        <React.Fragment>
          <td>
            <span>
              <a
                href=""
                className="btn btn-sm btn-outline-dark edit-btn"
                data-bs-toggle="modal"
                data-bs-target={`#modal-update-inventory-${props.inventoryId}`}
              >
                <small>
                  <i
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title="update inventory"
                    className="bi bi-pencil"
                  ></i>
                </small>
              </a>
            </span>
          </td>
          <td>
            <span>
              <a
                href=""
                className="btn btn-sm btn-outline-dark delete-btn"
                data-bs-toggle="modal"
                data-bs-target={`#modal-delete-inventory-${props.inventoryId}`}
              >
                <small>
                  <i
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title="delete inventory"
                    className="bi bi-x"
                  ></i>
                </small>
              </a>
            </span>
          </td>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <td>
            <span>
              <small>{props.comments}</small>
            </span>
          </td>
          <td>
            <span>
              <button
                className="btn btn-sm btn-outline-dark delete-btn"
                onClick={restoreInventory}
              >
                <small>
                  <i
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title="restore inventory"
                    className="bi bi-plus"
                  ></i>
                </small>
              </button>
            </span>
          </td>
        </React.Fragment>
      )}
    </tr>
  );
};

const InventoryContainer = () => {
  const [view, setView] = React.useState("all");
  const [inventories, setInventories] = React.useState([]);
  const [warehouseId, setWarehouseId] = React.useState("");
  const [productName, setProductName] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    getInventory();
  }, []);

  const getInventory = () => {
    fetch("/api/inventory")
      .then((response) => response.json())
      .then((jsonResponse) => {
        console.log(jsonResponse);
        setInventories(jsonResponse.data);
        setView("all");
      });
  };

  const getDeletedInventory = () => {
    fetch("/api/deleted_inventory")
      .then((response) => response.json())
      .then((jsonResponse) => {
        console.log(jsonResponse);
        setInventories(jsonResponse.data);
        setView("deleted");
      });
  };

  const addInventoryRow = () => {
    fetch("/api/create_inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        warehouseId,
        productName,
        sku,
        quantity,
        description,
      }),
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        console.log(jsonResponse);
        getInventory();
      });
  };

  const allInventoryRows = [];
  const allUpdateInventoryRow = [];
  const allDeleteInventoryRow = [];

  for (const inventoryRow of inventories) {
    allInventoryRows.push(
      <InventoryTableRow
        key={inventoryRow.inventory_id}
        inventoryId={inventoryRow.inventory_id}
        warehouseId={inventoryRow.warehouse_id}
        productName={inventoryRow.product_name}
        sku={inventoryRow.sku}
        description={inventoryRow.description}
        quantity={inventoryRow.quantity}
        comments={inventoryRow.comments}
        deleted={inventoryRow.deleted}
        getDeletedInventory={getDeletedInventory}
      />
    );

    allUpdateInventoryRow.push(
      <UpdateInventoryModal
        key={inventoryRow.inventory_id}
        inventoryId={inventoryRow.inventory_id}
        warehouseId={inventoryRow.warehouse_id}
        productName={inventoryRow.product_name}
        sku={inventoryRow.sku}
        description={inventoryRow.description}
        quantity={inventoryRow.quantity}
        getInventory={getInventory}
      />
    );

    allDeleteInventoryRow.push(
      <DeleteInventoryModal
        key={inventoryRow.inventory_id}
        inventoryId={inventoryRow.inventory_id}
        warehouseId={inventoryRow.warehouse_id}
        productName={inventoryRow.product_name}
        sku={inventoryRow.sku}
        description={inventoryRow.description}
        quantity={inventoryRow.quantity}
        getInventory={getInventory}
      />
    );
  }

  return (
    <React.Fragment>
      {allUpdateInventoryRow}
      {allDeleteInventoryRow}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Logistics - Inventory Tracking
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" onClick={getInventory}>
                  View Inventory
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={getDeletedInventory}>
                  View Deleted
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="row">
        <div className="col-3">
          <div className="card ms-2">
            <div className="card-header">
              <h6 className="mt-2">Add Inventory</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="warehouseId">Warehouse ID *</label>
                <select
                  className="form-select"
                  aria-label="Select Warehouse ID"
                  onChange={(event) => setWarehouseId(event.target.value)}
                >
                  <option value="" selected></option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((wh) => (
                    <option value={wh}>{wh}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="sku">SKU *</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  className="form-control input-lg"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="productName">Product Name *</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  className="form-control input-lg"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description">Description</label>
                <textarea
                  className="form-control"
                  name="body"
                  rows="2"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="form-control input-lg"
                />
              </div>

              <button
                className="btn btn-sm btn-outline-dark btn-block"
                type="submit"
                onClick={addInventoryRow}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="col-9">
          <div className="card card-body me-2">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th role="columnheader">ID</th>
                  <th role="columnheader">Warehouse</th>
                  <th role="columnheader">SKU</th>
                  <th role="columnheader">Product Name</th>
                  <th role="columnheader">Description</th>
                  <th role="columnheader">Quantity</th>
                  {view === "all" ? (
                    <React.Fragment>
                      <th role="columnheader">Edit</th>
                      <th role="columnheader">Delete</th>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <th role="columnheader">Comments</th>
                      <th role="columnheader">Restore</th>
                    </React.Fragment>
                  )}
                </tr>
              </thead>

              <tbody>{allInventoryRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

ReactDOM.render(<InventoryContainer />, document.getElementById("root"));
