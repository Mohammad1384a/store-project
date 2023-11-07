"use client";
import { useState } from "react";
import styles from "../../(profile)/profile.module.css";

function EditPassword({ input, setInput, newPassword, setNewPassword }) {
  const [hasUserEdited, setUserEditattion] = useState(false);

  return (
    <div className={styles.editPassword}>
      <section>
        <label htmlFor="password">Current Password:</label>
        <input
          type="text"
          name="password"
          value={hasUserEdited ? input : ""}
          onChange={(e) => {
            !hasUserEdited && setUserEditattion(true);
            setInput(e.target.value);
          }}
        />
      </section>
      <section>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="text"
          name="newPassword"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
        />
      </section>
    </div>
  );
}

export default EditPassword;
