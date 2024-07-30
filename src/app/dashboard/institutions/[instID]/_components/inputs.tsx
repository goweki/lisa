import { resizeImageFile } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

export function InputImage({
  _photo,
  setPhoto,
}: {
  _photo: string;
  setPhoto: (_imageFile: any) => void;
}) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  return (
    <div className="flex flex-row">
      <span className="mr-4 h-full">Photo:</span>
      <label
        htmlFor="profile-image"
        className="group relative flex justify-center w-32 aspect-square items-center bg-emerald-100 rounded-full hover:cursor-pointer border-4 border-emerald-800/25"
      >
        {!imagePreviewUrl && !_photo ? (
          <span className="group-hover:opacity-0 material-icons text-2xl transition-opacity duration-300">
            image
          </span>
        ) : (
          <div className="relative h-full w-full">
            <Image
              alt="display-photo"
              // width={120}
              // height={120}
              fill
              priority={false}
              sizes="132px"
              src={imagePreviewUrl || _photo}
              className="object-cover group-hover:opacity-25 transition-opacity duration-300 rounded-full !bg-transparent"
            />
          </div>
        )}
        <span className="material-icons text-2xl absolute inset-0 flex justify-center items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-black">
          upload
        </span>
        <input
          id="profile-image"
          className="hidden"
          type="file"
          onChange={async (e) => {
            if (!e.target?.files || e.target.files.length === 0) {
              toast.error("Please select an image file.");
              setImagePreviewUrl("");
              setPhoto(null);
              return;
            }
            const image_ = e.target.files[0];

            if (
              image_ &&
              image_.type.startsWith("image/") &&
              image_.size / (1024 * 1024) < 2
            ) {
              // setImagePreviewUrl(URL.createObjectURL(image_));
              // setPhoto(image_);
              const resizedImage_ = await resizeImageFile(image_);
              // console.log("resizedImage - ", resizedImage_);
              // setImagePreviewUrl(resizedImage_);
              // setImagePreviewUrl(URL.createObjectURL(image_));
              setImagePreviewUrl(URL.createObjectURL(resizedImage_));
              setPhoto(resizedImage_);
            } else {
              console.error(
                "Invalid file or file-size. Please select an image less than 2MB."
              );
              // alert("Please select an image file.");
              toast.error("Please select an image less than 2MB.");
            }
          }}
        />
      </label>
    </div>
  );
}
