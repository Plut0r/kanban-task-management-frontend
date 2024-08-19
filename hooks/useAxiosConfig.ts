"use client"

import { baseURL } from "@/store/data";
import { tokenAtom } from "@/store/globalAtom";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useEffect } from "react";

const useAxiosConfig = () => {
  const token = useAtomValue(tokenAtom);

  useEffect(() => {
    axios.defaults.baseURL = baseURL;
    axios.defaults.headers.post["Content-Type"] = "application/json";
    axios.defaults.headers.post["Accept"] = "application/json";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token]);
};

export default useAxiosConfig;
