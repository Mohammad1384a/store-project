"use client";
import { useEffect, useState } from "react";
import { fetchCategories } from "../fetch-categories";
import styles from "../../(admin)/admin.module.css";
import http from "@/app/axios-instances";
import { toast, Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";
import { useMutation } from "@tanstack/react-query";
import { GrClose } from "react-icons/gr";
import { MutatingDots } from "react-loader-spinner";

function AddProduct({ setPageStatus, setProducts }) {
  const [categories, setCategories] = useState(false);
  const [isUserLoggedIn] = useCookies(["user"]);
  const [inputs, setInputs] = useState({
    title: "",
    brief_text: "",
    images: [],
    vendor: isUserLoggedIn?.user?._id,
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
  const [tags, setTags] = useState([]);
  const [colorOptions] = useState([
    { value: "red", label: "red" },
    { value: "green", label: "green" },
    { value: "black", label: "black" },
    { value: "white", label: "white" },
    { value: "colorful", label: "colorful" },
  ]);

  const { mutateAsync, isLoading, data, error } = useMutation({
    mutationFn: fetchCategories,
  });

  useEffect(() => {
    console.log(data);
    data ? setCategories(data) : error && toast.error(error);
  }, [data, error]);

  useEffect(() => {
    if (!categories) {
      mutateAsync(isUserLoggedIn?.user?.token);
    }
  }, [categories]);

  function handleInputChange(e) {
    if (e.target.name === "image") {
      return setInputs({ ...inputs, images: e.target.files });
    }
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  async function createProduct() {
    try {
      if (inputs.images?.length > 5 || inputs.images?.length < 2) {
        return toast.error("you can choose 2-5 images");
      }
      const formData = new FormData();
      Object.keys(inputs)?.forEach((i) => {
        if (i === "colors") {
          inputs[i].forEach((e) => {
            formData.append(i, e);
          });
        } else if (i === "images") {
          Array.from(inputs[i]).forEach((e) => {
            formData.append(i, e);
          });
        } else {
          i !== "tag" && formData.append(i, inputs[i]);
        }
      });
      const { data } = await http.post("admin/product/add", formData, {
        headers: { Authorization: "Bearer " + isUserLoggedIn?.user?.token },
      });
      console.log(data);
      if (data?.status === 200 && data?.product) {
        setProducts(false);
        return setPageStatus(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }

  const { mutateAsync: productMutation, isLoading: productLoading } =
    useMutation({ mutationFn: createProduct });

  return (
    <div className={styles.addProduct}>
      <Toaster />
      <h3>Add New Product:</h3>
      {isLoading || productLoading ? (
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
              <span className={styles.selectParent}>
                <label htmlFor="category">Category: </label>
                <div>
                  <select
                    name="category"
                    onChange={(e) => {
                      setInputs({ ...inputs, category: e.target.value });
                    }}
                  >
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
                    if (tags?.includes(inputs.tag)) {
                      return toast.error("tag already exists");
                    }
                    if (inputs.tag?.length > 10 || inputs.tag?.length < 3) {
                      return (
                        toast.error("tag must include 3-10 characters") &&
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
              {tags?.length > 0 && (
                <span className={styles.selectedPart}>
                  <ul>
                    {tags.map((t) => {
                      return (
                        <li
                          key={t}
                          onClick={() => {
                            const newTags = tags.filter((tag) => tag !== t);
                            setTags(newTags);
                          }}
                        >
                          #{t} <GrClose />
                        </li>
                      );
                    })}
                  </ul>
                </span>
              )}
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
              <span className={styles.selectParent}>
                <label htmlFor="colors">Colors: </label>
                <div>
                  <select
                    name="colors"
                    onChange={(e) => {
                      if (inputs.colors?.includes(e.target.value)) {
                        return toast.error("color already exists");
                      }
                      if (inputs?.colors?.length >= 3) {
                        return toast.error(
                          "You cannot choose more than 3 colors"
                        );
                      } else {
                        const items =
                          inputs?.colors?.length > 0 ? inputs.colors : [];
                        items.push(e.target.value);
                        inputs;
                        setInputs({ ...inputs, colors: items });
                      }
                    }}
                  >
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
              {inputs?.colors?.length > 0 && (
                <span className={styles.selectedPart}>
                  <ul>
                    {inputs?.colors?.map((c) => {
                      return (
                        <li
                          key={c}
                          onClick={() => {
                            const newColors = inputs.colors?.filter(
                              (color) => color !== c
                            );
                            setInputs({ ...inputs, colors: newColors });
                          }}
                        >
                          #{c}
                          <GrClose />
                        </li>
                      );
                    })}
                  </ul>
                </span>
              )}
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
              <button onClick={() => productMutation()}>Add Product</button>
            </div>
          </section>
        )
      )}
    </div>
  );
}

export default AddProduct;
