import styles from "../page.module.css";

function LoginPage({ phone, setPhone, mutate, loading }) {
  return (
    <form onSubmit={(e) => mutate(e)} className={styles.loginForm}>
      <h3>{loading ? "sending SMS" : "Please enter you phone number"}</h3>
      <section>
        <label htmlFor="phone">Phone:</label>
        <input
          type="text"
          inputMode="numberic"
          value={phone}
          maxLength="11"
          onChange={(e) => setPhone(e.target.value)}
          name="phone"
        />
      </section>
      <button type="submit" disabled={loading}>
        get OTP
      </button>
    </form>
  );
}

export default LoginPage;
