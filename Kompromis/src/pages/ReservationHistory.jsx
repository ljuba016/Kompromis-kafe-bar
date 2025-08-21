import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ReservationHistory = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setError("Ulogujte se da bi videli rezervacije.");
      setLoading(false);
      return;
    }

    const fetchReservations = async () => {
      try {
        console.log("Fetching reservations for userId:", user.token);
        const response = await axios.get("http://localhost:3001/reservations", {
          params: { userId: user.token },
        });
        console.log("Reservations received:", response.data);
        setReservations(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch reservations. Please try again later.");
        setLoading(false);
        console.error("Error fetching reservations:", err);
      }
    };

    fetchReservations();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen bg-gray-100 p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 text-red-500">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Vasa istorija rezervacija</h2>
      {reservations.length === 0 ? (
        <p className="text-gray-600">Nemate rezervaciju.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">
                Sto {reservation.tableNumber}
              </h3>
              <p>ID rezervacije: {reservation.id}</p>
              <p>Datum: {reservation.date}</p>
              <p>Vreme: {reservation.time}</p>
              <p>Status: {reservation.status}</p>
              <p>
                Datum kreiranja rezervacije:{" "}
                {new Date(reservation.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationHistory;
