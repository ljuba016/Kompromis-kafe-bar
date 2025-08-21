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
      .email("Netacaan format email-a")
      .required("Email je obavezan"),
    password: Yup.string()
      .min(6, "Password mora biti najmanje 6 karaktera")
      .required("Password je obavezan"),
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
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
                className={`w-full p-2 rounded text-white ${
                  isSubmitting
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
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
