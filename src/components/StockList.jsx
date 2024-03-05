import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Autocomplete,
  Button,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Checkbox from "@mui/material/Checkbox";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import DynamicBreadcrumb from "./DynamicBreadcrumb";
import CableIcon from "@mui/icons-material/Cable";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import WaterDropIcon from "@mui/icons-material/WaterDrop";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import config from "../config/config";
import axios from "axios";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import { utils, writeFile } from "xlsx";

import MenuItem from "@mui/material/MenuItem";
import { StockListAction } from "../actions/StockListAction";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router";
import Logo from "../images/excel.png";
import FirmData from "../data/FirmData";
import HeadingComponent from "./commonComponents/HeadingComponent";

import CatgeoryData from "../data/CategoryData";
import SearchIcon from "@mui/icons-material/Search";

import "../css/StockList.css";
//loader
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const StockList = () => {
  const isSideBarPinned = false;
  const isOpenforGridTable = false;
  // const breadcrumbs = [{ name: "Dashboard", path: "/" }];

  const navigate = useNavigate();

  const [productsData, setProductsData] = useState([]);
  const [firmList, setFirmList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const [filteredCategoryList, setFilteredCategoryList] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  //headingcomponent
  const title = "Stock Mangement";
  const breadcrumbs = [];
  const links = [
    { label: "", url: "" },
    // { label: "Link 2", url: "/link2" },
    // Add more links as needed
  ];

  //loader
  const [open, setOpen] = React.useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#32577e",
      color: theme.palette.common.white,
      fontSize: "18px",
      borderBottom: "none",

      fontWeight: "bolder",
      color: "rgb(255, 255, 255)",

      "&:not(:last-child)": {
        borderRight: "1px solid #fff",
      },
      "&:first-of-type": {
        borderTopLeftRadius: "15px",
        borderBottomLeftRadius: "15px",
      },
      "&:last-child": {
        borderTopRightRadius: "15px",
        borderBottomRightRadius: "15px",
      },
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      // backgroundColor: "#FAF9F6",
      // backgroundColor: "white",

      // borderBottom: "4px",
      // marginBottom: "4px",

      // "&:not(:last-child)": {
      //   borderRight: "1px solid #fff",
      // },
      "&:first-of-type": {
        borderTopLeftRadius: "15px",
        borderBottomLeftRadius: "15px",
      },
      "&:last-child": {
        borderTopRightRadius: "15px",
        borderBottomRightRadius: "15px",
      },

      // color: theme.palette.common.white,
      // color: "rgb(255, 255, 255)",

      // "&:not(:last-child)": {
      //   borderRight: "1px solid #fff",
      // },

      // "&:first-of-type": {
      //   borderTopLeftRadius: "15px",
      //   borderBottomLeftRadius: "15px",
      // },
      // "&:last-child": {
      //   borderTopRightRadius: "15px",
      //   borderBottomRightRadius: "15px",
      // },
      // borderBottom: "1px solid rgb(224, 224, 224)",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme, product }) => ({
    height: "80px",
    // boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    // gap: "2rem",
    // borderBottom: "2px solid #E5E4E2	",
    // backgroundColor:
    //   product.currentQuantity < product.minReorderQuantity ? "red" : "white",

    "&:first-of-type": {
      borderTopLeftRadius: "15px",
      borderBottomLeftRadius: "15px",
    },
    "&:last-child": {
      borderTopRightRadius: "15px",
      borderBottomRightRadius: "15px",
    },

    // borderBottom: "1px solid rgb(224, 224, 224)",
    // borderCollapse: "none",

    // "&:nth-of-type(odd)": {
    //   backgroundColor: theme.palette.action.hover,
    // },
    // "&:last-child td, &:last-child th": {
    //   border: 0,
    // },
    // borderBottom: "1px solid black",
    // "&:not(:last-child)": {
    //   borderRight: "1px solid #fff",
    // },
    // "&:first-of-type": {
    //   borderTopLeftRadius: "15px",
    //   borderBottomLeftRadius: "15px",
    // },
    // "&:last-child": {
    //   borderTopRightRadius: "15px",
    //   borderBottomRightRadius: "15px",
    // },
  }));

  function calculateSerialNumber(index) {
    return index + 1;
  }

  const fetchData = async () => {
    setOpen(true);
    try {
      const response = await StockListAction.Stock();
      // const response = await axios.get(
      //   "https://sfaordersstaging.nyggs.com/backend/api/get/all/products?companyId=17"
      // );
      if (response.data.responseCode === 200) {
        setProductsData(response.data.data);
      }
    } catch (err) {
      console.log(err.message);
    }

    setOpen(false);
  };

  const exportData = () => {
    let tableHeaders = [
      "Firm",
      "",

      "Category",
      "",

      "SKU",
      "",

      "Product",
      "",

      "Unit",
      "",

      "Current Qty",
      "",

      " Physical Qty",
      "",

      "Total Qty",
      "",

      "Max Samples",
      "",

      "HSN",
      "",
    ];

    let tableRows = filteredProducts?.flatMap((product) => [
      [
        `${product?.firm?.firmName}`,
        "",

        `${product?.category?.categoryName}`,
        "",
        `${product?.skuCode}`,
        "",
        `${product?.productName}`,
        "",
        `${product?.unitName}`,
        "",
        `${product?.currentQuantity}`,
        "",
        `${product?.physicalAvailableQuantity}`,
        "",
        `${product?.currentQuantity}`,
        "",
        `${product?.maxNoOfSamples}`,
        "",
        `${product?.hsnCode}`,
        "",
      ],
    ]);

    let wsData = [tableHeaders, ...tableRows];

    let wb = utils.book_new();
    let ws = utils.aoa_to_sheet(wsData);

    utils.book_append_sheet(wb, ws, "items");
    writeFile(wb, "product_data.xlsx");
  };

  const handleFirmChange = (event, value) => {
    if (value) {
      setSelectedFirmId(value.id);
    } else {
      setSelectedFirmId(null);
      setFilteredCategoryList([]);

      setSelectedCategoryId(null);
      setFilteredProducts([]);
    }
  };

  useEffect(() => {
    fetchData();

    if (FirmData) {
      setFirmList(FirmData.data);
    }

    if (CatgeoryData) {
      setCategoryList(CatgeoryData.data);
    }
  }, []);

  useEffect(() => {
    if (selectedFirmId) {
      const filteredCategories = categoryList.filter(
        (category) => category.firm?.id === selectedFirmId
      );
      setFilteredCategoryList(filteredCategories);
      setSelectedCategoryId(null);

      const filtered = productsData.filter(
        (product) => product.firm.id === selectedFirmId
      );
      setFilteredProducts(filtered);
    } else {
      setSelectedCategoryId(null);
      setFilteredCategoryList([]);

      setFilteredProducts(productsData);
    }
  }, [selectedFirmId, categoryList, productsData]);

  useEffect(() => {
    if (selectedFirmId && selectedCategoryId) {
      const filtered = productsData.filter(
        (product) =>
          product.firm.id === selectedFirmId &&
          product.category.id === selectedCategoryId
      );
      setFilteredProducts(filtered);
    } else if (!selectedFirmId) {
      setSelectedCategoryId(null);
      setFilteredCategoryList([]);

      setFilteredProducts(productsData);
    } else {
      const filteredFirm = productsData.filter(
        (product) => product.firm.id === selectedFirmId
      );
      setFilteredProducts(filteredFirm);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    const filtered = productsData.filter(
      (product) =>
        product.skuCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.hsnCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, productsData]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      {/* <Navbar />
      <Sidebar /> */}
      <Box
        sx={{
          height: "100vh",
          // bgcolor: "#f1f1f1",
          display: "flex",
          flexGrow: 1,
          px: 3,
          pl: "6em",
          overflowY: "auto",
        }}
      >
        <Grid container spacing={2} sx={{ backgroundColor: "", mt: 8 }}>
          {/* <Grid item xs={12} md={12} lg={12} sx={{ backgroundColor: "blue" }}>
            <Box
              sx={{
                // display: "flex",

                borderRadius: "5px",
                border: "2px solid black",

                flexDirection: "column",

                flexGrow: 1,
                height: "15vh",
                backgroundColor: "green",
              }}
            ></Box>
          </Grid> */}

          <Grid item xs={12} md={12} lg={12} sx={{ backgroundColor: "" }}>
            <Box
              sx={{
                display: "flex",

                borderRadius: "5px",
                // border: "2px solid black",

                flexDirection: "column",

                flexGrow: 1,
                height: "15vh",
                backgroundColor: "",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "",
                }}
              >
                <HeadingComponent
                  title={title}
                  breadcrumbs={breadcrumbs}
                  links={links}
                />

                <Box
                  sx={{
                    gap: 3,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      width: "15vw",
                      height: "53px",
                      backgroundColor: "",
                      // border: "2px solid #32577e",
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="Search"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      // InputLabelProps={{ shrink: true }}
                      sx={{
                        "& fieldset": {
                          borderRadius: "50px",
                          // border: "2px solid transparent", // Initially transparent border
                          transition: "border-color 0.3s", // Smooth transition for border color change
                        },
                        "&:focus-within fieldset": {
                          border: "2px solid #32577e", // Border color on focus
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <>
                            <IconButton aria-label="search" edge="end">
                              <SearchIcon />
                            </IconButton>
                          </>
                        ),
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    sx={{
                      // marginLeft: 5,
                      borderRadius: "50px",
                      height: "52px",
                      px: 6,
                      backgroundColor: "#32577e",
                      gap: 1,

                      "&:hover": {
                        backgroundColor: "#2a3478", // Change background color on hover
                      },
                    }}
                    onClick={() => navigate("/addproduct")}
                  >
                    <Typography>Add Product</Typography>
                    <AddCircleOutlineIcon />
                  </Button>
                </Box>
              </Box>
              <Grid container sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                      // justifyContent: "space-between",

                      backgroundColor: "",
                    }}
                  >
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={Array.isArray(firmList) ? firmList : []}
                      getOptionLabel={(option) => option.firmName}
                      // onChange={(event, value) =>
                      //   setSelectedFirmId(value ? value.id : null)
                      // }
                      onChange={handleFirmChange}
                      sx={{
                        "& fieldset": {
                          // border: "none",
                          borderRadius: "10px",
                        },
                        width: "15vw",
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Firm" />
                      )}
                    />
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={filteredCategoryList}
                      // getOptionLabel={(option) =>
                      //   option.categoryName ? option.categoryName : ""
                      // }
                      // onChange={(event, value) =>
                      //   setSelectedCategoryId(value?.id)
                      // }
                      // value={selectedCategoryId}
                      getOptionLabel={(option) => option.categoryName || ""}
                      onChange={(event, value) =>
                        setSelectedCategoryId(value ? value.id : null)
                      }
                      value={
                        filteredCategoryList.find(
                          (option) => option.id === selectedCategoryId
                        ) || null
                      }
                      sx={{
                        "& fieldset": {
                          // border: "none",
                          borderRadius: "10px",
                        },
                        width: "15vw",
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Category" />
                      )}
                      renderOption={(props, option) => {
                        return (
                          <li {...props} key={option.id}>
                            {option.categoryName}
                          </li>
                        );
                      }}
                      key={(option) => option.id}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      display: "flex",
                      // justifyContent: "space-between",
                      justifyContent: "flex-end",
                      backgroundColor: "",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={Logo}
                        alt="Logo"
                        style={{
                          height: "50px",
                          cursor: "pointer",
                          // marginRight: "10px",
                          // marginBottom: "1em",
                        }}
                        onClick={exportData}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      sx={{
                        // marginLeft: 5,
                        borderRadius: "50px",
                        height: "52px",
                        px: 4,
                        backgroundColor: "#32577e",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#2a3478", // Change background color on hover
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "18px",
                          fontWeight: "bolder",
                          letterSpacing: 1,
                        }}
                      >
                        Download Template
                      </Typography>
                    </Button>

                    <Button
                      variant="contained"
                      sx={{
                        // marginLeft: 5,
                        borderRadius: "50px",
                        height: "52px",
                        px: 3,
                        backgroundColor: "#32577e",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#2a3478", // Change background color on hover
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "18px",
                          fontWeight: "bolder",
                          letterSpacing: 1,
                        }}
                      >
                        Upload Excel
                      </Typography>
                    </Button>

                    <Button
                      variant="contained"
                      sx={{
                        // marginLeft: 5,
                        borderRadius: "50px",
                        height: "52px",
                        px: 3,
                        backgroundColor: "#32577e",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#2a3478", // Change background color on hover
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "18px",
                          fontWeight: "bolder",
                          letterSpacing: 1,
                        }}
                      >
                        Unit Conversion
                      </Typography>
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            {/* <Paper
              // elevation={2}
              sx={{
                display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                borderRadius: "5px",
                // overflowX: "hidden",
                flexDirection: "column",

                // maxWidth: isSideBarPinned
                //   ? isOpenforGridTable
                //     ? "83.5vw"
                //     : "95.5vw"
                //   : "95.5vw",
                flexGrow: 1,
                height: "70vh", //75
                backgroundColor: "",
                mt: 1,
                // border: "2px solid black",
              }}
            > */}
            <TableContainer
              component={Paper}
              style={{
                maxHeight: "70vh",
                overflowY: "auto",
                // backgroundColor: "white",
              }}
            >
              <Table
                sx={{
                  minWidth: 700,
                  "& css-1v1lz8j-MuiTable-root": {
                    borderCollapse: "none",
                  },
                }}
                aria-label="customized table"
              >
                <TableHead
                  sx={{
                    // backgroundColor: "#141b2d",
                    border: "1px solid white",
                    // fontSize: "18px",
                    // color: "white",
                    position: "sticky !important",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <TableRow>
                    <StyledTableCell
                      align="center"
                      style={{ width: "10%", backgroundColor: "#32577e" }}
                    >
                      SL.No.
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{ backgroundColor: "#32577e", width: "50px" }}
                    >
                      Firm
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{ backgroundColor: "" }}
                    >
                      Category
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{ backgroundColor: "" }}
                    >
                      SKU
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{ backgroundColor: "" }}
                    >
                      Product
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{ backgroundColor: "" }}
                    >
                      Unit
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{ backgroundColor: "" }}
                    >
                      Current Qty
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{ backgroundColor: "" }}
                    >
                      Physical Qty
                    </StyledTableCell>
                    <StyledTableCell
                      align="left"
                      style={{ backgroundColor: "" }}
                    >
                      Total Qty
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{ backgroundColor: "" }}
                    >
                      Max Samples
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{ backgroundColor: "" }}
                    >
                      HSN
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{ backgroundColor: "" }}
                    >
                      Details
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product, index) => (
                    <StyledTableRow
                      key={product.id}
                      product={product}
                      sx={{
                        borderBottom: "",
                        backgroundColor: `${
                          product.currentQuantity < product.minReorderQuantity
                            ? "#ffe6e5"
                            : "white"
                        }`,
                        // backgroundColor: "red",
                      }}

                      // component={Paper}
                    >
                      <StyledTableCell
                        // component={Paper}
                        scope="row"
                        sx={{ width: "5%" }}
                        align="center"
                      >
                        {calculateSerialNumber(index)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product?.firm?.firmName}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product?.category?.categoryName}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product?.skuCode}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product?.productName}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product?.unitName}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product?.currentQuantity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product?.physicalAvailableQuantity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product?.currentQuantity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product?.maxNoOfSamples}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product?.hsnCode}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <InfoIcon
                          sx={{ color: "rgb(88, 169, 255)", cursor: "pointer" }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "",
                float: "right",
                mt: 2,
                gap: 1,
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50px",
                  backgroundColor: "#ffe6e5",
                }}
              ></div>
              <Typography>Less than Minimum Qty</Typography>
            </Box>
            {/* </Paper> */}
          </Grid>
        </Grid>

        <div>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
            open={open}
            onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </Box>
    </>
  );
};

export default StockList;
