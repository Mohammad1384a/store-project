"use client";
import http from "@/app/axios-instances";
import styles from "../admin.module.css";
import { Fragment, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import { useCookies } from "react-cookie";
import { MutatingDots } from "react-loader-spinner";
import { useMutation } from "@tanstack/react-query";
import AddProduct from "../../components/vendor/add-product";
import { BiTrashAlt } from "react-icons/bi";
import DeleteProduct from "@/app/components/vendor/delete-product";

function VendorPage() {
  const [products, setProducts] = useState(false);
  const [productToDelete, setProductDeletion] = useState(false);
  const [isUserLoggedIn] = useCookies(["user"]);
  // true means adding product currently and false means product list
  const [addingProduct, setPageStatus] = useState(false);

  async function fetchUserProducts() {
    try {
      const { data } = await http.get(
        `admin/product/myproducts/${isUserLoggedIn?.user?._id}`,
        {
          headers: { Authorization: "Bearer " + isUserLoggedIn?.user?.token },
        }
      );
      return (
        data?.status === 200 && data?.products && setProducts(data?.products)
      );
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: fetchUserProducts,
  });

  useEffect(() => {
    if (!products) {
      mutateAsync();
    }
  }, [products]);

  return (
    <Fragment>
      <Toaster />
      {addingProduct ? (
        <AddProduct setPageStatus={setPageStatus} setProducts={setProducts} />
      ) : (
        <div className={styles.vendorPage}>
          <span>
            <h3>My Products List</h3>{" "}
            <h3 onClick={() => setPageStatus(true)}>Add New Product?</h3>
          </span>
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
            <Fragment>
              {productToDelete && (
                <DeleteProduct
                  setProductList={setProducts}
                  productToDelete={productToDelete}
                  setDeleteProduct={setProductDeletion}
                />
              )}
              {products?.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Image</th>
                      <th>Remove Product</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      return (
                        <tr>
                          <td>{p.title}</td>
                          {p?.images?.length > 0 ? (
                            <td>
                              <Image
                                loader={() => p.images[0]}
                                src={p.images[0]}
                                className={styles.productImage}
                                width={150}
                                height={150}
                                alt="sth"
                              />
                            </td>
                          ) : (
                            "Image Not Found"
                          )}
                          <td>
                            <BiTrashAlt
                              style={{ cursor: "pointer", fontSize: "x-large" }}
                              onClick={() => setProductDeletion(p._id)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                products?.length === 0 && <h3>You Have No Products!</h3>
              )}
            </Fragment>
          )}
        </div>
      )}
    </Fragment>
  );
}

export default VendorPage;
