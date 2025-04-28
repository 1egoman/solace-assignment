"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LoaderIcon } from "lucide-react";
import debounce from 'lodash.debounce';
import { useQuery } from "@tanstack/react-query";

import { Advocate } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const SEARCH_TEXT_DEBOUNCE_RATE_MS = 500;

export default function Home() {
  const [searchText, setSearchText] = useState('');

  // Debounce the search text and use that debounced value to trigger refetcing the advocates data
  // from the server
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const updateDebouncedSearchState = useMemo(() => {
    return debounce((searchText: string) => {
      setDebouncedSearchText(searchText);
    }, SEARCH_TEXT_DEBOUNCE_RATE_MS);
  }, []);
  useEffect(() => updateDebouncedSearchState(searchText), [searchText]);

  const { status, data } = useQuery({
    queryKey: ['advocates', debouncedSearchText],
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

  return (
    <main className="fixed inset-0 flex flex-col gap-4">
      <div className="flex items-center justify-center border-b">
        <div className="flex items-center justify-between h-12 w-full max-w-[1200px] px-2">
          <h1 className="font-medium">Solace Advocates</h1>
        </div>
      </div>

      <div className="flex justify-center overflow-auto">
        <div className="flex flex-col items-center w-full max-w-[1200px] px-2">
          <div className="flex justify-end items-center w-full h-10 border-b grow-0 shrink-0">
            {/* FIXME: replace the below input with a shadcn component or something similar */}
            <input
              style={{ border: "1px solid black" }}
              value={searchText}
              onChange={onSearchChange}
              placeholder="Search"
            />
          </div>

          {status === 'pending' ? (
            <div>
              <LoaderIcon size={32} className="animate-spin" />
            </div>
          ) : null}
          {status === 'error' ? (
            <div>
              <span className="text-red-500">Error loading advocates!</span>
            </div>
          ) : null}
          {status === 'success' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead>Specialties</TableHead>
                  <TableHead>Years of Experience</TableHead>
                  <TableHead>Phone Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((advocate) => {
                  return (
                    <TableRow key={advocate.id}>
                      <TableCell>{advocate.firstName}</TableCell>
                      <TableCell>{advocate.lastName}</TableCell>
                      <TableCell>{advocate.city}</TableCell>
                      <TableCell>{advocate.degree}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          {advocate.specialties.map((s) => (
                            <div key={s}>
                              <div className="inline-flex items-center bg-gray-800 px-2 h-6 rounded-full">
                                <span className="text-xs text-gray-100 truncate">{s}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{advocate.yearsOfExperience}</TableCell>
                      <TableCell>{advocate.phoneNumber}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              {data.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex items-center justify-center h-20">
                        <span className="text-gray-500">No advocates found!</span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : null}
            </Table>
          ) : null}
        </div>
      </div>
    </main>
  );
}
