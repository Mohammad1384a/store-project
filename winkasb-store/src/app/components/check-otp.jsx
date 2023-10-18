import styles from "../page.module.css";

function CheckOTP({ otp, setOTP, mutate, loading }) {
  return (
    <form onSubmit={(e) => mutate(e)} className={styles.loginForm}>
      <h3>{loading ? "Validating otp..." : "Please enter sent password"}</h3>
      <section>
        <label htmlFor="otp">otp:</label>
        <input
          type="text"
          inputMode="numberic"
          value={otp}
          maxLength="5"
          onChange={(e) => setOTP(e.target?.value)}
          name="otp"
        />
      </section>
      <button type="submit" disabled={loading}>
        check password
      </button>
    </form>
  );
}

export default CheckOTP;
