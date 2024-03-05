import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Autocomplete,
  InputLabel,
  Button,
  Stack,
  Card,
  CardContent,
} from "@mui/material";

import Checkbox from "@mui/material/Checkbox";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import axios from "axios";

import "jspdf-autotable";

import { FormControlLabel } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FirmData from "../data/FirmData";

import "../css/AddProduct.css";
//loader
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeadingComponent from "./commonComponents/HeadingComponent";
import { AddProductAction } from "../actions/AddProductAction";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CatgeoryData from "../data/CategoryData";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const AddProduct = () => {
  //snackbar

  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSuccessSnackbarClose = () => {
    setSuccessSnackbarOpen(false);
  };

  const isSideBarPinned = false;
  const isOpenforGridTable = false;
  // const breadcrumbs = [{ name: "Dashboard", path: "/" }];

  const [showDetails, setShowDetails] = useState(false);
  const [firmList, setFirmList] = useState([]);
  const [selectedFirmId, setSelectedFirmId] = useState("");

  //categorylist

  const [categoryList, setCategoryList] = useState([]);

  const [filteredCategoryList, setFilteredCategoryList] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [unitList, setUnitList] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");

  const numberRegex = "^[0-9]+$";

  //headingcomponent
  const title = "Add Product";
  const breadcrumbs = ["Add Product"];
  const links = [
    // { label: "Home", url: "/" },
    { label: "Stock Mangement", url: "/stocklist" },

    // { label: "Link 2", url: "/link2" },
    // Add more links as needed
  ];

  const [values, setValues] = useState({
    firm: null,
    category: null,
    sku: "",
    productName: "",
    unit: null,
    image: "",
    openingQty: "",
    hsn: "",
    minReorderQty: "",
    allowOrderTillQty: "",
    blockStock: null,
    minSellingPrice: "",
    standardSellingPrice: "",
    maxSamples: "",
    allowOrderWithoutStock: null,
  });

  const [errors, setErrors] = useState({
    firm: null,
    category: null,
    sku: "",
    productName: "",
    unit: null,

    openingQty: "",
    hsn: "",
    minReorderQty: "",
    allowOrderTillQty: "",
    blockStock: null,
    minSellingPrice: "",
    standardSellingPrice: "",
    maxSamples: "",
    allowOrderWithoutStock: null,
  });

  const toggleShowDetails = () => {
    setShowDetails((prev) => !prev);
  };

  const handleRadioChange = (event) => {
    const newValue = event.target.value === "yes" ? true : false;
    setValues({
      ...values,
      blockStock: newValue,
    });
  };

  const handleCheckboxChange = (event) => {
    const newValue = event.target.checked;
    setValues({
      ...values,
      allowOrderWithoutStock: newValue,
    });
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#32577e",
      color: theme.palette.common.white,
      width: "20%",
      fontSize: "18px",
      fontWeight: "bolder",
      color: "rgb(255, 255, 255)",
      // borderRadius: "15px",
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
      backgroundColor: "rgb(255, 255, 255)",
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
      borderBottom: "1px solid rgb(224, 224, 224)",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    height: "80px",
    "&:not(:last-child)": {
      borderBottom: "1px solid #ccc", // Add border to all rows except the last one
      boxShadow: "0px 4px 4px -2px rgba(0, 0, 0, 0.1)", // Box shadow at the bottom
    },
    // "&:nth-of-type(odd)": {
    //   backgroundColor: theme.palette.action.hover,
    // },
    // "&:last-child td, &:last-child th": {
    //   border: 0,
    // },
    // borderBottom: "7px solid rgba(214, 242, 251, 0.30)",
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

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  ];

  const [imageUploaded, setImageUploaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleAttachIconClick = () => {
    fileInputRef.current.click();
  };

  // const handleFileInputChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setFileName(file.name);
  //   } else {
  //     setFileName("");
  //   }
  // };

  const handleDiscardImage = () => {
    setImageUploaded(false);
    setUploadedImage(null);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFileName(file.name);
      setUploadedImage(URL.createObjectURL(file));
      setImageUploaded(true);

      setValues({
        ...values,
        image: uploadedImage,
      });
      setSuccessSnackbarOpen(true);
    }
  };

  const fetchUnit = async () => {
    try {
      const response = await axios.get(
        "https://sfaordersstaging.nyggs.com/backend/api/get/company/units?companyId=17"
      );
      if (response.data.responseCode === 200) {
        setUnitList(response.data.data);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  //save product

  const saveProduct = async (e) => {
    e.preventDefault();

    if (!selectedFirmId) {
      setSnackbarMessage("Firm is required.");
      setOpenSnackbar(true);
      return;
    }
    if (!values.sku) {
      setSnackbarMessage("SKU is required.");
      setOpenSnackbar(true);
      return;
    }
    if (!values.productName) {
      setSnackbarMessage("Product Name is required.");
      setOpenSnackbar(true);
      return;
    }
    if (!selectedUnit) {
      setSnackbarMessage("Unit is required.");
      setOpenSnackbar(true);
      return;
    }

    if (!values.openingQty) {
      setSnackbarMessage("Opening Oty is required.");
      setOpenSnackbar(true);
      return;
    }
    if (!values.hsn) {
      setSnackbarMessage("Hsn is required.");
      setOpenSnackbar(true);
      return;
    }
    if (!values.minReorderQty) {
      setSnackbarMessage("MinReorderQty is required.");
      setOpenSnackbar(true);
      return;
    }
    if (!values.standardSellingPrice) {
      setSnackbarMessage("Standard Selling Price is required.");
      setOpenSnackbar(true);
      return;
    }

    if (Number(values.allowOrderTillQty) > Number(values.minReorderQty)) {
      setSnackbarMessage(
        "AllowOrderTillQty cannot be greater than MinReorderQty"
      );
      setOpenSnackbar(true);
      return;
    }

    if (Number(values.standardSellingPrice) < Number(values.minSellingPrice)) {
      setSnackbarMessage(
        "Standarad Selling Price cannot be greater than Min Selling Price"
      );
      setOpenSnackbar(true);
      return;
    } else {
      try {
        const payload = {
          companyId: 17,
          allowOrderTillQuantity: values.allowOrderTillQty,
          blockStockOnOrderCreate: values.blockStock,
          hsnCode: values.hsn,
          image: fileName,
          minReOrderQuantity: values.minReorderQty,
          name: values.productName,
          openingQuantity: values.openingQty,
          sku: values.sku,
          unit: selectedUnit,
          standardSellingPrice: values.standardSellingPrice,
          minSellingPrice: values.minSellingPrice,
          createdBy: 1993,
          createdUserName: "REDMI",
          isDetails: false,
          templateHeaderDetails: null,
          productCatagory: {
            id: selectedCategoryId,
          },
          firm: {
            id: selectedFirmId,
          },
          maxNoOfSamples: values.maxSamples,
          allowOrderWithoutStock: values.allowOrderWithoutStock,
        };

        const response = await AddProductAction.AddProduct(payload);

        if (response.data.responseCode === 200) {
          toast("Saved succesfully");
        } else {
          alert(response.data.error);
        }
      } catch (error) {
        console.log(error);
      }
    }

    // }
  };

  useEffect(() => {
    fetchUnit();
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
    } else {
      setSelectedCategoryId(null);
      setFilteredCategoryList([]);
    }
  }, [selectedFirmId, categoryList]);

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
          {/* <Grid item xs={12} md={12} lg={12} sx={{ backgroundColor: "" }}>
            <Box
              sx={{
                // display: "flex",

                borderRadius: "5px",
                border: "2px solid black",

                flexDirection: "column",

                flexGrow: 1,
                height: "10vh",
                backgroundColor: "",
              }}
            ></Box>
          </Grid> */}

          <Grid item xs={12} md={12} lg={12} sx={{ backgroundColor: "" }}>
            <Box
              sx={{
                // display: "flex",

                borderRadius: "5px",

                flexDirection: "column",

                flexGrow: 1,
                height: "10vh",
                backgroundColor: "",
              }}
            >
              {/* <Typography sx={{ fontSize: "1.5em" }}>Add Product</Typography> */}
              <HeadingComponent
                title={title}
                breadcrumbs={breadcrumbs}
                links={links}
              />
            </Box>
            <Paper
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
                height: "47vh", //75
                backgroundColor: "",
                mt: 1,
                border: "1px solid rgb(204, 204, 204)",
                // border: "2px solid black",
              }}
            >
              <Grid container>
                <Grid item xs={10} sx={{ backgroundColor: "" }}>
                  <Grid container spacing={3} sx={{ px: 3, pl: "2em", pt: 4 }}>
                    <Grid item xs={3}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Array.isArray(firmList) ? firmList : []}
                        getOptionLabel={(option) => option.firmName}
                        onChange={(event, value) =>
                          setSelectedFirmId(value ? value.id : null)
                        }
                        sx={{
                          width: "17vw",
                          "& fieldset": {
                            borderRadius: "10px",

                            // border: "2px solid transparent", // Initially transparent border
                            transition: "border-color 0.3s", // Smooth transition for border color change
                          },
                          "&:focus-within fieldset": {
                            border: "2px solid #32577e", // Border color on focus
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Firm"
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              fontSize: "1.2rem", // Adjust the font size as needed
                              color: "rgba(0, 0, 0, 0.6)",
                              fontWeight: "bold",
                            }}
                            required
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={filteredCategoryList}
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
                          width: "17vw",
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label=" Category"
                            InputLabelProps={{ shrink: true }}
                          />
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
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        id="outlined-basic"
                        label="SKU"
                        required
                        InputLabelProps={{ shrink: true }}
                        value={values.sku}
                        onChange={(e) => {
                          setValues({ ...values, sku: e.target.value });
                        }}
                        sx={{
                          width: "17vw",
                          "& fieldset": {
                            borderRadius: "10px",
                            // border: "2px solid transparent",
                            transition: "border-color 0.3s",
                          },
                          "&:focus-within fieldset": {
                            border: "2px solid #32577e",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        id="outlined-basic"
                        label="Product Name"
                        required
                        InputLabelProps={{ shrink: true }}
                        value={values.productName}
                        onChange={(e) => {
                          setValues({ ...values, productName: e.target.value });
                        }}
                        sx={{
                          width: "17vw",
                          "& fieldset": {
                            borderRadius: "10px",

                            // border: "2px solid transparent",
                            transition: "border-color 0.3s",
                          },
                          "&:focus-within fieldset": {
                            border: "2px solid #32577e",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Array.isArray(unitList) ? unitList : []}
                        getOptionLabel={(option) => option.unitName}
                        onChange={(event, value) =>
                          setSelectedUnit(value ? value.id : null)
                        }
                        sx={{
                          width: "17vw",
                          "& fieldset": {
                            borderRadius: "10px",

                            // border: "2px solid transparent",
                            transition: "border-color 0.3s",
                          },
                          "&:focus-within fieldset": {
                            border: "2px solid #32577e",
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Unit"
                            InputLabelProps={{ shrink: true }}
                            required
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        id="outlined-basic"
                        label="Opening Qty"
                        required
                        InputLabelProps={{ shrink: true }}
                        value={values.openingQty}
                        onChange={(e) => {
                          // setValues({ ...values, openingQty: e.target.value });
                          let value = e.target.value.replace(/\D/g, "");

                          setValues({ ...values, openingQty: value });
                        }}
                        sx={{
                          width: "17vw",
                          "& fieldset": {
                            borderRadius: "10px",

                            // border: "2px solid transparent",
                            transition: "border-color 0.3s",
                          },
                          "&:focus-within fieldset": {
                            border: "2px solid #32577e",
                          },
                        }}
                        inputProps={{
                          inputMode: "numeric",
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        id="outlined-basic"
                        label="HSN"
                        required
                        InputLabelProps={{ shrink: true }}
                        value={values.hsn}
                        onChange={(e) => {
                          setValues({ ...values, hsn: e.target.value });
                        }}
                        sx={{
                          width: "17vw",
                          "& fieldset": {
                            borderRadius: "10px",

                            // border: "2px solid transparent",
                            transition: "border-color 0.3s",
                          },
                          "&:focus-within fieldset": {
                            border: "2px solid #32577e",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        id="outlined-basic"
                        label="Min Reorder Qty"
                        required
                        InputLabelProps={{ shrink: true }}
                        value={values.minReorderQty}
                        onChange={(e) => {
                          // setValues({ ...values, openingQty: e.target.value });
                          let value = e.target.value.replace(/\D/g, "");

                          setValues({ ...values, minReorderQty: value });
                        }}
                        // onBlur={() => {
                        //   let trimmedValue = values.minReorderQty.trim();
                        //   setValues({ ...values, minReorderQty: trimmedValue });
                        //   if (!values.minReorderQty.trim()) {
                        //     setErrors({
                        //       ...errors,
                        //       minReorderQty: "Opening quantity is required",
                        //     });
                        //   } else if (!/^[0-9]+$/.test(values.minReorderQty)) {
                        //     setErrors({
                        //       ...errors,
                        //       openingQty: "Invalid opening quantity",
                        //     });
                        //   } else {
                        //     setErrors({ ...errors, minReorderQty: "" });
                        //   }
                        // }}
                        // error={Boolean(errors.minReorderQty)}
                        // helperText={errors.minReorderQty}
                        sx={{
                          width: "17vw",
                          "& fieldset": {
                            borderRadius: "10px",

                            // border: "2px solid transparent", // Initially transparent border
                            transition: "border-color 0.3s", // Smooth transition for border color change
                          },
                          "&:focus-within fieldset": {
                            border: "2px solid #32577e", // Border color on focus
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        id="outlined-basic"
                        label="Allow Order Till Qty"
                        InputLabelProps={{ shrink: true }}
                        value={values.allowOrderTillQty}
                        onChange={(e) => {
                          // setValues({ ...values, openingQty: e.target.value });
                          let value = e.target.value.replace(/\D/g, "");

                          setValues({ ...values, allowOrderTillQty: value });
                        }}
                        // onBlur={() => {
                        //   let trimmedValue = values.allowOrderTillQty.trim();
                        //   setValues({
                        //     ...values,
                        //     allowOrderTillQty: trimmedValue,
                        //   });
                        //   if (!/^[0-9]+$/.test(values.allowOrderTillQty)) {
                        //     setErrors({
                        //       ...errors,
                        //       allowOrderTillQty: "Invalid opening quantity",
                        //     });
                        //   } else {
                        //     setErrors({ ...errors, allowOrderTillQty: "" });
                        //   }
                        // }}
                        // error={Boolean(errors.allowOrderTillQty)}
                        // helperText={errors.allowOrderTillQty}
                        sx={{
                          width: "17vw",
                          "& fieldset": {
                            borderRadius: "10px",

                            // border: "2px solid transparent", // Initially transparent border
                            transition: "border-color 0.3s", // Smooth transition for border color change
                          },
                          "&:focus-within fieldset": {
                            border: "2px solid #32577e", // Border color on focus
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <Box
                        sx={{
                          backgroundColor: "",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "17px", fontWeight: "bolder" }}
                        >
                          Block Stock On Order Created
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          value={values.blockStock ? "yes" : "no"} // Set the value based on state
                          onChange={handleRadioChange}
                        >
                          <FormControlLabel
                            value="yes"
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        id="outlined-basic"
                        label="Min Selling Price"
                        InputLabelProps={{ shrink: true }}
                        value={values.minSellingPrice}
                        onChange={(e) => {
                          // setValues({ ...values, openingQty: e.target.value });
                          let value = e.target.value.replace(/\D/g, "");

                          setValues({ ...values, minSellingPrice: value });
                        }}
                        // onBlur={() => {
                        //   let trimmedValue = values.minSellingPrice.trim();
                        //   setValues({
                        //     ...values,
                        //     minSellingPrice: trimmedValue,
                        //   });
                        //   if (!/^[0-9]+$/.test(values.minSellingPrice)) {
                        //     setErrors({
                        //       ...errors,
                        //       minSellingPrice: "Invalid opening quantity",
                        //     });
                        //   } else {
                        //     setErrors({ ...errors, minSellingPrice: "" });
                        //   }
                        // }}
                        // error={Boolean(errors.minSellingPrice)}
                        // helperText={errors.minSellingPrice}
                        sx={{
                          width: "17vw",
                          "& fieldset": {
                            borderRadius: "10px",

                            // border: "2px solid transparent", // Initially transparent border
                            transition: "border-color 0.3s", // Smooth transition for border color change
                          },
                          "&:focus-within fieldset": {
                            border: "2px solid #32577e", // Border color on focus
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        id="outlined-basic"
                        label="Standard Selling Price"
                        required
                        InputLabelProps={{ shrink: true }}
                        value={values.standardSellingPrice}
                        onChange={(e) => {
                          // setValues({ ...values, openingQty: e.target.value });
                          let value = e.target.value.replace(/\D/g, "");

                          setValues({ ...values, standardSellingPrice: value });
                        }}
                        // onBlur={() => {
                        //   let trimmedValue = values.standardSellingPrice.trim();
                        //   setValues({
                        //     ...values,
                        //     standardSellingPrice: trimmedValue,
                        //   });
                        //   if (!values.standardSellingPrice.trim()) {
                        //     setErrors({
                        //       ...errors,
                        //       standardSellingPrice:
                        //         "Opening quantity is required",
                        //     });
                        //   } else if (
                        //     !/^[0-9]+$/.test(values.standardSellingPrice)
                        //   ) {
                        //     setErrors({
                        //       ...errors,
                        //       openingQty: "Invalid opening quantity",
                        //     });
                        //   } else {
                        //     setErrors({ ...errors, standardSellingPrice: "" });
                        //   }
                        // }}
                        // error={Boolean(errors.standardSellingPrice)}
                        // helperText={errors.standardSellingPrice}
                        sx={{
                          width: "17vw",
                          "& fieldset": {
                            borderRadius: "10px",

                            // border: "2px solid transparent", // Initially transparent border
                            transition: "border-color 0.3s", // Smooth transition for border color change
                          },
                          "&:focus-within fieldset": {
                            border: "2px solid #32577e", // Border color on focus
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        id="outlined-basic"
                        label="Max Samples"
                        InputLabelProps={{ shrink: true }}
                        value={values.maxSamples}
                        onChange={(e) => {
                          // setValues({ ...values, openingQty: e.target.value });
                          let value = e.target.value.replace(/\D/g, "");

                          setValues({ ...values, maxSamples: value });
                        }}
                        // onBlur={() => {
                        //   let trimmedValue = values.maxSamples.trim();
                        //   setValues({
                        //     ...values,
                        //     maxSamples: trimmedValue,
                        //   });
                        //   if (!/^[0-9]+$/.test(values.maxSamples)) {
                        //     setErrors({
                        //       ...errors,
                        //       maxSamples: "Invalid opening quantity",
                        //     });
                        //   } else {
                        //     setErrors({ ...errors, maxSamples: "" });
                        //   }
                        // }}
                        // error={Boolean(errors.maxSamples)}
                        // helperText={errors.maxSamples}
                        sx={{
                          width: "17vw",
                          "& fieldset": {
                            borderRadius: "10px",

                            // border: "2px solid transparent", // Initially transparent border
                            transition: "border-color 0.3s", // Smooth transition for border color change
                          },
                          "&:focus-within fieldset": {
                            border: "2px solid #32577e", // Border color on focus
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Checkbox
                        {...label}
                        // value={isDashboardChecked}
                        // defaultChecked={isDashboardChecked}
                        // onChange={handleDashboardCheckboxChange}
                        checked={values.allowOrderWithoutStock} // Set the checked status based on state
                        onChange={handleCheckboxChange}
                      />
                      <span style={{ color: "black", fontWeight: "bolder" }}>
                        Allow Order Without Stock
                      </span>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={2} sx={{ backgroundColor: "" }}>
                  <Grid container>
                    <Grid item xs={6}>
                      {/* <Box sx={{ pt: 4, backgroundColor: "" }}>
                        <TextField
                          variant=""
                          sx={
                            {
                              // marginLeft: 5,
                              // borderRadius: "10px",
                              // border: "2px dotted #32577e",
                              // height: "52px",
                              // width: "14vw",
                              // px: 6,
                              // pt: 2,
                              // backgroundColor: "#32577e",
                              // gap: 1,
                            }
                          }
                        >
                          Upload Image
                        </TextField>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            // backgroundColor: "#D6F2FB",
                            border: "2px dotted #32577e",
                            width: "14vw",
                            height: "52px",

                            borderRadius: "20px",
                            px: 6,
                            py: 4,
                            gap: 1,
                          }}
                        >
                          <BackupOutlinedIcon
                            onClick={handleAttachIconClick}
                            style={{
                              cursor: "pointer",
                              color: "#32577e",
                            }}
                          />
                          <InputLabel
                            htmlFor="fileInputRecommendation"
                            sx={{ display: "flex", flexGrow: 1 }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ color: "#32577e", fontWeight: "bold" }}
                            >
                              UPLOAD IMAGE
                            </Typography>
                          </InputLabel>
                          <input
                            id="fileInput"
                            ref={fileInputRef}
                            type="file"
                            style={{
                              display: "none",
                            }}
                            onChange={handleFileInputChange}
                          />
                        </Box>
                        <Box>image</Box>
                      </Box> */}

                      <Box sx={{ pt: 4, backgroundColor: "" }}>
                        {!imageUploaded && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              border: "2px dotted #32577e",
                              width: "14vw",
                              height: "52px",
                              borderRadius: "20px",
                              px: 6,
                              py: 4,
                              gap: 1,
                              cursor: "pointer",
                            }}
                            onClick={handleAttachIconClick}
                          >
                            <BackupOutlinedIcon
                              // onClick={handleAttachIconClick}
                              style={{
                                cursor: "pointer",
                                color: "#32577e",
                              }}
                            />
                            <InputLabel htmlFor="fileInputRecommendation">
                              <Typography
                                variant="body1"
                                sx={{
                                  color: "#32577e",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                }}
                              >
                                UPLOAD IMAGE
                              </Typography>
                            </InputLabel>
                            <input
                              id="fileInput"
                              ref={fileInputRef}
                              type="file"
                              style={{
                                display: "none",
                              }}
                              onChange={handleFileInputChange}
                            />
                          </Box>
                        )}
                        {/* {imageUploaded && (
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ color: "#32577e", fontWeight: "" }}
                            >
                              Uploaded Image
                            </Typography>
                            <img
                              src={uploadedImage}
                              alt="Uploaded"
                              style={{ width: "13vw", height: "25vh" }}
                            />
                          </Box>
                        )} */}
                        {imageUploaded && (
                          <Box>
                            <Box
                              sx={{
                                position: "relative",
                                display: "inline-block",
                              }}
                            >
                              <CloseOutlinedIcon
                                onClick={handleDiscardImage}
                                style={{
                                  cursor: "pointer",
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  backgroundColor: "#ffffff",
                                  borderRadius: "50%",
                                }}
                              />
                              <Typography
                                variant="body1"
                                sx={{
                                  color: "#32577e",
                                  fontWeight: "",
                                  fontSize: "17px",
                                }}
                              >
                                Uploaded Image
                              </Typography>
                              <a
                                href={uploadedImage}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={uploadedImage}
                                  alt="Uploaded"
                                  style={{ width: "13vw", height: "25vh" }}
                                />
                              </a>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Box
                sx={{
                  mt: 2,
                  pl: "1.5em",
                  pr: "1.5em",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Checkbox
                    {...label}
                    checked={showDetails}
                    onChange={toggleShowDetails}
                    // value={isDashboardChecked}
                    // defaultChecked={isDashboardChecked}
                    // onChange={handleDashboardCheckboxChange}
                  />
                  <span style={{ color: "black", fontWeight: "bolder" }}>
                    If Need Detail
                  </span>
                </Box>

                <Box sx={{ backgroundColor: "", gap: 2 }}>
                  <Button
                    variant=""
                    sx={{
                      // marginLeft: 5,
                      border: "1px solid rgb(42, 52, 120)",
                      borderRadius: "20px",
                      height: "52px",
                      px: 8,
                      mr: 2,
                      // backgroundColor: "#32577e",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "rgb(42, 52, 120)",
                        textTransform: "none",
                        fontSize: "17px",
                        fontWeight: "bolder",
                      }}
                    >
                      Cancel
                    </Typography>
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      // marginLeft: 5,
                      borderRadius: "20px",
                      height: "52px",
                      px: 8,
                      backgroundColor: "#32577e",
                      gap: 1,
                    }}
                    onClick={(e) => saveProduct(e)}
                  >
                    <Typography
                      sx={{
                        color: "rgb(42, 52, 120)",
                        textTransform: "none",
                        fontSize: "17px",
                        fontWeight: "bolder",
                        color: "#ffff",
                      }}
                    >
                      Save
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Paper>

            {showDetails && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    // marginLeft: 5,
                    borderRadius: "20px",
                    height: "52px",
                    px: 8,
                    backgroundColor: "#32577e",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color: "rgb(42, 52, 120)",
                      textTransform: "none",
                      fontSize: "17px",
                      fontWeight: "bolder",
                      color: "#ffff",
                    }}
                  >
                    Add Detail
                  </Typography>
                </Button>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell
                          align="left"
                          style={{ width: "", backgroundColor: "#32577e" }}
                        >
                          SL.No.
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{ backgroundColor: "#32577e", width: "50px" }}
                        >
                          Title
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{ backgroundColor: "" }}
                        >
                          Is Manadatory
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{ backgroundColor: "" }}
                        >
                          Is Unique
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{ backgroundColor: "" }}
                        >
                          Action
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <StyledTableRow key={row.name}>
                          <StyledTableCell component="th" scope="row">
                            {row.calories}
                          </StyledTableCell>
                          <StyledTableCell
                            align="left"
                            sx={{ borderBottom: "1px solid #ccc" }}
                          >
                            {row.calories}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.fat}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.carbs}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.protein}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: 500 }}>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          // message="I love snacks"
          key={vertical + horizontal}
        >
          <Alert
            severity="error"
            onClose={handleCloseSnackbar}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Success Snackbar */}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={successSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleSuccessSnackbarClose}
        >
          <Alert
            onClose={handleSuccessSnackbarClose}
            severity="success"
            elevation={6}
            variant="filled"
          >
            Image uploaded successfully
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default AddProduct;
