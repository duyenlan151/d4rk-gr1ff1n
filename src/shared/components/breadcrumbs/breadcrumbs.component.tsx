import { Link, useLocation } from "react-router-dom";
import { Breadcrumbs } from "@mui/material";
import { useSignal } from "@preact/signals-react";
import { useEffect } from "react";

function kebabToTitleCase(str: string) {
  return str
    .split("-")
    .map(([firstChar, ...others]) => `${firstChar.toUpperCase()}${others.join("")}`)
    .join(" ");
}

const BreadcrumbsContainer = () => {
  const location = useLocation();
  const breadcrumbs = useSignal<{ name: string; path: string }[]>([]);

  useEffect(() => {
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment !== "");

    breadcrumbs.value = pathSegments.map((segment, index) => ({
      name: segment, // Replace with the appropriate breadcrumb name for each segment
      path: `/${pathSegments.slice(0, index + 1).join("/")}`, // Generate the breadcrumb path based on the current segment
    }));
  }, [breadcrumbs, location]);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbs.value.map((breadcrumb, index) => (
        <span key={breadcrumb.path}>
          {index < breadcrumbs.value.length - 1 ? (<Link to={breadcrumb.path}>{kebabToTitleCase(breadcrumb.name)}</Link>) : (<span>{kebabToTitleCase(breadcrumb.name)}</span>)}
        </span>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsContainer;
