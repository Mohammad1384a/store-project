import Image from "next/image";
import { BiTrashAlt } from "react-icons/bi";
import styles from "../../(admin)/admin.module.css";
import DeleteProduct from "./delete-product";
import { Fragment, useEffect, useState } from "react";

function ProductsList({ products }) {
  const [productToDelete, setProductDeletion] = useState(false);
  const [productList, setProductList] = useState(false);

  useEffect(() => {
    setProductList(products);
  }, [products]);

  return (
    <Fragment>
      {productToDelete && (
        <DeleteProduct
          setProductList={setProductList}
          deleteProduct={productToDelete}
          setDeleteProduct={setProductDeletion}
        />
      )}
      {productList?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Image</th>
              <th>Remove Product</th>
            </tr>
          </thead>
          <tbody>
            {products?.length > 0 &&
              products.map((p) => {
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
        <h3>You Have No Products!</h3>
      )}
    </Fragment>
  );
}

export default ProductsList;
