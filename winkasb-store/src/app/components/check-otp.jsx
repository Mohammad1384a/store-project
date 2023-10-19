import { useEffect } from "react";
import styles from "../page.module.css";
import { IoIosArrowBack } from "react-icons/io";

function CheckOTP({
  timer,
  setStep,
  setTimer,
  getOTP,
  otp,
  setOTP,
  mutate,
  loading,
}) {
  useEffect(() => {
    setTimeout(() => {
      setTimer((t) => t && t > 0 && t - 1);
    }, 1000);
  }, [timer]);
  return (
    <form onSubmit={(e) => mutate(e)} className={styles.loginForm}>
      <div className={timer > 0 ? styles.timerGoing : styles.resend}>
        <span
          onClick={() => {
            setStep(1);
            setTimer(90);
          }}
        >
          <IoIosArrowBack className={styles.backIcon} />
          Edit Phone
        </span>
        {timer > 0 ? (
          <p>haven't got the SMS? wait for {timer} </p>
        ) : (
          <a
            onClick={(e) => {
              getOTP(e);
              setTimer(90);
            }}
          >
            resend SMS
          </a>
        )}
      </div>
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
