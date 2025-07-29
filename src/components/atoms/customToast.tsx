'use client'

import toast from "react-hot-toast";

export function showWarningToast(message: string) {
    toast.custom(
        <div className="bg-orange-200 text-orange-800 px-4 py-2 rounded-lg">
            {message}
        </div>
    );
}


