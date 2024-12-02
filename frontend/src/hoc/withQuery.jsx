import React from "react";
import { useQuery } from "@apollo/client";

const withQuery = (WrappedComponent, query) => {
  return function (props) {
    const { data, loading, error } = useQuery(query);

    return (
      <WrappedComponent
        {...props}
        data={data}
        loading={loading}
        error={error}
      />
    );
  };
};

export default withQuery;
