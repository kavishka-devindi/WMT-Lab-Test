import { useEffect, useState } from "react";

function ItemForm({ initialValues, onSubmit, submitText }) {
  const [formData, setFormData] = useState(
    {
      name: "",
      category: "",
      price: "",
      description: "",
      imageUrl: "",
      modelNumber: "",
    }
  );

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || "",
        category: initialValues.category || "",
        price: initialValues.price ?? "",
        description: initialValues.description || "",
        imageUrl: initialValues.imageUrl || "",
        modelNumber: initialValues.modelNumber || "",
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
      modelNumber: formData.modelNumber.trim(),
    });
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>{submitText}</h2>

      <label>Item Name</label>
      <input name="name" value={formData.name} onChange={handleChange} required />

      <label>Category</label>
      <input name="category" value={formData.category} onChange={handleChange} required />

      <label>Price</label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        required
      />

      <label>Description</label>
      <textarea
        name="description"
        rows="4"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <label>Image URL</label>
      <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />

      <label>Model Number</label>
      <input name="modelNumber" value={formData.modelNumber} onChange={handleChange} required />

      <button className="btn primary" type="submit">{submitText}</button>
    </form>
  );
}

export default ItemForm;