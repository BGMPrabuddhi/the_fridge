import React, { useState, useEffect } from "react";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import { FaSpinner } from "react-icons/fa";
import "./App.scss";
import "./index.css";

const App = () => {
  const [greeting, setGreeting] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [items, setItems] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetch("http://localhost:5137/api/FridgeItems")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const determineGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        return "Good Morning";
      } else if (hour >= 12 && hour < 18) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    };

    setGreeting(determineGreeting());

    const interval = setInterval(() => {
      setGreeting(determineGreeting());
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const generateRecommendation = () => {
      const isWeekend = [0, 6].includes(date.getDay());
      const isFestiveSeason = date.getMonth() === 11;
      const itemsExpiringSoon = items.filter((item) => {
        const expiryDate = new Date(item.expiryDate);
        const daysToExpiry = (expiryDate - date) / (1000 * 60 * 60 * 24);
        return daysToExpiry > 0 && daysToExpiry <= 3;
      });

      const itemsExpired = items.filter((item) => new Date(item.expiryDate) < date);

      if (itemsExpired.length > 0) {
        return `⚠️ "Warning: You have ${itemsExpired.length} expired item(s) in your fridge. Please discard them to make space for fresh supplies!"`;
      } else if (itemsExpiringSoon.length > 0) {
        return `⏰ "Attention: ${itemsExpiringSoon.length} item(s) are expiring soon! Plan to use them before they go bad."`;
      } else if (items.length === 0) {
        return `🛒 "Your fridge is empty! Time to stock up on essentials and fresh ingredients."`;
      } else if (items.length < 5) {
        return `🍽️ "Your fridge is running low on supplies. Consider restocking for the upcoming days."`;
      } else if (isWeekend) {
        return `🏖️ "It's the weekend! Check if you have everything you need for weekend meals and treats."`;
      } else if (isFestiveSeason) {
        return `🎉 "A festive season is coming! Make sure your fridge is ready for celebrations with your favorite items."`;
      } else if (items.length > 15) {
        return `📦 "Your fridge is quite full! Focus on using existing items to avoid wastage before buying more."`;
      } else if (items.some((item) => item.name.toLowerCase().includes("vegetable"))) {
        return `🥗 "Fresh vegetables in stock! A salad or stir-fry could be a healthy and delicious option."`;
      } else if (items.some((item) => item.name.toLowerCase().includes("fruit"))) {
        return `🍎 "You have fresh fruits! They make for a great snack or addition to breakfast."`;
      } else if (items.some((item) => item.name.toLowerCase().includes("cheese"))) {
        return `🧀 "Cheese alert! Pair it with bread or crackers for a quick and tasty snack."`;
      } else if (items.some((item) => item.name.toLowerCase().includes("drink"))) {
        return `💧 "Stocked up on drinks? Stay refreshed with water, juices, or your favorite beverages."`;
      } else if (items.some((item) => item.name.toLowerCase().includes("snack"))) {
        return `🍿 "Snacks detected! Perfect for a movie night or a quick bite."`;
      } else {
        return `🍲 "Your fridge is stocked! Consider meal prepping to make the most of your ingredients."`;
      }
    };

    setRecommendation(generateRecommendation());
  }, [items, date]);

  const addItem = (item) => {
    setItems([...items, item]);

    fetch("http://localhost:5137/api/FridgeItems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Response status:", response.status);
          throw new Error("Failed to save item to the backend");
        }
        return response.json();
      })
      .then((savedItem) => {
        console.log("Item saved to backend:", savedItem);
      })
      .catch((error) => {
        console.error("Error saving item:", error);
      });
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
    fetch(`http://localhost:5137/api/FridgeItems/${id}`, {
      method: "DELETE",
    });
  };

  return (
    <div className="app">
      <h1 className="text-primary-blue text-4xl mb-4">{greeting}, Johny!</h1>
      <p className="text-lg mb-4">{recommendation}</p>
      <AddItemForm onAddItem={addItem} />
      <ItemList items={items} onDeleteItem={deleteItem} />
    </div>
  );
};

export default App;
