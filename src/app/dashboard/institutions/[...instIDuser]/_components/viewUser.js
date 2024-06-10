import { ButtonPrimary, ButtonDestructive } from "@/components/atoms/buttons";
import { InputSelect, InputText, InputDate, InputImage } from "./inputs";
import { strPascalcase } from "@/helpers/stringHandlers";
import { dateShort, isDatePassed } from "@/helpers/dateHandlers";
import { emailValidator, nameValidator } from "@/helpers/inputValidators";
import { SVGfilter } from "@/components/atoms/svgs";
import { useState, useEffect } from "react";

export default function UserViewArea({
  selectedUser,
  userEdits,
  handleCreateUser,
  handleEditUser,
  handleDeleteUser,
  errFields,
  setErrFields,
  UIstate,
}) {
  const { userEdit, setUserEdits } = userEdits;
  const [isUpdatedUsr, setIsUpdatedUsr] = useState(false);

  //check if any updates
  useEffect(() => {
    if (Object.keys(userEdit).length > 0) {
      const userIsUpdated = ((obj1, obj2) => {
        for (const key in obj2) {
          if (obj1.hasOwnProperty(key) && obj1[key] !== obj2[key]) {
            console.log("Updates");
            return true;
          }
        }
        console.log("NO updates");
        return false;
      })(selectedUser, userEdit);
      setIsUpdatedUsr(userIsUpdated);
    }
  }, [userEdit, selectedUser]);

  //render
  return (
    <div className="p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
      {selectedUser === "new" ? (
        <div>
          <InputText
            label="Email address *"
            name="email-address"
            placeholder="Email address"
            value={userEdit?.email}
            setValue={(val) =>
              setUserEdits((prev) => ({
                ...prev,
                email: val,
              }))
            }
            valValidator={emailValidator}
            errFields={errFields}
            setErrFields={setErrFields}
          />
          <InputText
            label="Name *"
            name="names"
            placeholder="User's name"
            value={userEdit?.name}
            setValue={(val) =>
              setUserEdits((prev) => ({
                ...prev,
                name: val,
              }))
            }
            valValidator={nameValidator}
            errFields={errFields}
            setErrFields={setErrFields}
          />
          <div className="my-8">
            <InputSelect
              name="role"
              optionItems={[
                { value: "lawyer", text: "✍🏾 lawyer" },
                { value: "admin", text: "💼 administrator" },
              ]}
              value={userEdit?.role}
              onChange={(e) => {
                setUserEdits((prev) => ({
                  ...prev,
                  role: e.target.value,
                }));
              }}
              icon={SVGfilter}
              defaultOption="role"
            />
          </div>
          <InputImage
            _photo={selectedUser.photoUrl ?? ""}
            setPhoto={async (photoFile_) => {
              setUserEdits((prevUser_) => {
                return { ...prevUser_, photoFile_ };
              });
            }}
          />
          <div className="mt-8">
            <ButtonPrimary
              label="Save User"
              disabled={!userEdit.email || !userEdit.name}
              loading={UIstate === "loading"}
              onClick={handleCreateUser}
            />
          </div>
        </div>
      ) : selectedUser?.id ? (
        <>
          <div className="">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Existing User:{" "}
              <span className="font-normal text-emerald-700 dark:text-emerald-400 pl-4">
                {strPascalcase(selectedUser.email)}
              </span>
            </h3>
            <InputText
              label="Email address *"
              name="email-address"
              placeholder="Email address"
              value={userEdit?.email ?? selectedUser.email}
              setValue={(val) =>
                setUserEdits((prev) => ({
                  ...prev,
                  email: val,
                }))
              }
              valValidator={emailValidator}
              errFields={errFields}
              setErrFields={setErrFields}
            />
            <InputText
              label="Name *"
              name="names"
              placeholder="User's name"
              value={userEdit?.name ?? selectedUser.name}
              setValue={(val) =>
                setUserEdits((prev) => ({
                  ...prev,
                  name: val,
                }))
              }
              valValidator={nameValidator}
              errFields={errFields}
              setErrFields={setErrFields}
            />
            <div className="my-8">
              <InputSelect
                name="role"
                optionItems={[
                  { value: "lawyer", text: "✍🏾 lawyer" },
                  { value: "admin", text: "💼 administrator" },
                ]}
                value={userEdit?.role ?? selectedUser.role}
                onChange={(e) => {
                  setUserEdits((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }));
                }}
                icon={SVGfilter}
                defaultOption="role"
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <ButtonPrimary
                label="Update User Info"
                onClick={handleEditUser}
                disabled={!isUpdatedUsr}
              />
            </div>
            <ButtonDestructive
              label="delete user"
              onClick={handleDeleteUser}
              loading={false}
            />
          </div>
        </>
      ) : (
        <h3 className="text-lg font-light italic text-gray-500 mb-2">
          Select an item on the left to view details
        </h3>
      )}
    </div>
  );
}
