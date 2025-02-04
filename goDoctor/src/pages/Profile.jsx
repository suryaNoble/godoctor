import React, { useContext, useState } from "react";
// import { assets } from "../assets/assets_frontend/assets";
// for static data
import { AppContext } from "../context/AppContext";

const Profile = () => {

//for static data
  // const [userData, setUserData] = useState({
  //   name: "Surya Noble",
  //   image: assets.profile_pic,
  //   email: "suryamani11121@gmail.com",
  //   phone: "9493800639",
  //   address: { line1: "kakinada", line2: "pithapuram" },
  //   gender: "Male",
  //   dob: "2000-01-01",
  // });

  const {userData,setUserData} = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false);

  return (
    //     <div className="max-w-screen flex flex-col items-center text-center justify-center gap-2  text-sm" >

    <div className="flex flex-row">

    <div className="max-w-lg min-w-[30%] flex flex-col gap-2  text-sm" >
      <img className="w-36 rounded" src={userData.image} alt="" />

      {isEdit ? (
        <input 
          className="border max-w-60 mt-4 text-3xl border-gray-600 bg-gray-100 rounded-lg"
          type="text"
          value={userData.name}
          onChange={(e) => {
            setUserData((prev) => ({ ...prev, name: e.target.value }));
          }}
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4" >{userData.name}</p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />

      <div>
        <p className="text-neutral-500 underline mt-3" >CONTACT INFO</p>
        <div className="grid grid-cols-[1fr 3fr] gap-y-2.5 mt-3 text-neutral-700" >
          <p className="font-medium" >Email id:</p>
          <p className="text-blue-500" >{userData.email}</p>
          {/* {
            isEdit
            ? <input type="email" value={userData.email} onChange={e =>{setUserData(prev=>({...prev,email:e.target.value}))}}/>
            : <p>{userData.email}</p>
          } */}

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="m-3 max-w-52 border border-gray-600 bg-gray-200 rounded-lg"
              type="text"
              value={userData.phone}
              onChange={(e) => {
                setUserData((prev) => ({ ...prev, phone: e.target.value }));
              }}
            />
          ) : (
            <p className="text-blue-400" >{userData.phone}</p>
          )}

          <p className="font-medium" >Address:</p>
          {isEdit ? (
            <p>
              <label htmlFor="line-1">line1:</label>
              <input
                className="m-3  border border-gray-600 bg-gray-200 rounded-lg"
                type="text"
                name="line-1"
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
          <p className="text-neutral-500 underline mt-3" >BASIC INFORMATION</p>

          <div className="grid grid-cols-[1fr 3fr] gap-y-2.5 mt-3 text-neutral-700" >
            <p className="font-medium" >GENDER:</p>
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
              <p className="text-gray-400" >{userData.gender}</p>
            )}

            <p className="font-medium" >Birthday:</p>
            {
              isEdit
              ? <input className="max-w-28 bg-gray-100" type="date" value={userData.dob} onChange={e =>{setUserData(prev=>({...prev,dob:e.target.value}))}} ></input>
              : <p className="text-gray-400"n >{userData.dob}</p>
            }
          </div>
        </div>

        <div className="w-1/2 flex align-items-center justify-between">
          <button
            className={`m-3 mt-8 px-5 py-2 border border-gray-600 rounded-full ${
              isEdit
                ? "bg-gray-100 cursor-not-allowed border-none"
                : "bg-gray-200 hover:bg-primary hover:text-white border-none"
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
              !isEdit
                ? "bg-gray-100 cursor-not-allowed border-none"
                : "bg-gray-200 hover:bg-primary hover:text-white border-none"
            }`}
            onClick={() => {
              if (isEdit) {
                setIsEdit(!isEdit);
              }
            }}
            disabled={!isEdit}
          >
            Save
          </button>
          
        </div>
        {/* simply we will chck isEdit and dispaly one button either edit or save using terinry button */}
      </div>
    </div>

    <div className="hidden md:flex flex-col gap-2  text-sm" >
            <img src={assets.appointment_img} alt="" />
    </div>


</div>
  );
};

export default Profile;
