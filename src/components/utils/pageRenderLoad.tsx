"use client";

import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import PageLoad from "./pageLoad";
import { refreshAuthentication } from "@/redux/slices/user";
import { useEffect } from "react";

const PageRenderLoad: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshAuthentication());
  }, [dispatch]);
  
  const { loading } = useSelector((state: RootState) => state.auth);

  if (loading) return <PageLoad />;

  return children;
};

export default PageRenderLoad;
