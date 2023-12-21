import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const userRegisterSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  picture: yup.string(),
});

const businessRegisterSchema = yup.object().shape({
  businessName: yup.string().required("required"),
  businessReg: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  picture: yup.string(),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  picture: "",
  businessName: "",
  businessReg: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [userType, setUserType] = useState("user");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const isUser = userType === "user";
  const isBusiness = userType === "business"

  const registerUser = async (values, onSubmitProps) => {

    const formData = new FormData();
    for (let value in values) {
      // Skip appending the picture if it doesn't exist
      if (value === "picture" && !values.picture) {
        continue;
      }
      formData.append(value, values[value]);
    }

    // Conditionally append the picture or use the default value
    if (values.picture) {
      formData.append("picturePath", values.picture.name);
    } else {
      formData.append("picturePath", (isUser) ? "user.webp" : "company.png");
    }

    try {
      const savedUserResponse = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: formData,
      });

      const savedUser = await savedUserResponse.json();

      onSubmitProps.resetForm();

      if (savedUser) {
        setPageType("login");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const loginUser = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const registerBusiness = async (values, onSubmitProps) => {

    const formData = new FormData();
    for (let value in values) {
      // Skip appending the picture if it doesn't exist
      if (value === "picture" && !values.picture) {
        continue;
      }
      formData.append(value, values[value]);
    }

    // Conditionally append the picture or use the default value
    if (values.picture) {
      formData.append("picturePath", values.picture.name);
    } else {
      formData.append("picturePath", (isBusiness) ? "user.webp" : "company.png");
    }

    try {
      const savedUserResponse = await fetch("http://localhost:3001/auth/register/business", {
        method: "POST",
        body: formData,
      });

      const savedUser = await savedUserResponse.json();

      onSubmitProps.resetForm();

      if (savedUser) {
        setPageType("login");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const loginBusiness = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login/business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          business: loggedIn.business,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin && isUser) await loginUser(values, onSubmitProps);
    if (isRegister && isUser) await registerUser(values, onSubmitProps);
    if (isLogin && isBusiness) await loginBusiness(values, onSubmitProps);
    if (isRegister && isBusiness) await registerBusiness(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : (isUser ? userRegisterSchema : businessRegisterSchema)}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                {isUser && (
                  <>
                    <TextField
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      name="firstName"
                      error={
                        Boolean(touched.firstName) && Boolean(errors.firstName)
                      }
                      helperText={touched.firstName && errors.firstName}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      name="lastName"
                      error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      sx={{ gridColumn: "span 2" }}
                    />
                  </>
                )}
                {isBusiness && (
                  <>
                    <TextField
                      label="Business Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.businessName}
                      name="businessName"
                      error={
                        Boolean(touched.businessName) && Boolean(errors.businessName)
                      }
                      helperText={touched.businessName && errors.businessName}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      label="Registration Number"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.businessReg}
                      name="businessReg"
                      error={Boolean(touched.businessReg) && Boolean(errors.businessReg)}
                      helperText={touched.businessReg && errors.businessReg}
                      sx={{ gridColumn: "span 2" }}
                    />
                  </>
                )}
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? `LOGIN (${userType})` : `REGISTER (${userType})`}
            </Button>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <Typography
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                  marginRight: '8px', // Adjust the margin as needed
                }}
              >
                {isLogin
                  ? `Don't have an account? Sign Up here.`
                  : `Already have an account? Login here.`}
              </Typography>
              <Typography
                onClick={() => {
                  setUserType(isUser ? "business" : "user");
                  resetForm();
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                  marginRight: '8px', // Adjust the margin as needed
                }}
              >
                {isUser
                  ? (isLogin ? `Login using bussiness account instead.` : `Register using bussiness account instead.` )
                  : (isLogin ? `Login as a normal user instead.` : `Register as a normal user instead.`)}
              </Typography>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
