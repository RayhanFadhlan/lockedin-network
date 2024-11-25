import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, active }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleNavigate}
      className={`flex flex-col items-center text-sm ${
        active ? "text-black" : "text-gray-500"
      } hover:text-black focus:outline-none`}
    >
      {icon}
      <span className="mt-1 text-base">{label}</span>
    </button>
  );
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-300 top-0 fixed w-full h-[80px] z-50">
      <div className="container mx-auto">
        <div className="flex justify-center items-center px-4 mt-3 gap-60 sm:gap-0">
          <button onClick={() => navigate("/")} className="focus:outline-none">
            <svg
              className="text-blue-600 h-12 w-12"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
            </svg>
          </button>

          <button className="sm:hidden focus:outline-none" onClick={toggleMenu}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 18L20 18"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M4 12L20 12"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M4 6L20 6"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>

          <div className="hidden sm:flex items-center ml-28 gap-14">
            <NavItem
              icon={
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              }
              label="Home"
              to="/"
            />
            <NavItem
              icon={
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              }
              label="Users"
              to="/users"
            />
            <NavItem
              icon={
                <svg
                  fill="currentColor"
                  width="30px"
                  height="30px"
                  viewBox="0 0 439.833 439.833"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g>
                      {" "}
                      <g>
                        {" "}
                        <g>
                          {" "}
                          <polygon points="259.164,350.396 278.696,358.185 331.142,320.003 300.912,320.003 "></polygon>{" "}
                          <polygon points="246.048,195.833 299.966,235.085 319.497,227.296 276.278,195.833 "></polygon>{" "}
                          <polygon points="180.663,350.392 138.922,320.003 108.691,320.003 161.132,358.18 "></polygon>{" "}
                          <polygon points="193.786,195.833 163.556,195.833 120.33,227.3 139.862,235.089 "></polygon>{" "}
                          <g>
                            {" "}
                            <path d="M219.927,11.558c-23.854,0-37.057,12.362-36.814,36.182c0.348,32.623,14.211,52.414,36.814,52.068 c0,0,36.802,1.492,36.802-52.068C256.729,23.918,244.294,11.558,219.927,11.558z"></path>{" "}
                            <path d="M285.017,124.567l-36.77-14.659l-8.608-7.256c-2.274-1.922-5.636-1.78-7.741,0.317l-11.973,11.904l-12.008-11.907 c-2.109-2.094-5.465-2.229-7.736-0.313l-8.611,7.256l-36.77,14.661c-11.842,4.715-11.83,46.647-12.848,50.497h155.93 C296.866,171.228,296.862,129.28,285.017,124.567z"></path>{" "}
                          </g>{" "}
                          <g>
                            {" "}
                            <path d="M77.976,228.568c0,0,36.801,1.492,36.801-52.068c0-23.82-12.434-36.182-36.801-36.182 c-23.854,0-37.057,12.362-36.814,36.182C41.509,209.124,55.372,228.915,77.976,228.568z"></path>{" "}
                            <path d="M143.065,253.329l-36.77-14.658l-8.609-7.256c-2.275-1.923-5.635-1.781-7.742,0.315l-11.971,11.904l-12.008-11.908 c-2.109-2.094-5.465-2.229-7.736-0.312l-8.611,7.256l-36.77,14.66C1.006,258.045,1.018,299.977,0,303.827h155.93 C154.915,299.988,154.911,258.042,143.065,253.329z"></path>{" "}
                            <path d="M361.878,228.568c0,0,36.801,1.492,36.801-52.068c0-23.82-12.434-36.182-36.801-36.182 c-23.854,0-37.057,12.362-36.812,36.182C325.411,209.124,339.274,228.915,361.878,228.568z"></path>{" "}
                            <path d="M426.968,253.329l-36.77-14.658l-8.609-7.256c-2.273-1.923-5.635-1.781-7.742,0.315l-11.971,11.904l-12.008-11.908 c-2.109-2.094-5.465-2.229-7.736-0.312l-8.61,7.256l-36.771,14.66c-11.842,4.715-11.83,46.646-12.848,50.497h155.93 C438.817,299.988,438.812,258.042,426.968,253.329z"></path>{" "}
                          </g>{" "}
                          <g>
                            {" "}
                            <path d="M219.927,264.767c-23.854,0-37.057,12.361-36.814,36.182c0.348,32.625,14.211,52.414,36.814,52.068 c0,0,36.802,1.492,36.802-52.068C256.729,277.128,244.294,264.767,219.927,264.767z"></path>{" "}
                            <path d="M285.017,377.778l-36.77-14.66l-8.608-7.256c-2.274-1.922-5.636-1.78-7.741,0.316l-11.973,11.904l-12.008-11.906 c-2.109-2.096-5.465-2.229-7.736-0.313l-8.611,7.255l-36.77,14.661c-11.842,4.716-11.83,46.646-12.848,50.496h155.93 C296.866,424.437,296.862,382.489,285.017,377.778z"></path>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>{" "}
                    </g>{" "}
                  </g>
                </svg>
              }
              label="Connections"
              to="/connections"
            />
            <NavItem
              icon={
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              label="Messaging"
              to="/messaging"
            />
            <NavItem
              icon={
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              }
              label="Invitations"
              to="/invitation"
            />
            <NavItem
              icon={
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              label="Me"
              to="/profile"
            />
          </div>

          {menuOpen && (
            <div className="sm:hidden absolute top-full left-0 w-full bg-white shadow-md z-40">
              <div className="flex flex-col items-center gap-4 p-4">
                <NavItem
                  icon={
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  }
                  label="Home"
                  to="/"
                />
                <NavItem
                  icon={
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  }
                  label="Users"
                  to="/users"
                />
                <NavItem
                  icon={
                    <svg
                      fill="currentColor"
                      width="27px"
                      height="27px"
                      viewBox="0 0 439.833 439.833"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g>
                          {" "}
                          <g>
                            {" "}
                            <g>
                              {" "}
                              <polygon points="259.164,350.396 278.696,358.185 331.142,320.003 300.912,320.003 "></polygon>{" "}
                              <polygon points="246.048,195.833 299.966,235.085 319.497,227.296 276.278,195.833 "></polygon>{" "}
                              <polygon points="180.663,350.392 138.922,320.003 108.691,320.003 161.132,358.18 "></polygon>{" "}
                              <polygon points="193.786,195.833 163.556,195.833 120.33,227.3 139.862,235.089 "></polygon>{" "}
                              <g>
                                {" "}
                                <path d="M219.927,11.558c-23.854,0-37.057,12.362-36.814,36.182c0.348,32.623,14.211,52.414,36.814,52.068 c0,0,36.802,1.492,36.802-52.068C256.729,23.918,244.294,11.558,219.927,11.558z"></path>{" "}
                                <path d="M285.017,124.567l-36.77-14.659l-8.608-7.256c-2.274-1.922-5.636-1.78-7.741,0.317l-11.973,11.904l-12.008-11.907 c-2.109-2.094-5.465-2.229-7.736-0.313l-8.611,7.256l-36.77,14.661c-11.842,4.715-11.83,46.647-12.848,50.497h155.93 C296.866,171.228,296.862,129.28,285.017,124.567z"></path>{" "}
                              </g>{" "}
                              <g>
                                {" "}
                                <path d="M77.976,228.568c0,0,36.801,1.492,36.801-52.068c0-23.82-12.434-36.182-36.801-36.182 c-23.854,0-37.057,12.362-36.814,36.182C41.509,209.124,55.372,228.915,77.976,228.568z"></path>{" "}
                                <path d="M143.065,253.329l-36.77-14.658l-8.609-7.256c-2.275-1.923-5.635-1.781-7.742,0.315l-11.971,11.904l-12.008-11.908 c-2.109-2.094-5.465-2.229-7.736-0.312l-8.611,7.256l-36.77,14.66C1.006,258.045,1.018,299.977,0,303.827h155.93 C154.915,299.988,154.911,258.042,143.065,253.329z"></path>{" "}
                                <path d="M361.878,228.568c0,0,36.801,1.492,36.801-52.068c0-23.82-12.434-36.182-36.801-36.182 c-23.854,0-37.057,12.362-36.812,36.182C325.411,209.124,339.274,228.915,361.878,228.568z"></path>{" "}
                                <path d="M426.968,253.329l-36.77-14.658l-8.609-7.256c-2.273-1.923-5.635-1.781-7.742,0.315l-11.971,11.904l-12.008-11.908 c-2.109-2.094-5.465-2.229-7.736-0.312l-8.61,7.256l-36.771,14.66c-11.842,4.715-11.83,46.646-12.848,50.497h155.93 C438.817,299.988,438.812,258.042,426.968,253.329z"></path>{" "}
                              </g>{" "}
                              <g>
                                {" "}
                                <path d="M219.927,264.767c-23.854,0-37.057,12.361-36.814,36.182c0.348,32.625,14.211,52.414,36.814,52.068 c0,0,36.802,1.492,36.802-52.068C256.729,277.128,244.294,264.767,219.927,264.767z"></path>{" "}
                                <path d="M285.017,377.778l-36.77-14.66l-8.608-7.256c-2.274-1.922-5.636-1.78-7.741,0.316l-11.973,11.904l-12.008-11.906 c-2.109-2.096-5.465-2.229-7.736-0.313l-8.611,7.255l-36.77,14.661c-11.842,4.716-11.83,46.646-12.848,50.496h155.93 C296.866,424.437,296.862,382.489,285.017,377.778z"></path>{" "}
                              </g>{" "}
                            </g>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                  }
                  label="Connections"
                  to="/connections"
                />
                <NavItem
                  icon={
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                  label="Messaging"
                  to="/messaging"
                />
                <NavItem
                  icon={
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  }
                  label="Invitations"
                  to="/invitation"
                />
                <NavItem
                  icon={
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                  label="Me"
                  to="/profile"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
