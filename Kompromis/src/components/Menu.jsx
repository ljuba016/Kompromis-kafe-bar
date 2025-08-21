import { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState("sve");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3001/menu").then((response) => {
      setMenuItems(response.data);
    });
  }, []);

  const filteredItems =
    category === "sve"
      ? menuItems
      : menuItems.filter((item) => item.category === category);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Meni</h2>

      <div className="mb-4">
        <button
          onClick={() => setCategory("sve")}
          className="mr-2 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded cursor-pointer"
        >
          Sve
        </button>
        <button
          onClick={() => setCategory("pice")}
          className="mr-2 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded cursor-pointer"
        >
          Pice
        </button>
        <button
          onClick={() => setCategory("hrana")}
          className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded cursor-pointer"
        >
          Hrana
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded shadow cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <h3 className="text-xl font-bold">{item.name}</h3>
            <p>{item.price} RSD</p>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center 
             rounded-full bg-gray-200 text-gray-700 font-bold 
             hover:bg-gray-300 hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedItem(null)}
            >
              X
            </button>

            <h3 className="text-2xl font-bold mb-2">{selectedItem.name}</h3>
            <p className="mb-4">{selectedItem.description || "Nema opisa"}</p>
            <p className="font-bold">Cena: {selectedItem.price} RSD</p>

            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full cursor-pointer"
              onClick={() => setShowImage(true)}
            >
              📷 Prikaži sliku
            </button>

            {showImage && selectedItem.image && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
                <div className="relative bg-white rounded shadow-lg p-4 max-w-lg w-full">
                  <button
                    className="absolute top-2 right-2 flex items-center px-3 py-2 bg-gray-200 rounded-lg shadow 
             hover:shadow-lg hover:bg-gray-300 transition cursor-pointer"
                    onClick={() => setShowImage(false)}
                  >
                    <FaArrowLeft className="mr-2" />
                    Nazad
                  </button>

                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-auto object-contain rounded"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
