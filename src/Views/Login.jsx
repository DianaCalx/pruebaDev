import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../context/UserContext";
import "./Login.css";

export const Login = () => {
  const { info, user, setUser, postUser } = useContext(UserContext);
  const [errors, setErrors] = useState(null);
  const [errorUser, setErrorUser] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (info.empresa) {
      navigate("/table");
      setUser({ email: "", password: "" });
    }
  }, [info, navigate, setUser]);

  const handleChange = (e) => {
    setErrors({
      ...errors,
      [e.target.name]: "",
    });

    setErrorUser(false);

    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      currentErrors.email = "Invalid email";
    }

    if (user.password.length < 4) {
      currentErrors.password = "The password must have more than 4 characters.";
    }

    if (Object.keys(currentErrors).length) {
      setErrors(currentErrors);
      return;
    }

    await postUser();
    // setFormSubmited(true);
    if (!info?.empresa) {
      setErrorUser(true);
    }
  };

  return (
    <div className="login__container">
      <h1>Login</h1>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="form"
      >
        <div className="form__data">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={(e) => handleChange(e)}
            style={{ width: "100%" }}
          />
          {errors?.email && <p className="login__error">{errors?.email}</p>}
        </div>
        <div className="form__data">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={(e) => handleChange(e)}
          />
          {errors?.password && (
            <p className="login__error">{errors?.password}</p>
          )}
        </div>
        {errorUser && <p className="login__error">Invalid User</p>}
        <button
          type="submit"
          className="form__button"
        >
          Login
        </button>
      </form>
    </div>
  );
};
