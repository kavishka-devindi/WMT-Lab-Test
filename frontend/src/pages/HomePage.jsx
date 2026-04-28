import { useEffect, useState } from "react";
import { deleteItem, getItems } from "../api/itemApi.js";
import ItemCard from "../components/ItemCard.jsx";

function HomePage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data } = await getItems();
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.error("Unexpected items response", data);
        setError("Failed to load items from server.");
        setItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch items", error);
      setError("Failed to load items from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      await deleteItem(id);
      fetchItems();
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <section>
      <div className="hero">
        <h1>Item Details</h1>
        <p>View, manage, edit, and remove items from the inventory.</p>
      </div>

        {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading items...</p>
      ) : items.length === 0 ? (
        <p>No items available. Add a new item from the menu.</p>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}

export default HomePage;