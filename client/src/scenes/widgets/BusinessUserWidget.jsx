import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, Button } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Customer from "components/Customer";

const BusinessUserWidget = ({ businessId, picturePath }) => {
  const [business, setBusiness] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getBusiness = async () => {
    const response = await fetch(`http://localhost:3001/businesses/${businessId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setBusiness(data);
  };

  useEffect(() => {
    getBusiness();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!business) {
    return null;
  }

  const {
    businessName,
    businessReg,
    oniline
  } = business;

  return (
    <WidgetWrapper>
      {/* PROFILE */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${businessId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {businessName}
            </Typography>
            <Typography color={medium}>{businessReg}</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Customers Queueing</Typography>
          <Typography color={main} fontWeight="500">
            133
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* QUEUING FOR */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Serving
        </Typography>
        {/* Get data of Current Queue */}
        <Customer
          customerId={'657df0879c20786d64563391'}
          name={'Jean Dough'}
          subtitle={'20/12/2023'}
          queueNum={'27'}
          userPicturePath={"biboosmile.webp"}
        />
      </Box>

      <Divider />

      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Button variant="text">Text</Button>
          <Button variant="text">Next</Button>
        </FlexBetween>
      </Box>

    </WidgetWrapper>
  );
};

export default BusinessUserWidget;
