import { ButtonPrimary, ButtonDestructive } from "@/components/atoms/buttons";
import { InputSelect, InputText, InputDate, InputImage } from "./inputs";
import { strPascalcase } from "@/helpers/stringHandlers";
import { dateShort, isDatePassed } from "@/helpers/dateHandlers";
import { emailValidator, nameValidator } from "@/helpers/inputValidators";
import { SVGfilter } from "@/components/atoms/svgs";
import { useEdgeStore } from "@/lib/edgestore";

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
  const { edgestore } = useEdgeStore();
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
          <div className="flex flex-row justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {strPascalcase(selectedUser.name) + " " + selectedUser.name}{" "}
            </h3>
            <span>
              <span
                className={
                  // defaul.email
                  true
                    ? `bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300`
                    : // : isDatePassed(new Date(defaul.dueDate))
                    false
                    ? "bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
                    : "bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                }
              >
                {selectedUser.name}
              </span>
            </span>
          </div>
          <p className="mb-6">{selectedUser.email}</p>
          <div>
            {/* {!selectedUser.logoUrl ? (
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="file_input"
                >
                  Attach headshot
                </label>
                <p
                  className="mb-1 text-xs text-gray-500 dark:text-gray-300"
                  id="file_input_help"
                >
                  pdf,word (2MB max)
                </p>
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="file_input"
                  type="file"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  placeholder="Select a file"
                  onChange={(e) => {
                    if (
                      e.target.files[0] &&
                      ["pdf", "doc", "docx"].includes(
                        e.target.files[0].name.split(".").pop()
                      ) &&
                      e.target.files[0].size < 2100000
                    )
                      setDocAttachment(e.target.files[0]);
                    else toast.error("File must not exceed 2MB pdf,word");
                  }}
                />
              </div>
            ) : (
              <img src={selectedUser.logoUrl} alt="img" />
            )} */}
            <InputImage
              photo={userEdit.photoUrl}
              setPhoto={async (photo_) => {
                const resPhoto = await edgestore.publicFiles.upload({
                  photo_,
                  onProgressChange: (progress) => {
                    // you can use this to show a progress bar
                    console.log(progress);
                  },
                });
                // you can run some server action or api here
                // to add the necessary data to your database
                //   const res: {
                //     url: string;
                //     size: number;
                //     uploadedAt: Date;
                //     metadata: Record<string, never>;
                //     path: Record<string, never>;
                //     pathOrder: string[];
                // }
                console.log(resPhoto);
              }}
            />
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <ButtonPrimary
                label="Update User Info"
                onClick={handleEditUser}
                disabled={selectedUser.item?.completedByID}
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
