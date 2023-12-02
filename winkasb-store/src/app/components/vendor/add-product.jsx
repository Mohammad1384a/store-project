"use client";
import { useEffect, useState } from "react";
import styles from "../../(admin)/admin.module.css";
import http from "@/app/axios-instances";
import { toast, Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";
import Select from "react-select";

function AddProduct() {
  const [categories, setCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(false);
  const [colors, setSelectedColors] = useState([]);
  const [isUserLoggedIn] = useCookies(["user"]);
  const [tags, setTags] = useState(["hello"]);

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

  const selectStyle = {
    control: (base) => ({
      ...base,
      border: 0,
      outline: "none",
      borderRadius: 0,
      width: "231px",
      height: "37px",
      backgroundColor: "none",
      // This line disable the blue border
      boxShadow: "none",
    }),
  };

  return (
    <div className={styles.addProduct}>
      <Toaster />
      <h3>Add New Product:</h3>
      {categories?.length > 0 && (
        <section>
          <span>
            <label htmlFor="title">Title:</label>
            <input type="text" name="title" placeholder="Title" />
          </span>
          <span>
            <label htmlFor="brief_text">Brief Text:</label>
            <input type="text" name="brief_text" placeholder="brief_text" />
          </span>
          <span>
            <label htmlFor="image">Images:</label>
            <input type="file" name="image" multiple />
          </span>
          <span>
            <label htmlFor="tags">Tags:</label>
            <input type="text" name="tags" placeholder="Tags" />
            {tags?.length > 0 && (
              <ul>
                {tags.map((t) => {
                  return <li key={t}>{t}</li>;
                })}
              </ul>
            )}
          </span>
          <span>
            <label htmlFor="categories">Categories:</label>
            <Select
              instanceId="categories"
              styles={selectStyle}
              placeholder="Categories"
              options={categories}
              onChange={(value) => setCategories(value || "")}
              classNamePrefix="select"
            />
          </span>
          <span>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              inputMode="numeric"
              name="price"
              placeholder="Price"
            />
          </span>
          <span>
            <label htmlFor="discount">Discount:</label>
            <input
              type="number"
              inputMode="numeric"
              name="discount"
              placeholder="Discount"
            />
          </span>
          <span>
            <label htmlFor="quentity">Quentity:</label>
            <input
              type="number"
              inputMode="numeric"
              name="quentity"
              placeholder="Quentity"
            />
          </span>
          <div>
            <span>
              <label htmlFor="length">Length:</label>
              <input
                type="number"
                inputMode="numeric"
                name="length"
                placeholder="Length"
              />
            </span>
            <span>
              <label htmlFor="width">Width:</label>
              <input
                type="number"
                inputMode="numeric"
                name="width"
                placeholder="Width"
              />
            </span>
            <span>
              <label htmlFor="height">Height:</label>
              <input
                type="number"
                inputMode="numeric"
                name="height"
                placeholder="Height"
              />
            </span>
            <span>
              <label htmlFor="weight">Weight:</label>
              <input
                type="number"
                inputMode="numeric"
                name="weight"
                placeholder="Weight"
              />
            </span>
            <span>
              <label htmlFor="colors">Colors:</label>
              <Select
                instanceId="categories"
                styles={selectStyle}
                placeholder="Colors"
                options={[
                  { value: "red", label: "red" },
                  { value: "green", label: "green" },
                  { value: "black", label: "black" },
                  { value: "white", label: "white" },
                  { value: "colorful", label: "colorful" },
                ]}
                onChange={(value) => setSelectedColors(value || "")}
                isMulti
                classNamePrefix="select"
              />
            </span>
            <span>
              <label htmlFor="model">Model:</label>
              <input type="text" name="model" placeholder="Model" />
            </span>
          </div>
          <span>
            <label htmlFor="body">Body Description:</label>
            <textarea name="body" cols="30" rows="10"></textarea>
          </span>
        </section>
      )}
    </div>
  );
}

export default AddProduct;
