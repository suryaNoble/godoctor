import { useContext, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const Profile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null); // Changed from false to null

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);

      if (image) {
        formData.append('image', image);
      }

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, {
        headers: { token, "Content-Type": "multipart/form-data" }
      });

      if (data.success) {
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null); // Reset image state
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred: " + error.message); // Improved error handling
    }
  };

  return userData && (
    <div className="flex flex-row">
      <div className="max-w-lg min-w-[30%] flex flex-col gap-2 text-sm">
        {isEdit ? (
          <label>
            <div className="inline-block relative cursor-pointer">
              <img className="w-36 rounded opacity-70" src={image ? URL.createObjectURL(image) : userData.image} alt="" />
              <img className="w-10 absolute bottom-12 right-12" src={image ? '' : assets.upload_icon} alt="" />
            </div>
            <input id="image" hidden type="file" onChange={(e) => { setImage(e.target.files[0]); }} />
          </label>
        ) : (
          <img className="w-36 rounded" src={userData.image} alt="" />
        )}

        {isEdit ? (
          <input
            className="border max-w-60 mt-4 text-3xl border-gray-600 bg-gray-100 rounded-lg"
            name="name"
            type="text"
            value={userData.name}
            onChange={(e) => {
              setUserData((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
        )}

        <hr className="bg-zinc-400 h-[1px] border-none" />

        <div>
          <p className="text-neutral-500 underline mt-3">CONTACT INFO</p>
          <div className="grid grid-cols-[1fr 3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Email id:</p>
            <p className="text-blue-500">{userData.email}</p>

            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="m-3 max-w-52 border border-gray-600 bg-gray-200 rounded-lg"
                name="phone"
                type="text"
                value={userData.phone}
                onChange={(e) => {
                  setUserData((prev) => ({ ...prev, phone: e.target.value }));
                }}
              />
            ) : (
              <p className="text-blue-400">{userData.phone}</p>
            )}

            <p className="font-medium">Address:</p>
            {isEdit ? (
              <p>
                <label htmlFor="line-1">line1:</label>
                <input
                  className="m-3 border border-gray-600 bg-gray-200 rounded-lg"
                  name="line1"
                  type="text"
                  value={userData.address.line1}
                  onChange={(e) => {
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }));
                  }}
                />
                <label htmlFor="line-2">line2:</label>
                <input
                  className="m-3 border border-gray-600 bg-gray-200 rounded-lg"
                  type="text"
                  name="line-2"
                  value={userData.address.line2}
                  onChange={(e) => {
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }));
                  }}
                />
              </p>
            ) : (
              <p>
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>

          <div>
            <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
            <div className="grid grid-cols-[1fr 3fr] gap-y-2.5 mt-3 text-neutral-700">
              <p className="font-medium">GENDER:</p>
              {isEdit ? (
                <select
                  className="max-w-20 bg-gray-100"
                  name="gender"
                  onChange={(e) => {
                    setUserData((prev) => ({ ...prev, gender: e.target.value }));
                  }}
                  value={userData.gender}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              ) : (
                <p className="text-gray-400">{userData.gender}</p>
              )}

              <p className="font-medium">Birthday:</p>
              {isEdit ? (
                <input
                  className="max-w-28 bg-gray-100"
                  name="date"
                  type="date"
                  value={userData.dob}
                  onChange={(e) => { setUserData(prev => ({ ...prev, dob: e.target.value })); }}
                />
              ) : (
                <p className="text-gray-400">{userData.dob}</p>
              )}
            </div>
          </div>

          <div className="w-1/2 flex align-items-center justify-between">
            <button
              className={`m-3 mt-8 px-5 py-2 border border-gray-600 rounded-full ${
                isEdit ? "bg-gray-100 cursor-not-allowed border-none" : "bg-gray-200 hover:bg-primary hover:text-white border-none"
              }`}
              onClick={() => {
                if (!isEdit) {
                  setIsEdit(!isEdit);
                }
              }}
              disabled={isEdit}
            >
              Edit
            </button>
            <button
              className={`m-3 mt-8 px-5 py-2 border border-gray-600 rounded-full ${
                !isEdit ? "bg-gray-100 cursor-not-allowed border-none" : "bg-gray-200 hover:bg-primary hover:text-white border-none"
              }`}
              onClick={() => { if (isEdit) { updateUserProfileData(); } }}
              disabled={!isEdit}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col gap-2 text-sm">
        <img src={assets.appointment_img} alt="" />
      </div>
    </div>
  );
};

export default Profile;
