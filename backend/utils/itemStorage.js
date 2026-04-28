import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storageDir = path.join(__dirname, "..", "data");
const storageFile = path.join(storageDir, "items.json");

const ensureStorageFile = async () => {
  await fs.mkdir(storageDir, { recursive: true });

  try {
    await fs.access(storageFile);
  } catch {
    await fs.writeFile(storageFile, "[]", "utf8");
  }
};

const readItems = async () => {
  await ensureStorageFile();
  const raw = await fs.readFile(storageFile, "utf8");
  const parsed = JSON.parse(raw || "[]");
  return Array.isArray(parsed) ? parsed : [];
};

const writeItems = async (items) => {
  await ensureStorageFile();
  await fs.writeFile(storageFile, JSON.stringify(items, null, 2), "utf8");
};

const normalizeStoredItem = (item) => ({
  ...item,
  name: String(item.name || "").trim(),
  category: String(item.category || "").trim(),
  description: String(item.description || "").trim(),
  imageUrl: String(item.imageUrl || "").trim(),
  modelNumber: String(item.modelNumber || "").trim(),
});

export const listStoredItems = async () => {
  const items = await readItems();
  return items.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
};

export const getStoredItemById = async (id) => {
  const items = await readItems();
  return items.find((item) => item._id === id) || null;
};

export const createStoredItem = async (itemData) => {
  const items = await readItems();
  const now = new Date().toISOString();
  const newItem = normalizeStoredItem({
    ...itemData,
    _id: randomUUID(),
    price: Number(itemData.price),
    createdAt: now,
    updatedAt: now,
  });

  items.unshift(newItem);
  await writeItems(items);
  return newItem;
};

export const updateStoredItem = async (id, itemData) => {
  const items = await readItems();
  const itemIndex = items.findIndex((item) => item._id === id);

  if (itemIndex === -1) {
    return null;
  }

  const existingItem = items[itemIndex];
  const updatedItem = normalizeStoredItem({
    ...existingItem,
    ...itemData,
    _id: existingItem._id,
    price: Number(itemData.price ?? existingItem.price),
    createdAt: existingItem.createdAt,
    updatedAt: new Date().toISOString(),
  });

  items[itemIndex] = updatedItem;
  await writeItems(items);
  return updatedItem;
};

export const deleteStoredItem = async (id) => {
  const items = await readItems();
  const nextItems = items.filter((item) => item._id !== id);

  if (nextItems.length === items.length) {
    return false;
  }

  await writeItems(nextItems);
  return true;
};
