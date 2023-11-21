import { useCookies } from "react-cookie";
import styles from "../../(admin)/admin.module.css";
import { GrClose } from "react-icons/gr";
import { useMutation } from "@tanstack/react-query";
import { MutatingDots } from "react-loader-spinner";
import { toast, Toaster } from "react-hot-toast";
import http from "@/app/axios-instances";

function DeleteProduct({ deleteProduct, setDeleteProduct, setProductList }) {
  const [isUserLoggedIn] = useCookies(["user"]);

  async function deleteProductById() {
    try {
      const token = isUserLoggedIn?.user?.token;
      const { data } = await http.delete(`admin/product/${deleteProduct}`, {
        headers: { Authorization: "Bearer " + token },
      });
      data.status === 200 &&
        data?.remove &&
        setProductList((prev) => prev.filter((e) => e._id !== deleteProduct));
      return toast.success("Product Deleted Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: deleteProductById,
  });

  return (
    <div className={deleteProduct ? styles.deleteProduct : styles.none}>
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
        <section>
          <div>
            <h4>Sure You Want To Delete Product?</h4>
            <GrClose
              onClick={() => setDeleteProduct(false)}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div>
            <button onClick={() => mutateAsync()}>Yes</button>
            <button onClick={() => setDeleteProduct(false)}>No</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default DeleteProduct;
