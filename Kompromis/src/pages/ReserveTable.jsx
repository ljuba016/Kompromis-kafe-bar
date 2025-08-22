import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ReserveTable = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [availableTables, setAvailableTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableTables();
  }, []);

  const reservationSchema = Yup.object().shape({
    tableNumber: Yup.number().required("Broj stola je obavezan"),
    date: Yup.date()
      .required("Datum je obavezan")
      .min(new Date(), "Datum mora biti danas ili u buducnosti")
      .max(
        new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        "Datum ne moze biti vise od 1 godine u buducnost"
      ),
    time: Yup.string()
      .required("Vreme je obavezno")
      .matches(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Nevalidan format vremena (HH:MM)"
      )
      .test(
        "is-within-hours",
        "Vreme mora biti izmedju 10:00 AM i 12:00 AM",
        (value) => {
          if (!value) return false;
          const [hours, minutes] = value.split(":").map(Number);
          const totalMinutes = hours * 60 + minutes;
          return totalMinutes >= 10 * 60 && totalMinutes <= 24 * 60;
        }
      ),
  });

  const fetchAvailableTables = async () => {
    setLoadingTables(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3001/tables", {
        params: { status: "not_reserved" },
      });
      const available = response.data
        .map((table) => table.tableNumber)
        .sort((a, b) => a - b);
      setAvailableTables(available);
      if (available.length === 0) setError("No tables available.");
    } catch (err) {
      setError("Please try again.");
      console.error("Error:", err);
    } finally {
      setLoadingTables(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 p-4 "
      style={{ backgroundColor: "#129a5c" }}
    >
      <h2 className="text-2xl font-bold mb-4 flex justify-center">
        Rezervisite sto
      </h2>
      <div className="flex justify-center items-center h-140 ">
        <div
          className="bg-white p-6 rounded shadow-2xl w-full max-w-md"
          style={{ backgroundColor: "#f7c00b" }}
        >
          <Formik
            initialValues={{ tableNumber: "", date: "", time: "" }}
            validationSchema={reservationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const tablesResponse = await axios.get(
                  "http://localhost:3001/tables",
                  { params: { tableNumber: parseInt(values.tableNumber) } }
                );

                if (tablesResponse.data.length === 0) {
                  alert("Sto ne postoji. Molimo izaberite drugi sto.");
                  fetchAvailableTables();
                  return;
                }

                const table = tablesResponse.data[0];
                const tableId = table.id;

                const reservationsResponse = await axios.get(
                  "http://localhost:3001/reservations"
                );
                const numericIds = reservationsResponse.data
                  .map((r) => parseInt(r.id, 10))
                  .filter((n) => !isNaN(n));
                const nextId =
                  numericIds.length > 0
                    ? (Math.max(...numericIds) + 1).toString()
                    : "1";

                await axios.post("http://localhost:3001/reservations", {
                  id: nextId,
                  userId: user.token,
                  tableNumber: parseInt(values.tableNumber),
                  date: values.date,
                  time: values.time,
                  status: "pending",
                  createdAt: new Date().toISOString(),
                });

                await axios.patch(`http://localhost:3001/tables/${tableId}`, {
                  status: "pending",
                });

                alert("Uspesno ste rezervisali sto!");
                navigate("/reservations");
              } catch (error) {
                const errorMessage =
                  error.response?.data?.message || error.message;
                alert("Neuspesna rezervacija: " + errorMessage);
                console.error("Reservation error:", error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    name="date"
                    type="date"
                    className="w-full p-2 border rounded"
                  />
                  {errors.date && touched.date && (
                    <p className="text-red-500">{errors.date}</p>
                  )}
                </div>
                <div>
                  <Field
                    name="time"
                    type="time"
                    className="w-full p-2 border rounded"
                  />
                  {errors.time && touched.time && (
                    <p className="text-red-500">{errors.time}</p>
                  )}
                </div>
                <div>
                  <Field
                    as="select"
                    name="tableNumber"
                    className="w-full p-2 border rounded"
                    disabled={loadingTables}
                  >
                    <option value="">Select a table</option>
                    {availableTables.map((table) => (
                      <option key={table} value={table}>
                        Table {table}
                      </option>
                    ))}
                  </Field>
                  {errors.tableNumber && touched.tableNumber && (
                    <p className="text-red-500">{errors.tableNumber}</p>
                  )}
                  {loadingTables && (
                    <p className="text-gray-500">Loading available tables...</p>
                  )}
                  {error && <p className="text-red-500">{error}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loadingTables || availableTables.length === 0}
                  className={`w-full p-2 rounded text-black ${
                    loadingTables || availableTables.length === 0
                      ? "bg-green-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 cursor-pointer"
                  }`}
                >
                  {loadingTables ? "Loading..." : "Potvrdi rezervaciju"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ReserveTable;
