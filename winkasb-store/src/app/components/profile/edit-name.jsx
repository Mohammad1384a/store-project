import styles from "../../(profile)/profile.module.css";

function EditName({ inputType, nameInput, setInput }) {
  return (
    <section className={styles.editName}>
      <label htmlFor={inputType}>{inputType}:</label>
      <input
        type={inputType === "email" ? "email" : "text"}
        name={inputType}
        value={nameInput}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
    </section>
  );
}

export default EditName;
