"use client";
import styles from "../page.module.css";

function CompleteProfile() {
  return (
    <form onSubmit={(e) => mutate(e)} className={styles.completeProfile}>
      <div>
        <section>
          <label htmlFor="first_name">firstName:</label>
          <input type="text" name="first_name" maxLength="20" minLength="2" />
        </section>
        <section>
          <label htmlFor="last_name">lastName:</label>
          <input type="text" name="last_name" maxLength="20" minLength="2" />
        </section>
        <section>
          <label htmlFor="username">username:</label>
          <input type="text" name="username" maxLength="30" minLength="5" />
        </section>
        <section>
          <label htmlFor="email">email:</label>
          <input type="email" name="email" maxLength="20" minLength="2" />
        </section>
      </div>
      <div>
        <section>
          <label htmlFor="password">password:</label>
          <input type="password" name="password" minLength="8" />
        </section>
        <section>
          <label htmlFor="confirm_password">
            confirmPassword:&nbsp;&nbsp;{" "}
          </label>
          <input
            type="confirm_password"
            name="confirm_password"
            minLength="8"
          />
        </section>
        <section>
          <label htmlFor="birthday">birthday:</label>
          <input type="text" name="birthday" maxLength="20" minLength="2" />
        </section>
        <button type="submit">Update info</button>
      </div>
    </form>
  );
}

export default CompleteProfile;
