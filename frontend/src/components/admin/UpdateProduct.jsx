import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../layout/Loader";
import toast from "react-hot-toast";
import {
  clearProductDetailsErrors,
  updateProduct,
  resetUpdateProduct,
  getProductDetails,
} from "../../slices/productSlice";
import Sidebar from "./Sidebar";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const categories = [
    "Electronics",
    "Cameras",
    "Laptop",
    "Accessories",
    "Headphones",
    "Food",
    "Books",
    "Clothes/Shoes",
    "Sports",
    "Beauty/Health",
    "Outdoor",
    "Home",
  ];
  const dispatch = useDispatch();
  const {
    loading,
    error,
    isUpdated,
    productDetails: product,
  } = useSelector((state) => state.productDetails);
  const { id } = useParams();
  useEffect(() => {
    if (product && product._id !== id) {
      dispatch(getProductDetails(id));
    } else {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setCategory(product.category);
      setSeller(product.seller);
      setStock(product.stock);
      setOldImages(product.images);
      // console.log(product.images);
    }
    if (error) {
      toast.error(error);
      dispatch(clearProductDetailsErrors());
    }
    if (isUpdated) {
      navigate("/admin/products");
      toast.success("Product updated succesfully.");
      dispatch(resetUpdateProduct());
    }
  }, [dispatch, toast, error, isUpdated, navigate, product, id]);
  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price);
    formData.set("description", description);
    formData.set("category", category);
    formData.set("stock", stock);
    formData.set("seller", seller);
    images.forEach((image) => {
      formData.append("images", image);
    });
    dispatch(updateProduct({ id, productData: formData }));
  };
  const onChange = (e) => {
    const files = Array.from(e.target.files);

    // Clear only the preview and new images, NOT oldImages
    setImagesPreview([]);
    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  return (
    <Fragment>
      <MetaData title={"Update Product"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            <div className="wrapper my-5">
              <form
                className="shadow-lg"
                encType="multipart/form-data"
                onSubmit={submitHandler}
              >
                <h1 className="mb-4">Update Product</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price_field">Price</label>
                  <input
                    type="text"
                    id="price_field"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description_field">Description</label>
                  <textarea
                    className="form-control"
                    id="description_field"
                    rows="8"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="category_field">Category</label>
                  <select
                    className="form-control"
                    id="category_field"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Choose Category...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="stock_field">Stock</label>
                  <input
                    type="number"
                    id="stock_field"
                    className="form-control"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="seller_field">Seller Name</label>
                  <input
                    type="text"
                    id="seller_field"
                    className="form-control"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Images</label>

                  <div className="custom-file">
                    <input
                      type="file"
                      name="product_images"
                      className="custom-file-input"
                      id="customFile"
                      onChange={onChange}
                      multiple
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      Choose Images
                    </label>
                  </div>
                  {oldImages &&
                    oldImages.map((img) => (
                      <img
                        key={img}
                        src={img.url}
                        alt={img.url}
                        className="mt-3 mr-2"
                        width="55"
                        height="52"
                      />
                    ))}
                  {imagesPreview.map((img) => (
                    <img
                      src={img}
                      key={img}
                      alt="Images Preview"
                      className="mt-3 mr-2"
                      width="55"
                      height="52"
                    />
                  ))}
                </div>

                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                  disabled={loading ? true : false}
                >
                  Update
                </button>
              </form>
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;
