import React from "react";
import { NextPage } from "next";

const Application: NextPage<any> = props => {
  const { Component, pageProps } = props;

  return <Component {...pageProps} />;
};

export default Application;
