import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import { toast } from "react-hot-toast";

const Newproduct = () => {
  const [data, setData] = useState({
    name: "",
    category: "",
    image: "",
    price: "",
    description: "",
  });
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const uploadImage = async (e) => {
    const data = await ImagetoBase64(e.target.files[0]);
    console.log(data);
    setData((preve) => {
      return {
        ...preve,
        image: data,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, image, category, price } = data;
    if (name && image && category && price) {
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/uploadProduct`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const fetchRes = await fetchData.json();
      console.log(fetchRes);
      toast(fetchRes.message);

      setData(() => {
        return {
          name: "",
          category: "",
          image: "",
          price: "",
          description: "",
        };
      });
    } else {
      toast("Enter require fields");
    }
  };

  return (
    <div className="p-16">
      <form
        className="m-auto w-full max-w-md drop-shadow flex flex-col p-3 bg-white"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name" className="">
          Name
        </label>
        <input
          type={"text"}
          name="name"
          className="bg-slate-200 p-1 my-1"
          onChange={handleOnChange}
          value={data.name}
        />

        <label htmlFor="category" className="my-1">
          Category
        </label>
        <select
          className="bg-slate-200 p-1 my-1"
          name="category"
          onChange={handleOnChange}
          value={data.category}
        >
          <option value={"other"}>Select Category</option>
          <option value={"fruit"}>Fruit</option>
          <option value={"vegetables"}>Vegetables</option>
          <option value={"ice-cream"}>Ice-Cream</option>
          <option value={"rice"}>Rice</option>
          <option value={"cake"}>Cake</option>
          <option value={"paneer"}>Paneer</option>
          <option value={"snacks"}>Snacks</option>
          <option value={"non-veg"}>Non-Veg</option>
        </select>

        <label htmlFor="image" className="my-1">
          Image
          <div className="h-60 w-full bg-slate-200 my-2 rounded flex items-center justify-center cursor-pointer">
            {data.image ? (
              <img src={data.image} className="h=full" />
            ) : (
              <span className="text-4xl ">
                <FaCloudUploadAlt />
              </span>
            )}
            <input
              type={"file"}
              accept="image/*"
              id="image"
              onChange={uploadImage}
              className="hidden"
            />
          </div>
        </label>

        <label htmlFor="price" className="my-1">
          Price
        </label>
        <input
          type={"text"}
          className="bg-slate-200 p-1 my-1"
          name="price"
          onChange={handleOnChange}
          value={data.price}
        />

        <label htmlFor="description" className="my-1">
          Description
        </label>
        <textarea
          rows={3}
          className="bg-slate-200 p-1 my-1 resize-none"
          name="description"
          onChange={handleOnChange}
          value={data.description}
        ></textarea>

        <button className="bg-red-500 hover:bg-red-600 text-white font-medium frop-shadow my-2 py-1">
          Save
        </button>
      </form>
    </div>
  );
};

export default Newproduct;
