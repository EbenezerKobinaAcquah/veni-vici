import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [dog, setDog] = useState(null); // Current dog
  const [banList, setBanList] = useState([]); // List of banned properties
  const [seenDogs, setSeenDogs] = useState([]); // List of seen dogs
  const [loading, setLoading] = useState(false); // Loading state

  // Mocked properties for demonstration
  const mockProperties = {
    size: ["Small", "Medium", "Large"],
    origin: ["United States", "Germany", "Japan", "Australia"],
    lifespan: ["10 - 12 years", "12 - 15 years", "15 - 18 years"],
  };

  // Fetch a random dog image and breed
  const fetchDog = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await response.json();

      // Extract the breed from the image URL
      const breed = data.message.split("/")[4];

      // Generate random properties for the dog
      const size = mockProperties.size[Math.floor(Math.random() * mockProperties.size.length)];
      const origin = mockProperties.origin[Math.floor(Math.random() * mockProperties.origin.length)];
      const lifespan = mockProperties.lifespan[Math.floor(Math.random() * mockProperties.lifespan.length)];

      // Check if any property is in the ban list
      if (banList.includes(breed) || banList.includes(size) || banList.includes(origin) || banList.includes(lifespan)) {
        fetchDog(); // Fetch another dog if any property is banned
      } else {
        const newDog = { image: data.message, breed, size, origin, lifespan };
        setDog(newDog);
        setSeenDogs((prev) => [...prev, newDog]); // Add to seen dogs list
      }
    } catch (error) {
      console.error("Error fetching dog:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a property to the ban list
  const banProperty = (property) => {
    if (!banList.includes(property)) {
      setBanList([...banList, property]);
    }
  };

  // Remove a property from the ban list
  const unbanProperty = (property) => {
    setBanList(banList.filter((p) => p !== property));
  };

  // Fetch a dog when the app loads
  useEffect(() => {
    fetchDog();
  }, []);

  return (
    <div className="app">
      <div className="seen-dogs">
        <h2>Who have we seen so far?</h2>
        {seenDogs.map((dog, index) => (
          <div key={index} className="seen-dog">
            <img src={dog.image} alt={dog.breed} />
            <p>
              A {dog.size} {dog.breed} dog from {dog.origin}
            </p>
          </div>
        ))}
      </div>

      <div className="main-content">
        <h1>Discover Random Dogs</h1>
        <button onClick={fetchDog} disabled={loading}>
          {loading ? "Loading..." : "Discover"}
        </button>

        {dog && (
          <div className="dog-card">
            <img src={dog.image} alt={dog.breed} />
            <h2>{dog.breed}</h2>
            <div className="dog-properties">
              <span onClick={() => banProperty(dog.size)}>{dog.size}</span>
              <span onClick={() => banProperty(dog.origin)}>{dog.origin}</span>
              <span onClick={() => banProperty(dog.lifespan)}>{dog.lifespan}</span>
            </div>
          </div>
        )}
      </div>

      <div className="ban-list">
        <h2>Ban List</h2>
        {banList.length > 0 ? (
          <ul>
            {banList.map((property, index) => (
              <li key={index}>
                {property}{" "}
                <button onClick={() => unbanProperty(property)}>Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No banned properties yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
