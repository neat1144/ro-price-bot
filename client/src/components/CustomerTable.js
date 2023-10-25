import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./CustomerTable.css"; // Import a CSS file for styling

// /customer api
// POST request body:
// {
//  keyword: "test keyword1",
//  svr: 2209,
//  type: 1,
//
//  include: "test include1",
//  exclude: "test exclude1",
//  set_price: 1000,
//  new_price: 0,
// }

function CustomerTable() {
  const [parentList, setParentList] = useState([]);
  const [childMap, setChildMap] = useState({});
  const [editIndex, setEditIndex] = useState(-1);
  const [editParentIndex, setEditParentIndex] = useState(-1);
  const [editChildIndex, setEditChildIndex] = useState(-1);
  const [editedParent, setEditedParent] = useState({
    keyword: "",
    svr: "",
    type: "",
  });
  const [editedChild, setEditedChild] = useState({
    include: "",
    exclude: "",
    set_price: "",
    new_price: "",
    nofi_time: "",
  });

  // Define server options
  const serverOptions = [
    { value: 100, label: "svr-a" },
    { value: 200, label: "svr-b" },
    { value: 300, label: "svr-c" },
  ];

  // Define type options
  const typeOptions = [
    { value: 0, label: "販賣" },
    { value: 1, label: "收購" },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3030/parent")
      .then((response) => {
        if (response.data && response.data.message === "success") {
          setParentList(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    // Fetch child data for each parent
    parentList.forEach((parent) => {
      axios
        .get(`http://localhost:3030/child/parent_id/${parent.id}`)
        .then((response) => {
          if (response.data && response.data.message === "success") {
            setChildMap((prev) => ({
              ...prev,
              [parent.id]: response.data.data,
            }));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, [parentList]);

  // "EDIT MODE"
  // Hdanle parent's the "Edit" button click
  const handleParentEdit = (parent, index) => {
    setEditParentIndex(index);
    setEditedParent({ ...parent });
  };

  // Handle child's the "Edit" button click
  const handleChildEdit = (child, index) => {
    setEditChildIndex(index);
    setEditedChild({ ...child });
  };

  // "RESET"
  // Reset a child
  const handleResetChild = (childId) => {
    // Reset the child's new_price to 0 and nofi_time to null
    setEditedChild({ ...editedChild, new_price: 0, nofi_time: null });

    // Send a PUT request
    axios
      .put(`http://localhost:3030/child/${childId}`, editedChild)
      .then((response) => {
        if (response.data && response.data.message === "success") {
          setChildMap((prev) => {
            const newChildMap = { ...prev };
            Object.keys(newChildMap).forEach((key) => {
              newChildMap[key] = newChildMap[key].map((child) => {
                if (child.id === childId) {
                  return { ...child, new_price: 0, nofi_time: null };
                }
                return child;
              });
            });
            return newChildMap;
          });
        }
      })
      .catch((error) => {
        console.log("Error to reset child!", error);
      });
  };

  // "UPDATE"
  // Update a parent
  const handleParentUpdate = (parentId) => {
    axios
      .put(`http://localhost:3030/parent/${parentId}`, editedParent)
      .then((response) => {
        if (response.data && response.data.message === "success") {
          // Update the local state after a successful API call
          // Fetch the updated data and then update the parentList
          axios.get(`http://localhost:3030/parent`).then((response) => {
            if (response.data && response.data.message === "success") {
              setParentList(response.data.data);
              setEditParentIndex(-1); // Reset edit mode
            }
          });
        }
      })
      .catch((error) => {
        console.log("Error to update parent!", error);
      });
  };

  // Update a child
  const handleChildUpdate = (childId) => {
    axios
      .put(`http://localhost:3030/child/${childId}`, editedChild)
      .then((response) => {
        if (response.data && response.data.message === "success") {
          setChildMap((prev) => {
            const newChildMap = { ...prev };
            Object.keys(newChildMap).forEach((key) => {
              newChildMap[key] = newChildMap[key].map((child) => {
                if (child.id === childId) {
                  return editedChild;
                }
                return child;
              });
            });
            return newChildMap;
          });
          setEditChildIndex(-1);
        }
      })
      .catch((error) => {
        console.log("Error to update child!", error);
      });
  };

  // "DELETE"
  // Delete a parent
  const handleDeleteParent = (id) => {
    axios
      .delete(`http://localhost:3030/parent/${id}`)
      .then((response) => {
        if (response.data && response.data.message === "success") {
          setParentList((prev) => prev.filter((parent) => parent.id !== id));
        }
      })
      .catch((error) => {
        console.log("Error to delete parent!", error);
      });
  };

  // Delete a child an refresh the child map
  const handleDeleteChild = (id) => {
    axios
      .delete(`http://localhost:3030/child/${id}`)
      .then((response) => {
        if (response.data && response.data.message === "success") {
          setChildMap((prev) => {
            const newChildMap = { ...prev };
            Object.keys(newChildMap).forEach((key) => {
              newChildMap[key] = newChildMap[key].filter(
                (child) => child.id !== id
              );
            });
            return newChildMap;
          });
        }
      })
      .catch((error) => {
        console.log("Error to delete child!", error);
      });
  };

  // Create a variable to track the serial number
  let serialNumber = 1;

  return (
    <div className="container">
      <h1>Data Table</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">關鍵字</th>
            <th scope="col">伺服器</th>
            <th scope="col">販賣/收購</th>
            <th scope="col">包含</th>
            <th scope="col">排除</th>
            <th scope="col">設定價格</th>
            <th scope="col">目前最低價</th>
            <th scope="col">通知時間</th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          {parentList.map((parent) => (
            <React.Fragment key={parent.id}>
              {/* Parent */}
              <tr>
                <td>{serialNumber++}</td>
                {/* Keywrod */}
                <td>
                  {editParentIndex === parent.id ? (
                    <input
                      type="text"
                      value={editedParent.keyword}
                      className="form-control form-control-sm"
                      style={{ width: "100px" }}
                      placeholder="關鍵字"
                      onChange={(e) =>
                        setEditedParent({
                          ...editedParent,
                          keyword: e.target.value,
                        })
                      }
                    />
                  ) : (
                    parent.keyword
                  )}
                </td>
                {/* Server */}
                <td>
                  {editParentIndex === parent.id ? (
                    <select
                      value={editedParent.svr}
                      className="form-select form-select-sm"
                      onChange={(e) =>
                        setEditedParent({
                          ...editedParent,
                          svr: e.target.value,
                        })
                      }
                    >
                      {serverOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    serverOptions.find((option) => option.value === parent.svr)
                      ?.label
                  )}
                </td>
                {/* Type */}
                <td>
                  {editParentIndex === parent.id ? (
                    <select
                      value={editedParent.type}
                      className="form-select form-select-sm"
                      onChange={(e) =>
                        setEditedParent({
                          ...editedParent,
                          type: e.target.value,
                        })
                      }
                    >
                      {typeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      style={{
                        color:
                          parent.type === 0
                            ? "blue"
                            : parent.type === 1
                            ? "red"
                            : "black",
                      }}
                    >
                      {
                        typeOptions.find(
                          (option) => option.value === parent.type
                        )?.label
                      }
                    </span>
                  )}
                </td>
                {/* Empty */}
                <td style={{ width: "100px" }}></td>
                <td style={{ width: "100px" }}></td>
                <td style={{ width: "100px" }}></td>
                <td style={{ width: "100px" }}></td>
                <td style={{ width: "100px" }}></td>
                {/* Button */}
                <td>
                  {editParentIndex === parent.id ? (
                    // Edit mode
                    <>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleParentUpdate(parent.id)}
                      >
                        保存
                      </button>

                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setEditParentIndex(-1)}
                      >
                        取消
                      </button>
                    </>
                  ) : (
                    // View mode
                    <>
                      <button type="button" className="btn btn-sm btn-primary">
                        新增
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleParentEdit(parent, parent.id)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteParent(parent.id)}
                      >
                        刪除
                      </button>
                    </>
                  )}
                </td>
              </tr>
              {/*       */}
              {/* Child */}
              {/*       */}
              {childMap[parent.id] &&
                childMap[parent.id].map((child) => (
                  <tr key={child.id}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    {/* Include */}
                    <td>
                      {editChildIndex === child.id ? (
                        <input
                          type="text"
                          value={editedChild.include}
                          className="form-control form-control-sm"
                          style={{ width: "100px" }}
                          placeholder="包含"
                          onChange={(e) =>
                            setEditedChild({
                              ...editedChild,
                              include: e.target.value,
                            })
                          }
                        />
                      ) : (
                        child.include
                      )}
                    </td>
                    {/* Exclude */}
                    <td>
                      {editChildIndex === child.id ? (
                        <input
                          type="text"
                          value={editedChild.exclude}
                          className="form-control form-control-sm"
                          style={{ width: "100px" }}
                          placeholder="排除"
                          onChange={(e) =>
                            setEditedChild({
                              ...editedChild,
                              exclude: e.target.value,
                            })
                          }
                        />
                      ) : (
                        child.exclude
                      )}
                    </td>
                    {/* Set Price */}
                    <td>
                      {editChildIndex === child.id ? (
                        <input
                          type="text"
                          value={editedChild.set_price}
                          className="form-control form-control-sm"
                          style={{ width: "100px" }}
                          placeholder="設定價格"
                          onChange={(e) =>
                            setEditedChild({
                              ...editedChild,
                              set_price: e.target.value,
                            })
                          }
                        />
                      ) : (
                        child.set_price
                      )}
                    </td>
                    {/* New Price */}
                    <td>
                      {editChildIndex === child.id ? (
                        <input
                          type="text"
                          value={editedChild.new_price}
                          className="form-control form-control-sm"
                          style={{ width: "100px" }}
                          placeholder="目前最低價"
                          onChange={(e) =>
                            setEditedChild({
                              ...editedChild,
                              new_price: e.target.value,
                            })
                          }
                        />
                      ) : (
                        child.new_price
                      )}
                    </td>
                    {/* Nofi time */}
                    <td>{child.nofi_time}</td>
                    {/* Button */}
                    <td>
                      {editChildIndex === child.id ? (
                        // Edit mode
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleChildUpdate(child.id)}
                          >
                            保存
                          </button>

                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditChildIndex(-1)}
                          >
                            取消
                          </button>
                        </>
                      ) : (
                        // View mode
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-warning"
                            onClick={() => handleResetChild(child.id)}
                          >
                            重設
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleChildEdit(child, child.id)}
                          >
                            編輯
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteChild(child.id)}
                          >
                            刪除
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerTable;
