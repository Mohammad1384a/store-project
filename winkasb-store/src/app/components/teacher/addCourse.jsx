import { Fragment, useEffect, useState } from "react";
import { fetchCategories } from "../fetch-categories";
import styles from "../../(admin)/admin.module.css";
import { Toaster, toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { MutatingDots } from "react-loader-spinner";
import { useCookies } from "react-cookie";

function AddCourse({ inputs, setInputs }) {
  const [categories, setCategories] = useState(false);
  const [isUserLoggedIn] = useCookies(["user"]);
  const { isLoading, error, mutateAsync, data } = useMutation({
    mutationFn: fetchCategories,
  });

  useEffect(() => {
    if (!categories) {
      mutateAsync(isUserLoggedIn?.user?.token);
    }
  }, [categories]);

  useEffect(() => {
    console.log(data);
    data ? setCategories(data) : error && toast.error(error);
  }, [data, error]);

  return (
    <Fragment>
      <Toaster />
      {isLoading ? (
        <MutatingDots
          color="#81858b"
          secondaryColor="#81858b"
          radius="12.5"
          ariaLabel="mutating-dots-loading"
          wrapperClass={styles.loadingComponent}
          visible={true}
        />
      ) : (
        categories?.length > 0 && (
          <div className={styles.addCourse}>
            <section>
              <span>
                <label htmlFor="title">Title: </label>
                <input
                  type="text"
                  name="title"
                  value={inputs.title}
                  onChange={(e) =>
                    setInputs({ ...inputs, title: e.target.value })
                  }
                />
              </span>
              <span>
                <label htmlFor="brief_text">Brief Text: </label>
                <input
                  type="text"
                  name="brief_text"
                  value={inputs.brief_text}
                  onChange={(e) =>
                    setInputs({ ...inputs, brief_text: e.target.value })
                  }
                />
              </span>
              <input type="file" name="image" multiple={false} />
              <span>
                <label htmlFor="status">Status: </label>
                <div>
                  <select
                    name="status"
                    onChange={(e) =>
                      setInputs({ ...inputs, status: e.target.value })
                    }
                  >
                    <option value="notStarted">Not Started</option>
                    <option value="onGoing">On Going</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </span>
              <span className={styles.tags}>
                <span>
                  <label htmlFor="tags">Tag</label>
                  <input
                    type="text"
                    name="tag"
                    value={inputs.tag}
                    onChange={(e) =>
                      setInputs({ ...inputs, tag: e.target.value })
                    }
                  />
                </span>
                <button
                  onClick={() => {
                    const tags = inputs.tags;
                    if (tags?.length >= 4) {
                      setInputs({ ...inputs, tag: "" });
                      return toast.error("you can choose up to 4 tags");
                    } else if (tags?.includes(inputs.tag)) {
                      setInputs({ ...inputs, tag: "" });
                      return toast.error("tag already selected");
                    } else if (
                      !inputs.tag ||
                      inputs.tag?.length < 3 ||
                      inputs.tag?.length > 10
                    ) {
                      setInputs({ ...inputs, tag: "" });
                      return toast.error("tag must be 3-10 characters");
                    }
                    tags.push(inputs.tag);
                    setInputs({ ...inputs, tags });
                    return setInputs({ ...inputs, tag: "" });
                  }}
                >
                  Add
                </button>
              </span>
              {inputs.tags?.length > 0 && (
                <span className={styles.tagsMap}>
                  <ul>
                    {inputs.tags.map((t) => {
                      return <li key={t}>#{t}</li>;
                    })}
                  </ul>
                </span>
              )}
            </section>
            <section>
              <span>
                <label htmlFor="price">Price: </label>
                <input
                  type="number"
                  name="price"
                  value={inputs.price}
                  onChange={(e) =>
                    setInputs({ ...inputs, price: e.target.value })
                  }
                />
              </span>
              <span>
                <label htmlFor="discount">Discount: </label>
                <input
                  type="number"
                  name="discount"
                  value={inputs.discount}
                  onChange={(e) =>
                    setInputs({ ...inputs, discount: e.target.value })
                  }
                />
              </span>
              <span>
                <label htmlFor="value">Value:</label>
                <div>
                  <select
                    name="value"
                    value={inputs.value}
                    onChange={(e) =>
                      setInputs({ ...inputs, value: e.target.value })
                    }
                  >
                    <option value="free">Free</option>
                    <option value="monetary">Monetary</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </span>
              <span>
                <label htmlFor="category">Category: </label>
                <div>
                  <select
                    name="category"
                    value={inputs.category}
                    onChange={(e) =>
                      setInputs({ ...inputs, category: e.target.value })
                    }
                  >
                    {categories.map((c) => {
                      return (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </span>
            </section>
            <section>
              <aside>
                <label htmlFor="description">Description: </label>
                <textarea
                  name="description"
                  cols="30"
                  rows="10"
                  value={inputs.description}
                  onChange={(e) =>
                    setInputs({ ...inputs, description: e.target.value })
                  }
                ></textarea>
              </aside>
              <button type="submit">Add Course</button>
            </section>
          </div>
        )
      )}
    </Fragment>
  );
}

export default AddCourse;
