"use client";
import { useEffect, useState } from "react";
import styles from "../../(admin)/admin.module.css";
import http from "@/app/axios-instances";
import { toast, Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";

function AddProduct() {
  const [categories, setCategories] = useState(false);
  const [inputs, setInputs] = useState({
    title: "",
    brief_text: "",
    images: [],
    tag: "",
    category: "",
    price: 0,
    description: "",
    discount: 0,
    quentity: 0,
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    colors: [],
    model: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [colors, setSelectedColors] = useState([]);
  const [isUserLoggedIn] = useCookies(["user"]);
  const [tags, setTags] = useState(["hello"]);
  const [colorOptions] = useState([
    { value: "red", label: "red" },
    { value: "green", label: "green" },
    { value: "black", label: "black" },
    { value: "white", label: "white" },
    { value: "colorful", label: "colorful" },
  ]);

  async function fetchCategories() {
    try {
      const { data } = await http.get("/admin/category/all", {
        headers: { Authorization: "Bearer " + isUserLoggedIn?.user?.token },
      });
      const titles =
        data?.status === 200 &&
        data?.categories &&
        data.categories.map((c) => {
          return { label: c.title, value: c.title };
        });
      return setCategories(titles);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }

  useEffect(() => {
    if (!categories) {
      fetchCategories();
    }
  }, [categories]);

  function handleInputChange(e) {
    if (e.target.name === "image") {
      return setInputs({ ...inputs, images: e.target.files });
    }
    console.log(inputs);
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  return (
    <div className={styles.addProduct}>
      <Toaster />
      <h3>Add New Product:</h3>
      {categories?.length > 0 && (
        <section>
          <div>
            <span>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={inputs.title}
                onChange={(e) => handleInputChange(e)}
              />
            </span>
            <span>
              <label htmlFor="brief_text">Brief Text:</label>
              <input
                type="text"
                name="brief_text"
                placeholder="brief_text"
                value={inputs.brief_text}
                onChange={(e) => handleInputChange(e)}
              />
            </span>
            <span>
              <label htmlFor="image">Images:</label>
              <input
                type="file"
                name="image"
                multiple
                onChange={(e) => handleInputChange(e)}
              />
            </span>
            <span className={styles.tagsPart}>
              <span>
                <label htmlFor="tags">Tags:</label>
                <input
                  type="text"
                  onChange={(e) =>
                    setInputs({ ...inputs, tag: e.target.value })
                  }
                  value={inputs.tag}
                  name="tags"
                  placeholder="Tags"
                />
              </span>
              <button
                onClick={() => {
                  if (inputs.tag?.length > 10 || inputs.tag?.length === 0) {
                    return (
                      toast.error("tag must not me more thatn 10 characters") &&
                      setInputs({ ...inputs, tag: "" })
                    );
                  }
                  if (tags?.length >= 4) {
                    return toast.error(
                      "you cannot nominate more than four tags"
                    );
                  }
                  setTags([...tags, inputs.tag]);
                  setInputs({ ...inputs, tag: "" });
                }}
              >
                Add Tag
              </button>
            </span>
            <span>
              {tags?.length > 0 && (
                <ul>
                  {tags.map((t) => {
                    return <li key={t}>{t}</li>;
                  })}
                </ul>
              )}
            </span>
            <span className={styles.selectParent}>
              <label htmlFor="category">Category: </label>
              <div>
                <select name="category">
                  {categories.map((c) => {
                    return (
                      <option value={c.value} key={c.value}>
                        {c.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </span>
            <span>
              <label htmlFor="price">Price:</label>
              <input
                value={inputs.price}
                onChange={(e) => handleInputChange(e)}
                type="number"
                inputMode="numeric"
                name="price"
                placeholder="Price"
              />
            </span>
            <span>
              <label htmlFor="discount">Discount:</label>
              <input
                value={inputs.discount}
                onChange={(e) => handleInputChange(e)}
                type="number"
                inputMode="numeric"
                name="discount"
                placeholder="Discount"
              />
            </span>
          </div>
          <div>
            <span>
              <label htmlFor="quentity">Quentity:</label>
              <input
                value={inputs.quentity}
                onChange={(e) => handleInputChange(e)}
                type="number"
                inputMode="numeric"
                name="quentity"
                placeholder="Quentity"
              />
            </span>
            <span>
              <label htmlFor="length">Length:</label>
              <input
                value={inputs.length}
                onChange={(e) => handleInputChange(e)}
                type="number"
                inputMode="numeric"
                name="length"
                placeholder="Length"
              />
            </span>
            <span>
              <label htmlFor="width">Width:</label>
              <input
                value={inputs.width}
                onChange={(e) => handleInputChange(e)}
                type="number"
                inputMode="numeric"
                name="width"
                placeholder="Width"
              />
            </span>
            <span>
              <label htmlFor="height">Height:</label>
              <input
                value={inputs.height}
                onChange={(e) => handleInputChange(e)}
                type="number"
                inputMode="numeric"
                name="height"
                placeholder="Height"
              />
            </span>
            <span>
              <label htmlFor="weight">Weight:</label>
              <input
                value={inputs.weight}
                onChange={(e) => handleInputChange(e)}
                type="number"
                inputMode="numeric"
                name="weight"
                placeholder="Weight"
              />
            </span>
            <span className={styles.selectParent}>
              <label htmlFor="colors">Colors: </label>
              <div>
                <select name="colors">
                  {colorOptions.map((c) => {
                    return (
                      <option value={c.value} key={c.value}>
                        {c.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </span>
            <span>
              <label htmlFor="model">Model:</label>
              <input
                type="text"
                name="model"
                placeholder="Model"
                value={inputs.model}
                onChange={(e) => handleInputChange(e)}
              />
            </span>
          </div>
          <div>
            <span>
              <label htmlFor="description">Body Description:</label>
              <textarea
                name="description"
                cols="30"
                rows="10"
                value={inputs.description}
                onChange={(e) => handleInputChange(e)}
              ></textarea>
            </span>
            <button>Add Product</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default AddProduct;
