import {
  ManageAccountsOutlined,
} from "@mui/icons-material";
import React from 'react';
import { Box, Typography, Divider, useTheme, IconButton, Button } from "@mui/material";
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import NotInterestedOutlinedIcon from '@mui/icons-material/NotInterestedOutlined';
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { setQueue } from 'state';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
});

const UserWidget = ({ userId, picturePath }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const queue = useSelector((state) => state.queue)
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  const getUserQueue = async () => {
    const response = await fetch(`http://localhost:3001/queues/user/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setQueue({ queue: data }));
  };

  const getCurrentQueue = async () => {

  };

  const cancelQueue = async () => {
    try {
      const response = await fetch(`http://localhost:3001/queues/${queue._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.ok) {
        // Queue successfully canceled
        dispatch(setQueue({ queue: null })); // Clear the queue
        handleClose(); // Close the dialog after successful cancellation
      } else {
        // Handle error, show a message or log it
        console.error("Failed to cancel queue");
      }
    } catch (error) {
      // Handle fetch error
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    getUser();
    getUserQueue();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
  } = user;

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <WidgetWrapper>
      {/* PROFILE */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
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
              {firstName} {lastName}
            </Typography>

          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* QUEUING FOR */}
      {queue ? (
        <>
          <Box p="1rem 0">
            <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
              Currently Queuing For
            </Typography>

            {/* Get data of Current Queue */}
            <FlexBetween gap="1rem" mb="0.5rem">
              <FlexBetween gap="1rem">
                <UserImage image={queue.businessId.picturePath} size="55px" />
                <Box>
                  <Typography color={main} fontWeight="500">
                    {queue.businessId.businessName}
                  </Typography>
                </Box>
              </FlexBetween>
              <IconButton
                onClick={handleClickOpen}
                sx={{ backgroundColor: palette.error.main, p: "0.6rem" }}
              >
                <EventBusyOutlinedIcon sx={{ color: palette.background.alt }} />
              </IconButton>
            </FlexBetween>
          </Box>
          <Box>
            {/* Get data of Current Queue */}
            <FlexBetween gap="1rem" mb="0.5rem">
              <Typography color={main} fontWeight="500">
                Serving:
              </Typography>
              <Typography color="primary" fontSize="1rem" fontWeight="1000">
                {queue.queueNumber}
              </Typography>
              <Typography color={main} fontWeight="500">
                Your Number:
              </Typography>
              <Typography color="primary" fontSize="1rem" fontWeight="1000">
                {queue.queueNumber}
              </Typography>
            </FlexBetween>
          </Box>

          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{`Stop Queueing for ${queue.businessId.businessName}?`}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                If you stop queueing, you will no longer be served and your current number will be removed. If you queue again, your current number will be at the last position. Are you sure you want to remove your queue?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Continue Queuing</Button>
              <Button color="error" onClick={cancelQueue}>Stop Queueing</Button>
            </DialogActions>
          </Dialog>

        </>

      ) : (
        <>
          <Box p="1rem 0">
            <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
              Currently Queuing For
            </Typography>

            {/* Get data of Current Queue */}
            <FlexBetween gap="1rem" mb="0.5rem">
              <FlexBetween gap="1rem">
                <NotInterestedOutlinedIcon />
                <Box>
                  <Typography color={main} fontWeight="500">
                    You are not currenly queuing for anything
                  </Typography>
                </Box>
              </FlexBetween>
            </FlexBetween>
          </Box>
        </>
      )}
    </WidgetWrapper>
  );
};

export default UserWidget;
