import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const registerSchema = Yup.object().shape({
    username: Yup.string().required("Username je obavezan"),
    email: Yup.string().email("Netacan email").required("Email je obavezan"),
    password: Yup.string()
      .min(6, "Password mora da bude dugacak najmanje 6 karaktera")
      .required("Password je obavezan"),
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          validationSchema={registerSchema}
          onSubmit={async (values) => {
            try {
              const usersResponse = await axios.get(
                "http://localhost:3001/users"
              );
              const numericIds = usersResponse.data
                .map((u) => parseInt(u.id, 10))
                .filter((n) => !isNaN(n));

              const nextId =
                numericIds.length > 0
                  ? (Math.max(...numericIds) + 1).toString()
                  : "1";

              await axios.post("http://localhost:3001/users", {
                ...values,
                id: nextId,
                role: "user",
              });

              alert("Registracija uspesna molimo da se ulogujete.");
              navigate("/login");
            } catch (error) {
              alert("Registracija neuspesna.");
              console.error("Error registering user:", error);
            }
          }}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  name="username"
                  placeholder="Username"
                  className="w-full p-2 border rounded"
                />
                {errors.username && touched.username && (
                  <p className="text-red-500">{errors.username}</p>
                )}
              </div>
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
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Register
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
