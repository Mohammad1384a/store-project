"use client";
import { Fragment, useEffect, useState } from "react";
import { BiTrashAlt } from "react-icons/bi";
import DeleteUser from "./delte-user";

function UserList({ type, users, setUsers }) {
  const [userList, setUserList] = useState(undefined);
  const [deleteUserAssurance, setUserDeletion] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (userList) {
      const newUserList = users?.filter((user) => {
        return user._id !== userId;
      });
      setUsers(newUserList);
    }
  }, [userList]);

  useEffect(() => {
    const selectedUsers = users?.filter((user) => {
      return user.roles?.includes(type);
    });
    setUserList(selectedUsers);
  }, [type]);
  return (
    <Fragment>
      {userId && (
        <DeleteUser
          visibility={deleteUserAssurance}
          setVisibility={setUserDeletion}
          userId={userId}
          userList={userList}
          setUserList={setUserList}
        />
      )}
      {!userList || userList?.length === 0 ? (
        <h2>There is no {type}</h2>
      ) : (
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone</th>
              <th>Username</th>
              <th>Email</th>
              <th>Remove User</th>
            </tr>
          </thead>
          <tbody>
            {userList &&
              userList?.map((user) => {
                return (
                  <tr key={user?._id}>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.phone}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <BiTrashAlt
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setUserId(user._id);
                          setUserDeletion(true);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </Fragment>
  );
}

export default UserList;
