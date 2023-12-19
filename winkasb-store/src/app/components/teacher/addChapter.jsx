import { useMutation } from "@tanstack/react-query";
import styles from "../../(admin)/admin.module.css";
import { Toaster, toast } from "react-hot-toast";

function AddChapter({ inputs, setInputs }) {
  async function addChapter() {
    try {
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }
  const { isLoading, mutateAsync } = useMutation({ mutationFn: addChapter });

  return (
    <div className={styles.addChapter}>
      <Toaster />
      <span>
        <label htmlFor="title">Title: </label>
        <input
          type="text"
          value={inputs.title}
          name="title"
          onChange={(e) => {
            setInputs({ ...inputs, title: e.target.value });
          }}
        />
      </span>
      <span>
        <label htmlFor="body">Body Description: </label>
        <textarea
          cols="30"
          rows="10"
          type="text"
          name="body"
          value={inputs.body}
          onChange={(e) => setInputs({ ...inputs, body: e.target.value })}
        />
        <button onClick={() => mutateAsync()}>Add Chapter</button>
      </span>
    </div>
  );
}

export default AddChapter;
