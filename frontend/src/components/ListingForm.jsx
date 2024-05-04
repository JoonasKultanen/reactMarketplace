import React from "react";
import { useForm } from "react-hook-form";
import "./ListingForm.css";

const categories = [
  { name: "Furniture" },
  { name: "Electronics" },
  { name: "Clothing" },
  { name: "Cars" },
  { name: "Home & Garden" },
  { name: "Pets & Supplies" },
  { name: "Sports & Outdoors" },
];

const ListingForm = ({ onSubmit, editMode, listing, userId }) => {
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      picture_url: "",
      owner: userId,
    },
  });

  React.useEffect(() => {
    if (editMode && listing) {
      reset({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        picture_url: listing.picture_url || "/images/placeholder.png",
        owner: userId,
      });
    } else {
      reset({
        title: "",
        description: "",
        price: "",
        category: "",
        picture_url: "/images/placeholder.png",
        owner: userId,
      });
    }
  }, [editMode, listing, reset, userId]);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>{editMode ? "Edit Listing" : "Create Listing"}</h2>
        <input
          {...register("title", { required: true })}
          placeholder="Enter Listing Title"
        />
        <textarea
          {...register("description", { required: true })}
          rows="5"
          placeholder="Enter Listing Description"
        />
        <input
          {...register("price", { required: true })}
          placeholder="Enter Listing Price"
        />
        <select {...register("category", { required: true })}>
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="submit">{editMode ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default ListingForm;
