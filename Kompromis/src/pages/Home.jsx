import background from "../assets/background.png";

const Home = () => {
  return (
    <div
      className="bg-contain bg-cover bg-center bg-no-repeat min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 "
      style={{ backgroundImage: `url(${background})` }}
    >
      <h1 className="text-4xl font-bold mb-4">Dobrodosli u nas kafic</h1>
      <p className="text-lg">Istrazite meni i rezervisite sto!</p>
    </div>
  );
};

export default Home;
