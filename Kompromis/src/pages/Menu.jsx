import { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import background2 from "../assets/background2.png";
import background from "../assets/background.png";

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
    <div
      className="bg-contain bg-cover bg-center bg-no-repeat min-h-screen bg-gray-100 p-4"
      style={{ backgroundImage: `url(${background2})` }}
    >
      <h2 className="text-2xl font-bold mb-4 flex justify-center">Meni</h2>

      <div className="mb-4 flex justify-center space-x-2">
        <button
          onClick={() => setCategory("sve")}
          className="p-2 text-white rounded cursor-pointer hover:brightness-120"
          style={{ backgroundColor: "#1e2939" }}
        >
          Sve
        </button>
        <button
          onClick={() => setCategory("pice")}
          className="p-2 text-white rounded cursor-pointer hover:brightness-120"
          style={{ backgroundColor: "#1e2939" }}
        >
          Piće
        </button>
        <button
          onClick={() => setCategory("hrana")}
          className="p-2 text-white rounded cursor-pointer hover:brightness-120"
          style={{ backgroundColor: "#1e2939" }}
        >
          Hrana
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded shadow-xl cursor-pointer w-80 hover:brightness-110 "
            style={{ backgroundColor: "#f7c00b" }}
            onClick={() => setSelectedItem(item)}
          >
            <h3 className="text-xl font-bold">{item.name}</h3>
            <p>{item.price} RSD</p>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center p-4">
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
              style={{ backgroundColor: "#129a5c" }}
              onClick={() => setShowImage(true)}
            >
              📷 Prikaži sliku
            </button>

            {showImage && selectedItem.image && (
              <div className="fixed inset-0  bg-opacity-70 flex justify-center items-center">
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
