import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setQueue } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useState } from "react";

const Business = ({ businessId, name, businessPicturePath, status }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { _id } = useSelector((state) => state.user); //modify
    const token = useSelector((state) => state.token);
    const { queue } = useSelector((state) => state.queue)

    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    const queueUp = async (userId, businessId, token) => {
        try {
          const response = await fetch(
            `http://localhost:3001/queues/${businessId}/${userId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          dispatch(setQueue({ queue: data }));
        } catch (error) {
          console.error("Error queuing up:", error.message);
        }
      };

    return (
        <FlexBetween>
            <FlexBetween gap="1rem">
                <UserImage image={businessPicturePath} size="55px" />
                <Box
                    onClick={() => {
                        navigate(`/profile/${businessId}`);
                        navigate(0);
                    }}
                >
                    <Typography
                        color={main}
                        variant="h5"
                        fontWeight="500"
                        sx={{
                            "&:hover": {
                                color: palette.primary.light,
                                cursor: "pointer",
                            },
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography color={medium} fontSize="0.75rem">
                        {status}
                    </Typography>
                </Box>
            </FlexBetween>
            <IconButton
                onClick={() => queueUp()}
                sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
                <PersonRemoveOutlined sx={{ color: primaryDark }} />
            </IconButton>
        </FlexBetween>
    );
};

export default Business;