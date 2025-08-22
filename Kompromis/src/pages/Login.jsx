import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Netacan format email-a")
      .required("Email je obavezan"),
    password: Yup.string()
      .min(6, "Password mora biti najmanje 6 karaktera")
      .required("Password je obavezan"),
  });

  return (
    <div
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
      style={{ backgroundColor: "#129a5c" }}
    >
      <div
        className="bg-white p-6 rounded shadow-2xl w-full max-w-md"
        style={{ backgroundColor: "#f7c00b" }}
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              const response = await axios.get("http://localhost:3001/users", {
                params: { email: values.email, password: values.password },
              });
              if (response.data.length > 0) {
                const user = response.data[0];
                login(user.id, user.username, user.role);
                navigate(user.role === "admin" ? "/admin" : "/menu");
              } else {
                setFieldError("email", "Invalid email or password");
                setFieldError("password", "Invalid email or password");
                alert("Netacni podaci. Molimo proverite email i password.");
              }
            } catch (error) {
              alert("Neuspesan login. Molimo pokusajte kasnije.");
              console.error("Login error:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500">{errors.email}</p>
                )}
              </div>
              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 border rounded"
                />
                {errors.password && touched.password && (
                  <p className="text-red-500">{errors.password}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: isSubmitting ? "#85c9a2" : "#129a5c",
                }}
                className={`w-full p-2 rounded text-black transition ${
                  !isSubmitting
                    ? "hover:brightness-110 cursor-pointer"
                    : "cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
