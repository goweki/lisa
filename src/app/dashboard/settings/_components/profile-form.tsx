"use client";

import { useForm } from "react-hook-form";
import { DataContext } from "@/app/dashboard/providers";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { User } from "@prisma/client";
import { emailValidator, nameValidator } from "@/helpers/inputValidators";
import toast from "react-hot-toast";
import { InputTel } from "@/components/ui/input-tel";
import { isValidPhoneNumber } from "react-phone-number-input";
import { InputImage } from "@/components/atoms/inputs";
import { useEdgeStore } from "@/lib/edgestore";
import { UIstate } from "@/types/custom";
import { Loader } from "@/components/atoms/loader";
import { ProfileEdit as _ProfileEdit } from "@/types/custom";
import { showWarningToast } from "@/components/atoms/customToast";

interface ProfileEdit extends Omit<_ProfileEdit, "id"> {
  photoFile?: File;
}

const def_ProfileEdit: ProfileEdit = {
  names: "",
  email: "",
  tel: null,
  photoUrl: null,
};

export function ProfileForm() {
  const [user, setUser] = useState<User>();
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [UIstate, setUIstate] = useState<UIstate>("loading");
  const { edgestore } = useEdgeStore();
  const form = useForm<ProfileEdit>({
    defaultValues: def_ProfileEdit,
  });

  const {
    data: { users },
    refreshData,
  } = useContext(DataContext);
  const { data: session } = useSession();

  // initialize form data
  useEffect(() => {
    if (users && session?.user) {
      const matchedUser = users.find(({ id }) => id === session.user?.id);
      if (!matchedUser) return;
      setUser(matchedUser);
      form.reset({
        names: matchedUser.names,
        email: matchedUser.email || undefined,
        tel: matchedUser.tel,
        photoUrl: matchedUser.photoUrl,
        photoFile: undefined,
      });
    }
    setUIstate("OK");
  }, []);

  // chack if isUpdated
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (!user) {
        setIsUpdated(false);
        return;
      }

      const hasChanged =
        !!values.photoFile ||
        values.names !== (user.names || "") ||
        values.email !== (user.email || "") ||
        (values.tel || "") !== (user.tel || "");

      setIsUpdated(hasChanged);
    });

    return () => subscription.unsubscribe(); // cleanup
  }, [form, user]);

  const onSubmit = async (data: ProfileEdit) => {
    if (!session?.user?.id || !user) {
      return;
    }

    console.log("Form data: ", data);
    const { names, tel, photoFile } = data;
    if (!names && !tel) {
      toast.error("Please provide names and Phone No.");
      return;
    }

    const namesErr = names ? nameValidator(names) : "";
    if (namesErr) {
      toast.error(namesErr);
      return;
    }

    const telErr = !tel
      ? ""
      : !isValidPhoneNumber(tel)
        ? "Invalid phone number"
        : "";
    if (telErr) {
      toast.error(telErr);
      return;
    }

    setUIstate("loading");

    try {
      //upload image and retain url
      let photoUrl: string | null = null;
      if (photoFile) {
        // console.log("New logo to be uploaded");

        const uploadOptions: { replaceTargetUrl: string } | undefined =
          !user.photoUrl
            ? undefined
            : {
                replaceTargetUrl: user.photoUrl,
              };

        const photoEdgeUpload = await edgestore.publicFiles.upload({
          file: photoFile,
          options: uploadOptions,
          // onProgressChange: (progress) => {
          //   // you can use this to show a progress bar
          //   console.log(progress);
          // },
        });
        // upload file using edgestore- edgestore returns:
        // const res: {
        //   url: string;
        //   size: number;
        //   uploadedAt: Date;
        //   metadata: Record<string, never>;
        //   path: Record<string, never>;
        //   pathOrder: string[];
        // }

        // console.log("edge File - ", logoEdgeUpload);
        photoUrl = photoEdgeUpload.url;
        // setUserEdit((prev) => {
        //   return { ...prev, photoFile: undefined };
        // });
        form.setValue("photoFile", undefined);
        if (!photoUrl) {
          console.error("image upload failed");

          showWarningToast("Photo could not be uploaded");
        }
      }

      //new user obj for PATCH
      const body_profilePatch: Partial<_ProfileEdit> = {
        id: session.user.id,
        names: names && names !== user.names ? names : undefined,
        // email: email||undefined,
        tel: tel && tel !== user.tel ? tel : undefined,
        photoUrl,
      };
      console.log("body_", body_profilePatch);

      const fetchOptions = {
        method: "PATCH",
        body: JSON.stringify(body_profilePatch),
      };

      // PATCH request using fetch
      const res = await fetch("/api/dashboard/profile", fetchOptions).then(
        async (res_) => {
          if (res_?.ok) {
            return await res_.json();
          } else {
            const error_ =
              (await res_.json()).message ||
              `ERROR: ` + res_.status + "Unknown error";
            console.error(error_);
            toast.error("Error updating profile");
            return null;
          }
        }
      );
      if (!res) return;
      //res is truthy
      console.log("SUCCESS: profile updated\n > ", res, "\n..............");
      toast.success(res);
      await refreshData();
    } catch (error) {
      console.error("fetch failed:", error);
      toast.error("FAILED to update profile. Try again later");
    } finally {
      setUIstate("OK");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="names"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Full names" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled placeholder="Email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone No.</FormLabel>
              <FormControl>
                {/* <Input placeholder="Phone number" {...field} value={field.value || ""} /> */}
                <InputTel
                  // country="US"
                  onChange={field.onChange}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div id="dpWrapper" className="py-4">
          <FormField
            control={form.control}
            name="photoFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile</FormLabel>
                <FormControl>
                  {/* <Input placeholder="Phone number" {...field} value={field.value || ""} />
                  <InputTel
                    country="US"
                    {...field} value={field.value || ""} /> */}
                  <InputImage
                    label="Photo"
                    _photo={user?.photoUrl || ""}
                    setPhoto={async (_imageFile: File | null) => {
                      // setProfileEdits((prev_) => ({
                      //   ...prev_,
                      //   photoFile: _imageFile || undefined,
                      // }));
                      field.onChange(_imageFile);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Button
            disabled={!isUpdated || UIstate === "loading"}
            type="submit"
            className="mt-4"
          >
            {UIstate === "loading" ? <Loader /> : "Update profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
