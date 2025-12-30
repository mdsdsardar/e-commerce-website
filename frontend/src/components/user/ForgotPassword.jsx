import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { clearError, forgotPassword } from "../../slices/userSlice";
export const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, message, loading } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  useEffect(() => {
    // Dispatch the async thunk to fetch products
    if (error) {
      toast.error(error); // 🔥 replacement
      dispatch(clearError());
      return;
    }
    if (message) {
      toast.success(message); // 🔥 replacement
    }
  }, [dispatch, error, message]);
  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("email", email);
    dispatch(forgotPassword(formData));
  };
  return (
    <div>
      <MetaData title={"Forgot Password"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">Forgot Password</h1>
            <div className="form-group">
              <label htmlFor="email_field">Enter Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              id="forgot_password_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading ? true : false}
            >
              Send Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
