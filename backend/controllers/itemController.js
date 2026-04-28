import Item from "../models/Item.js";
import {
  createStoredItem,
  deleteStoredItem,
  getStoredItemById,
  listStoredItems,
  updateStoredItem,
} from "../utils/itemStorage.js";

const isMongoConnected = () => Item.db?.readyState === 1;

const normalizeItemData = (data) => ({
  ...data,
  name: String(data.name || "").trim(),
  category: String(data.category || "").trim(),
  description: String(data.description || "").trim(),
  imageUrl: String(data.imageUrl || "").trim(),
  modelNumber: String(data.modelNumber || "").trim(),
  price: Number(data.price),
});

export const getItems = async (req, res) => {
  try {
    const items = isMongoConnected()
      ? await Item.find().sort({ createdAt: -1 })
      : await listStoredItems();
    res.status(200).json(items);
  } catch (error) {
    try {
      const items = await listStoredItems();
      res.status(200).json(items);
    } catch (fallbackError) {
      res.status(500).json({ message: "Failed to fetch items" });
    }
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = isMongoConnected()
      ? await Item.findById(req.params.id)
      : await getStoredItemById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch item" });
  }
};

export const createItem = async (req, res) => {
  try {
    const itemData = normalizeItemData(req.body);
    const newItem = isMongoConnected()
      ? await Item.create(itemData)
      : await createStoredItem(itemData);
    res.status(201).json(newItem);
  } catch (error) {
    try {
      const newItem = await createStoredItem(normalizeItemData(req.body));
      res.status(201).json(newItem);
    } catch (fallbackError) {
      res.status(400).json({
        message: "Failed to create item",
        error: fallbackError.message,
      });
    }
  }
};

export const updateItem = async (req, res) => {
  try {
    const itemData = normalizeItemData(req.body);
    const updatedItem = isMongoConnected()
      ? await Item.findByIdAndUpdate(
          req.params.id,
          {
            $set: itemData,
          },
          {
            new: true,
            runValidators: true,
          }
        )
      : await updateStoredItem(req.params.id, itemData);

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update item",
      error: error.message,
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const deletedItem = isMongoConnected()
      ? await Item.findByIdAndDelete(req.params.id)
      : await deleteStoredItem(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item" });
  }
};