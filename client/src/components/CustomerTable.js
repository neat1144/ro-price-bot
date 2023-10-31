import React, { useState, useEffect, useCallback } from "react";
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
//  set_refine: 0,
//  set_level: 0,
//  set_price: 1000,
//  new_price: 0,
// }

function CustomerTable() {
  const [addingChildForParent, setAddingChildForParent] = useState(-1);
  const [addingNewParent, setAddingNewParent] = useState(false);
  const [addingChildMode, setAddingChildMode] = useState(false);
  const [parentList, setParentList] = useState([]);
  const [childMap, setChildMap] = useState({});
  const [editParentIndex, setEditParentIndex] = useState(-1);
  const [editChildIndex, setEditChildIndex] = useState(-1);
  const [editedParent, setEditedParent] = useState({
    keyword: "乙太星塵",
    svr: 2290,
    type: 0,
  });
  const [editedChild, setEditedChild] = useState({
    include: "",
    exclude: "",
    set_refine: 0,
    set_level: 0,
    set_price: "",
    new_price: 0,
    nofi_time: "",
  });

  // Define server options
  const serverOptions = [
    { value: 2290, label: "巴基利(2290)" },
    { value: 3290, label: "查爾斯(3290)" },
    { value: 4290, label: "波利(4290)" },
    { value: 829, label: "羅札那(829)" },
  ];

  // Define type options
  const typeOptions = [
    { value: 0, label: "販賣" },
    { value: 1, label: "收購" },
  ];

  // Define level options
  const levelOptions = [
    { value: 0, label: "N/A" },
    { value: 4, label: "A" },
    { value: 3, label: "B" },
    { value: 2, label: "C" },
    { value: 1, label: "D" },
  ];

  // "FETCH"
  // fetch parent data
  const fetchData = () => {
    // fetch parent data
    fetchParent();
    // fetch child data for each parent
    fetchChild();
  };

  // Fetch parent
  const fetchParent = () => {
    axios
      .get("http://localhost:3030/parent")
      .then((response) => {
        if (response.data && response.status === 200) {
          setParentList(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Fetch child list of parent
  const fetchChild = useCallback(() => {
    parentList.forEach((parent) => {
      axios
        .get(`http://localhost:3030/child/parent_id/${parent.id}`)
        .then((response) => {
          if (response.data && response.status === 200) {
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

  // Use setInterval to refetch data every 5 seconds
  useEffect(() => {
    // Fetch data for the first time
    fetchParent();

    // Fetch data every 5 seconds with setInterval
    const interval = setInterval(() => {
      fetchParent();
    }, 2000);

    // Clear interval
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch data for the first time
    fetchChild();

    // Fetch data every 5 seconds with setInterval
    const interval = setInterval(() => {
      fetchChild();
    }, 2500);

    // Clear interval
    return () => clearInterval(interval);
  }, [parentList, fetchChild]);

  // "INIT"
  const initChild = () => {
    setEditedChild({
      include: "",
      exclude: "",
      set_refine: 0,
      set_level: 0,
      set_price: "",
      new_price: 0,
      nofi_time: "",
    });
  };

  const initParent = () => {
    setEditedParent({
      keyword: "乙太星塵",
      svr: 2290,
      type: 0,
    });
  };

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
  const handleResetChild = (child) => {
    // Reset the child's new_price to 0 and nofi_time to null
    setEditedChild({ ...editedChild, new_price: 0, nofi_time: null });

    const { id: childId } = child;

    // Send a PUT request
    axios
      .put(`http://localhost:3030/child/${childId}`, {
        include: child.include,
        exclude: child.exclude,
        set_refine: child.set_refine,
        set_level: child.set_level,
        set_price: child.set_price,
        new_price: 0,
        nofi_time: null,
        parent_id: child.parent_id,
      })
      .then((response) => {
        if (response.data && response.status === 200) {
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
              initParent();
            }
          });
        }
      })
      .catch((error) => {
        console.log("Error to update parent!", error);
      });
  };

  // Cancel button
  const hadnleCancelParentUpdate = () => {
    setEditParentIndex(-1);
    initParent();
  };

  // Update a child
  const handleChildUpdate = (childId) => {
    console.log(editedChild);
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

  // "ADD"
  // "child"
  // Add a child
  const handleAddChild = (parentId) => {
    axios
      .post(`http://localhost:3030/child`, {
        parent_id: parentId,
        include: editedChild.include,
        exclude: editedChild.exclude,
        set_refine: editedChild.set_refine,
        set_level: editedChild.set_level,
        set_price: editedChild.set_price,
        new_price: 0,
        nofi_time: editedChild.nofi_time,
      })
      .then((response) => {
        if (response.data && response.status === 200) {
          // After successfully adding the child, refresh the data
          fetchData();

          // Hide row for adding
          setAddingChildForParent(null);

          // Reset the input fields
          initChild();

          // Show button
          setAddingChildMode(false);
        }
      })
      .catch((error) => {
        console.log("Error adding child!", error);
      });
  };

  // Cancel button
  const handleCancelAddChild = () => {
    setAddingChildForParent(null);
    initChild();

    // Show button
    setAddingChildMode(false);
  };

  // Add button
  const handleAddChildForParent = (parent) => {
    setAddingChildForParent(parent.id);
    setAddingChildMode(true);
    initChild();
  };

  // "Parent"
  // Add a new parent
  const handleAddNewParent = () => {
    setAddingNewParent(true);
  };

  // Save button and Create parent
  const handleSaveNewParent = () => {
    console.log(editedParent);
    // Make a POST request to add the new parent
    axios
      .post(`http://localhost:3030/parent`, {
        keyword: editedParent.keyword,
        svr: editedParent.svr,
        type: editedParent.type,
      })
      .then((response) => {
        console.log(response.data.data.id);
        if (response.data && response.status === 200) {
          // Refresh the parent list
          fetchData();
          setAddingNewParent(false);
          // Reset the input fields of parent
          initParent();

          // If the child list of parent is empty, post a new child
          handleParentFirstCreate(response.data.data.id);
        }
      })
      .catch((error) => {
        console.log("Error adding new parent!", error);
      });
  };

  // Handle parent first create (create a init child automatically)
  const handleParentFirstCreate = (parentId) => {
    axios
      .get(`http://localhost:3030/child/parent_id/${parentId}`)
      .then((response) => {
        if (response.data && response.status === 200) {
          // if response.data.data is empty, then post a new init child
          if (response.data.data.length === 0) {
            axios
              .post(`http://localhost:3030/child`, {
                ...editedChild,
                parent_id: parentId,
              })
              .then((response) => {
                if (response.data && response.status === 200) {
                  // Refresh the parent list
                  fetchData();
                  setAddingNewParent(false);
                  // Reset the input fields of parent
                  initParent();
                }
              })
              .catch((error) => {
                console.log("Error adding new parent!", error);
              });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Cancel button
  const handleCancelAddNewParent = () => {
    setAddingNewParent(false);
    // Reset the input fields of parent
    initParent();
  };

  // "CHANGE"
  // const handleChildChange = (e) => {
  //   setEditedChild({ ...editedChild, [e.target.name]: e.target.value });
  //   console.log(editedChild);
  // };

  // Create a variable to track the serial number
  let serialNumber = 1;

  return (
    <div className="container-fluid text-center">
      <h1>Data Table</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">關鍵字</th>
            <th scope="col">伺服器</th>
            <th scope="col">販賣/收購</th>
            <th scope="col">包含</th>
            <th scope="col">排除</th>
            <th scope="col">精煉值</th>
            <th scope="col">階級</th>
            <th scope="col">設定價格</th>
            <th scope="col">目前最低價</th>
            <th scope="col">通知時間</th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          {parentList.map((parent) => (
            <React.Fragment key={parent.id}>
              {/*        */}
              {/* Parent */}
              {/*        */}
              <tr className="table-info">
                <td>{serialNumber++}</td>
                {/* Keywrod */}
                <td>
                  {editParentIndex === parent.id ? (
                    <input
                      type="text"
                      value={editedParent.keyword}
                      className="big-input"
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
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                {/* Button */}
                <td>
                  {!addingChildMode &&
                    (editParentIndex === parent.id ? (
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
                          onClick={() => hadnleCancelParentUpdate()}
                        >
                          取消
                        </button>
                      </>
                    ) : (
                      // View mode
                      <>
                        {editChildIndex === -1 &&
                          editParentIndex === -1 &&
                          !addingNewParent && (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => handleAddChildForParent(parent)}
                              >
                                新增
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-secondary"
                                onClick={() =>
                                  handleParentEdit(parent, parent.id)
                                }
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
                      </>
                    ))}
                </td>
              </tr>
              {/*               */}
              {/* Add child row */}
              {/*               */}
              {addingChildForParent === parent.id && (
                <tr>
                  <td colSpan="4"></td>
                  {/* Include */}
                  <td>
                    <input
                      type="text"
                      value={editedChild.include}
                      className="big-input"
                      placeholder="包含(a+b)"
                      onChange={(e) =>
                        setEditedChild({
                          ...editedChild,
                          include: e.target.value,
                        })
                      }
                    />
                  </td>
                  {/* Exclude */}
                  <td>
                    <input
                      type="text"
                      value={editedChild.exclude}
                      className="big-input"
                      placeholder="排除(a+b)"
                      onChange={(e) =>
                        setEditedChild({
                          ...editedChild,
                          exclude: e.target.value,
                        })
                      }
                    />
                  </td>
                  {/* Set Refine */}
                  <td>
                    <input
                      type="number"
                      value={editedChild.set_refine}
                      className="small-input"
                      placeholder="精煉值"
                      onChange={(e) =>
                        setEditedChild({
                          ...editedChild,
                          set_refine: e.target.value,
                        })
                      }
                    />
                  </td>
                  {/* Set Level */}
                  <td>
                    <select
                      value={editedChild.set_level}
                      className="form-select form-select-sm"
                      onChange={(e) =>
                        setEditedChild({
                          ...editedChild,
                          set_level: e.target.value,
                        })
                      }
                    >
                      {levelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Set Price */}
                  <td>
                    <input
                      type="number"
                      value={editedChild.set_price}
                      className="big-input"
                      placeholder="設定價格"
                      onChange={(e) =>
                        setEditedChild({
                          ...editedChild,
                          set_price: e.target.value,
                        })
                      }
                    />
                  </td>
                  {/* New Price */}
                  <td></td>
                  <td style={{ width: "100px" }}></td>
                  {/* Button */}
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleAddChild(parent.id)}
                    >
                      保存
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleCancelAddChild()}
                    >
                      取消
                    </button>
                  </td>
                </tr>
              )}
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
                          className="big-input"
                          placeholder="包含(a+b)"
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
                          className="big-input"
                          placeholder="排除(a+b)"
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
                    {/* Set Refining */}
                    <td>
                      {editChildIndex === child.id ? (
                        <input
                          type="number"
                          value={editedChild.set_refine}
                          className="small-input"
                          placeholder="精煉值"
                          onChange={(e) =>
                            setEditedChild({
                              ...editedChild,
                              set_refine: e.target.value,
                            })
                          }
                        />
                      ) : (
                        child.set_refine
                      )}
                    </td>
                    {/* Set Lavel */}
                    <td>
                      {editChildIndex === child.id ? (
                        <select
                          value={editedChild.set_level}
                          className="form-select form-select-sm"
                          onChange={(e) =>
                            setEditedChild({
                              ...editedChild,
                              set_level: e.target.value,
                            })
                          }
                        >
                          {levelOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>
                          {
                            levelOptions.find(
                              (option) => option.value === child.set_level
                            )?.label
                          }
                        </span>
                      )}
                    </td>
                    {/* Set Price */}
                    <td>
                      {editChildIndex === child.id ? (
                        <input
                          type="number"
                          value={editedChild.set_price}
                          className="big-input"
                          placeholder="設定價格"
                          onChange={(e) =>
                            setEditedChild({
                              ...editedChild,
                              set_price: e.target.value,
                            })
                          }
                        />
                      ) : (
                        child.set_price.toLocaleString()
                      )}
                    </td>
                    {/* New Price */}
                    <td>{child.new_price.toLocaleString()}</td>
                    {/* Nofi time */}
                    <td>{child.nofi_time}</td>
                    {/* Button */}
                    <td>
                      {!addingChildMode &&
                        (editChildIndex === child.id ? (
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
                            {editParentIndex === -1 &&
                              editChildIndex === -1 &&
                              !addingNewParent && (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-warning"
                                    onClick={() => handleResetChild(child)}
                                  >
                                    重設
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-secondary"
                                    onClick={() =>
                                      handleChildEdit(child, child.id)
                                    }
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
                          </>
                        ))}
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
          {/*                */}
          {/* Add parent row */}
          {/*                */}
          {addingNewParent && (
            // New parent row for adding
            <tr>
              <td>{/* ID column (empty) */}</td>
              {/* Keyword */}
              <td>
                <input
                  type="text"
                  value={editedParent.keyword}
                  className="big-input"
                  placeholder="關鍵字"
                  onChange={(e) =>
                    setEditedParent({
                      ...editedParent,
                      keyword: e.target.value,
                    })
                  }
                />
              </td>
              {/* Server */}
              <td>
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
              </td>
              {/* Type */}
              <td>
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
              </td>
              {/* Include */}
              <td>
                <input
                  type="text"
                  value={editedChild.include}
                  className="big-input"
                  placeholder="包含(a+b)"
                  onChange={(e) =>
                    setEditedChild({
                      ...editedChild,
                      include: e.target.value,
                    })
                  }
                />
              </td>
              {/* Exclude */}
              <td>
                <input
                  type="text"
                  value={editedChild.exclude}
                  className="big-input"
                  placeholder="排除(a+b)"
                  onChange={(e) =>
                    setEditedChild({
                      ...editedChild,
                      exclude: e.target.value,
                    })
                  }
                />
              </td>
              {/* Set Refine */}
              <td>
                <input
                  type="number"
                  value={editedChild.set_refine}
                  className="small-input"
                  placeholder="精煉值"
                  onChange={(e) =>
                    setEditedChild({
                      ...editedChild,
                      set_refine: e.target.value,
                    })
                  }
                />
              </td>
              {/* Set Level */}
              <td>
                <select
                  value={editedChild.set_level}
                  className="form-select form-select-sm"
                  onChange={(e) =>
                    setEditedChild({
                      ...editedChild,
                      set_level: e.target.value,
                    })
                  }
                >
                  {levelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
              {/* Set Price */}
              <td>
                <input
                  type="number"
                  value={editedChild.set_price}
                  className="big-input"
                  placeholder="設定價格"
                  onChange={(e) =>
                    setEditedChild({
                      ...editedChild,
                      set_price: e.target.value,
                    })
                  }
                />
              </td>
              {/* Empty */}
              <td></td>
              <td></td>
              <td>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => {
                    handleSaveNewParent();
                  }}
                >
                  保存
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    handleCancelAddNewParent();
                  }}
                >
                  取消
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/*                   */}
      {/* Add parent button */}
      {/*                   */}
      {!addingNewParent && !addingChildMode && (
        <div>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleAddNewParent}
          >
            新增關鍵字
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomerTable;
