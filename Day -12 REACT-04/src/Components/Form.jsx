import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { MyData } from "../Context/MyContext";
import { nanoid } from "nanoid";

const Form = () => {
  const {
    setuserData,
    userData,
    settoggle,
    toggle,
    IsEditedUser,
    setIsEditedUser,
  } = useContext(MyData);

  let {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  let submitHandler = (user) => {
    if (IsEditedUser) {
      setuserData((previousUsers) => {
        let updatedArr = previousUsers.map((val) =>
          val.id === IsEditedUser.id
            ? { ...val, ...user, id: IsEditedUser.id }
            : val,
        );
        return updatedArr;
      });
    } else {
      setuserData((previousUsers) => [
        ...previousUsers,
        {
          ...user,
          id: nanoid(),
        },
      ]);
    }

    reset();
    setIsEditedUser(null)
    settoggle(false);
  };
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl bg-gray-50 p-6 text-base text-gray-800 shadow-xl"
    >
      <input
        {...register("name", {
          required: "name is required ",
        })}
        type="text"
        placeholder="Name"
        aria-label="Name"
        className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />

      <input
        {...register("email", {
          required: "email is required",
        })}
        type="email"
        placeholder="Email"
        aria-label="Email"
        className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
      <input
        {...register("imageURL", {
          required: "imageURL is required",
        })}
        type="url"
        placeholder="Image URL"
        aria-label="Image URL"
        className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
      <button
        type="submit"
        className="rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
      >
        {IsEditedUser ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default Form;
