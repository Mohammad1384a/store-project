"use client";
import DeleteProduct from "@/app/components/vendor/delete-product";
import http from "@/app/axios-instances";
import styles from "../admin.module.css";
import { Fragment, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import ProductsList from "../../components/vendor/products-list";
import { useCookies } from "react-cookie";
import { MutatingDots } from "react-loader-spinner";
import { useMutation } from "@tanstack/react-query";

function VendorPage() {
  const [products, setProducts] = useState(false);
  const [isUserLoggedIn] = useCookies(["user"]);

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
      <div className={styles.vendorPage}>
        <h3>My Products List</h3>
        {isLoading && (
          <MutatingDots
            color="#81858b"
            secondaryColor="#81858b"
            radius="12.5"
            ariaLabel="mutating-dots-loading"
            wrapperClass={styles.loadingComponent}
            visible={true}
          />
        )}
        {products && <ProductsList products={products} />}
      </div>
    </Fragment>
  );
}

export default VendorPage;
