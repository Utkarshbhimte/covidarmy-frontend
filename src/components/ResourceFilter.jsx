import * as React from "react"
import Link from "next/link"
import FilterButton from "./FilterButton"

export default function ResourceFilter({ data, city, resource }) {

  const [changeResource, setChangeResource] = React.useState(false);

  const citySelected = () => {
    return (
      <div className="shadow-md border border-gray-200 rounded-md bg-white text-center box-border h-auto w-full my-2 p-3 lg:p-6">
        <div className="flex">
          <svg
            className="mt-0.5"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 16.5C9 16.5 15 13.5 15 9V3.75L9 1.5L3 3.75V9C3 13.5 9 16.5 9 16.5Z"
              fill="#4F46EF"
            />
            <path
              d="M9 6V10"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7 8H11"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p className="text-strong mt-0 ml-1 font-bold">Choose Resources</p>
        </div>
        <div className="mt-2 text-start text-left flex-wrap flex items-center justify-start">
          {data.map((item) => {
            return (
              <FilterButton
                key={item}
                active={
                  typeof resource === "string" &&
                  item.toLowerCase() === resource.toLowerCase()
                }
                href={
                  city === null
                    ? `/${item.toLowerCase()}`
                    : `/${city}` + `/${item.toLowerCase()}`
                }
              >
                {item}
              </FilterButton>
            )
          })}
        </div>
      </div>
    )
  }

  const cityResourceSelected = () => {
    return (
      <div className="shadow-md border border-gray-200 rounded-md bg-white text-center box-border h-auto w-full my-2 p-3 lg:p-6">
        <div className="flex ml-1 justify-between">
          <div className="flex">
            {/* ICON */}
            <svg
            className="mt-0.5"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 16.5C9 16.5 15 13.5 15 9V3.75L9 1.5L3 3.75V9C3 13.5 9 16.5 9 16.5Z"
              fill="#4F46EF"
            />
            <path
              d="M9 6V10"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7 8H11"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
            {/* CITY NAME */}
            <p className="text-strong ml-1 mt-0.5 font-bold capitalize">
              {resource}
            </p>
          </div>

          {/* CHANGE BUTTON */}
          <button onClick={() => setChangeResource(!changeResource)} >
            <span className="font-bold text-primary">Change</span>
          </button>
        </div>
      </div>
    )
  }

  const noneSelected = () => {
    return (
      <div className="shadow-md border border-gray-200 rounded-md bg-gray-100 text-center box-border h-auto w-full my-2 p-3 lg:p-6 cursor-not-allowed">
        <div className="flex">
          <svg
            className="mt-0.5"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 16.5C9 16.5 15 13.5 15 9V3.75L9 1.5L3 3.75V9C3 13.5 9 16.5 9 16.5Z"
              fill="#6B7280"
            />
            <path
              d="M9 6V10"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7 8H11"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p className="text-strong mt-0 ml-1 font-bold text-gray-500">Please select city first</p>
        </div>
      </div>
    )
  }

  if(city && resource && !changeResource) {
    return cityResourceSelected()
  }
  else if (city) {
    return citySelected()
  }
  else {
    return noneSelected()
  }
}
