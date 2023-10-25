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
    setEditIndex(index);
    setEditedParent({ ...parent });
  };

  // Handle child's the "Edit" button click
  const handleChildEdit = (child, index) => {
    setEditIndex(index);
    setEditedChild({ ...child });
  };

  // "UPDATE"
  // Update a parent
  const handleParentUpdate = (parentId) => {};

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
            <th scope="col">Keywrod</th>
            <th scope="col">Server</th>
            <th scope="col">Type</th>
            <th scope="col">Include</th>
            <th scope="col">Exclude</th>
            <th scope="col">Set Price</th>
            <th scope="col">New Price</th>
            <th scope="col">Nofi Time</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {parentList.map((parent, index) => (
            <React.Fragment key={parent.id}>
              <tr>
                <td>{serialNumber++}</td>
                <td>
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editedParent.keyword}
                      className="form-control"
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
                <td>{parent.svr}</td>
                <td>{parent.type}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  {editIndex === index ? (
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
                        onClick={() => setEditIndex(-1)}
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
                        onClick={() => handleParentEdit(parent, index)}
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
              {childMap[parent.id] &&
                childMap[parent.id].map((child) => (
                  <tr key={child.id}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{child.include}</td>
                    <td>{child.exclude}</td>
                    <td>{child.set_price}</td>
                    <td>{child.new_price}</td>
                    <td>{child.nofi_time}</td>
                    <td>
                      <button type="button" className="btn btn-sm btn-warning">
                        重置
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
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
