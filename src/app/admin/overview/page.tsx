import React from "react";
import NumberOfUsers from "./_components/NumberOfUsers";
import Header from "../_components/header";
import UsersPercentage from "./_components/users-percentage";

export default function OverviewPage() {
  const pages = ["Dashboard", "Overview"];
  return (
    <div>
      <Header breadcrumbPages={pages} />

      <NumberOfUsers />
      <div className="px-3">
        <UsersPercentage />
      </div>
    </div>
  );
}
