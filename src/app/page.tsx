"use client";

import { useCallback, useState } from "react";
import { Advocate } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

export default function Home() {
  const [searchText, setSearchText] = useState('');
  const { status, data } = useQuery({
    queryKey: ['advocates', searchText],
    queryFn: async () => {
      const response = await fetch(`/api/advocates?search=${searchText}`);
      if (!response.ok) {
        throw new Error(`Error fetching advocates: received ${response.status} ${await response.text()}`);
      }

      const body: { data: Array<Advocate> } = await response.json();
      return body.data;
    },
  });

  const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }, []);

  const onResetSearch = useCallback(() => {
    setSearchText('');
  }, []);

  switch (status) {
    case 'pending':
      return (
        <div>
          <LoaderIcon size={32} className="animate-spin" />
        </div>
      );

    case 'error':
      return (
        <div>
          <span className="text-red-500">Error loading advocates!</span>
        </div>
      );

    case 'success':
      return (
        <main style={{ margin: "24px" }}>
          <h1>Solace Advocates</h1>
          <br />
          <br />
          <div>
            <p>Search</p>
            <input style={{ border: "1px solid black" }} value={searchText} onChange={onSearchChange} />
            <button onClick={onResetSearch}>Reset Search</button>
          </div>
          <br />
          <br />
          <table>
            <thead>
              <th>First Name</th>
              <th>Last Name</th>
              <th>City</th>
              <th>Degree</th>
              <th>Specialties</th>
              <th>Years of Experience</th>
              <th>Phone Number</th>
            </thead>
            <tbody>
              {data.map((advocate) => {
                return (
                  <tr>
                    <td>{advocate.firstName}</td>
                    <td>{advocate.lastName}</td>
                    <td>{advocate.city}</td>
                    <td>{advocate.degree}</td>
                    <td>
                      {advocate.specialties.map((s) => (
                        <div>{s}</div>
                      ))}
                    </td>
                    <td>{advocate.yearsOfExperience}</td>
                    <td>{advocate.phoneNumber}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </main>
      );
  }
}
