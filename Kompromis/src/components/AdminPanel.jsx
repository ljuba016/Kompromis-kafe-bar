import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const AdminPanel = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/menu").then((response) => {
      setMenuItems(response.data);
    });
    axios.get("http://localhost:3001/reservations").then((response) => {
      setReservations(response.data);
    });
  }, []);

  const menuItemSchema = Yup.object().shape({
    name: Yup.string().required("Ime je obavezno"),
    description: Yup.string().required("Opis je obavezan"),
    price: Yup.number()
      .positive("Cena mora da bude pozitivna")
      .required("Cena je obavezna"),
    category: Yup.string().required("Kategorija je obavezna"),
  });

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        await axios.put(`http://localhost:3001/menu/${editingItem.id}`, values);
        setMenuItems(
          menuItems.map((item) =>
            item.id === editingItem.id ? { ...item, ...values } : item
          )
        );
        setEditingItem(null);
      } else {
        const numericIds = menuItems
          .map((i) => parseInt(i.id, 10))
          .filter((n) => !isNaN(n));
        const nextId =
          numericIds.length > 0
            ? (Math.max(...numericIds) + 1).toString()
            : "1";

        const newItem = { ...values, id: nextId };
        const response = await axios.post(
          "http://localhost:3001/menu",
          newItem
        );
        setMenuItems([...menuItems, response.data]);
      }
      alert("Sacuvan artikal u meniju!");
    } catch (error) {
      alert("Greska pri cuvanju artikla.");
      console.error("Greska pri cuvanju artikla:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/menu/${id}`);
      setMenuItems(menuItems.filter((item) => item.id !== id));
      alert("Obrisan artikal sa menija!");
    } catch (error) {
      alert("Greska pri brisanju artikla.");
      console.error("Greska brisanja artikla:", error);
    }
  };

  const confirmReservation = async (reservation) => {
    try {
      await axios.patch(
        `http://localhost:3001/reservations/${reservation.id}`,
        { status: "confirmed" }
      );

      const tablesResponse = await axios.get("http://localhost:3001/tables", {
        params: { tableNumber: reservation.tableNumber },
      });
      if (tablesResponse.data.length > 0) {
        const tableId = tablesResponse.data[0].id;
        await axios.patch(`http://localhost:3001/tables/${tableId}`, {
          status: "confirmed",
        });
      }

      setReservations(
        reservations.map((res) =>
          res.id === reservation.id ? { ...res, status: "confirmed" } : res
        )
      );
      alert("Rezervacija potvrdjena!");
    } catch (error) {
      alert("Greska pri potvrdjivanju rezervacije.");
      console.error("Greska potvrdjivanja rezervacije:", error);
    }
  };

  const cancelReservation = async (reservation) => {
    try {
      await axios.delete(
        `http://localhost:3001/reservations/${reservation.id}`
      );

      const tablesResponse = await axios.get("http://localhost:3001/tables", {
        params: { tableNumber: reservation.tableNumber },
      });
      if (tablesResponse.data.length > 0) {
        const tableId = tablesResponse.data[0].id;
        await axios.patch(`http://localhost:3001/tables/${tableId}`, {
          status: "not_reserved",
        });
      }

      setReservations(reservations.filter((res) => res.id !== reservation.id));
      alert("Rezervacija otkazana!");
    } catch (error) {
      alert("Greska pri otkazivanju rezervacije.");
      console.error("Greska otkazivanja rezervacije:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      <h3 className="text-xl font-bold mb-2">Manage Menu</h3>
      <Formik
        initialValues={
          editingItem || { name: "", description: "", price: "", category: "" }
        }
        validationSchema={menuItemSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form className="bg-white p-4 rounded shadow mb-4">
            <div className="space-y-4">
              <div>
                <Field
                  name="name"
                  placeholder="Ime artikla"
                  className="w-full p-2 border rounded"
                />
                {errors.name && touched.name && (
                  <p className="text-red-500">{errors.name}</p>
                )}
              </div>
              <div>
                <Field
                  name="description"
                  placeholder="Opis"
                  className="w-full p-2 border rounded"
                />
                {errors.description && touched.description && (
                  <p className="text-red-500">{errors.description}</p>
                )}
              </div>
              <div>
                <Field
                  name="price"
                  type="number"
                  placeholder="Cena"
                  className="w-full p-2 border rounded"
                />
                {errors.price && touched.price && (
                  <p className="text-red-500">{errors.price}</p>
                )}
              </div>
              <div>
                <Field
                  as="select"
                  name="category"
                  className="w-full p-2 border rounded"
                >
                  <option value="">Izaberite kategoriju</option>
                  <option value="drinks">Pice</option>
                  <option value="food">Hrana</option>
                </Field>
                {errors.category && touched.category && (
                  <p className="text-red-500">{errors.category}</p>
                )}
              </div>
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-700"
              >
                {editingItem ? "Update Item" : "Add Item"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <h3 className="text-xl font-bold mb-2">Menu Items</h3>
      <div className="space-y-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <div>
              <p>
                {item.name} - ${item.price}
              </p>
              <p>{item.category}</p>
            </div>
            <div>
              <button
                onClick={() => setEditingItem(item)}
                className="mr-2 p-2 bg-yellow-500 text-white rounded cursor-pointer hover:bg-yellow-700"
              >
                Edituj
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                className="p-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-700"
              >
                Obrisi
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold mb-2 mt-4">Reservations</h3>
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">
                Sto {reservation.tableNumber}
              </h3>
              <p>ID rezervacije: {reservation.id}</p>
              <p>Korisnik: {reservation.userId.replace("token-", "")}</p>
              <p>Datum: {reservation.date}</p>
              <p>vreme: {reservation.time}</p>
              <p>Status: {reservation.status}</p>
            </div>
            <div>
              {reservation.status === "pending" && (
                <button
                  onClick={() => confirmReservation(reservation)}
                  className="mr-2 p-2 bg-green-500 text-white rounded hover:bg-green-700 cursor-pointer"
                >
                  Potvrdi
                </button>
              )}
              <button
                onClick={() => cancelReservation(reservation)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-700 cursor-pointer"
              >
                Ponisti
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
