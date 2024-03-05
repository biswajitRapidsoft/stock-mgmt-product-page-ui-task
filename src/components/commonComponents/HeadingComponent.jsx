// CommonComponent.js
import React from "react";
import { Box, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const HeadingComponent = ({ title, breadcrumbs, links }) => {
  const navigate = useNavigate();

  //   function handleArrowClick() {
  //     // if (links.url) {
  //     navigate(links[0].url);
  //     console.log("links.url", links[0].url);
  //     console.log("handlearrow click is called");
  //     // }
  //   }

  const handleArrowClick = () => {
    const currentUrl = window.location.pathname;
    const currentIndex = links.findIndex((link) => link.url === currentUrl);
    const previousIndex = Math.max(0, currentIndex - 1);
    const previousLink = links[previousIndex];
    if (previousLink && previousLink.url) {
      navigate(previousLink.url);
    }
  };

  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
      {breadcrumbs.length !== 0 && Object.keys(links).length !== 0 && (
        <ArrowBackIcon
          sx={{
            fontSize: "2em",
            mt: 2,
            color: "rgb(45, 176, 181)",
            cursor: "pointer",
          }}
          onClick={() => handleArrowClick()}
        />
      )}

      <Box sx={{ px: 3, pl: "", pt: "", backgroundColor: "" }}>
        <div role="presentation" onClick={handleClick}>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#2a3478",
            }}
          >
            {title}
          </Typography>

          <Breadcrumbs aria-label="breadcrumb">
            <Breadcrumbs aria-label="breadcrumb">
              {links.map((link, index) => (
                <Link
                  key={index}
                  underline="hover"
                  style={{ color: "grey" }}
                  // href="/"
                  to={link.url}
                >
                  {link.label}
                </Link>
              ))}

              {breadcrumbs.map((breadcrumb, index) => (
                <Typography key={index} color="text.primary">
                  {breadcrumb}
                </Typography>
              ))}
            </Breadcrumbs>
          </Breadcrumbs>
        </div>
      </Box>
    </Box>
  );
};

export default HeadingComponent;
