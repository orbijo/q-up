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
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { setQueue, setQueues } from 'state';
import io from "socket.io-client";
import { debounce } from "lodash";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
});

const UserWidget = ({ userId, picturePath }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDia, setOpenDia] = useState(true);
  const [turn, setTurn] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClickOpenDia = () => setOpenDia(true);
  const handleCloseDia = () => setOpenDia(false);
  const handleTurn = () => setTurn(true);
  const endTurn = () => setTurn(false);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const queue = useSelector((state) => state.queue);
  const queues = useSelector((state) => state.queues);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;

  const socketRef = useRef();

  const getBusinessQueues = async () => {
    if (queue) {
      const businessId = queue.businessId._id;
      const response = await fetch(`http://localhost:3001/queues/business/${businessId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setQueues({ queues: data }));
    } else {
      console.error("Queue is null");
    }
  }

  const getUserQueue = async () => {
    const response = await fetch(`http://localhost:3001/queues/user/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setQueue({ queue: data }));
    checkQueue()
  };

  const checkQueue = () => {
    if (queue !== null && queues !== null) {
      if (queue.queueNumber === queues[0].queueNumber) {
        handleTurn()
      }
      else {
        endTurn()
      }
    }
  }

  const debouncedGetBusinessQueues = debounce(getBusinessQueues, 1000)
  const debouncedGetUserQueue = debounce(getUserQueue, 1000)

  useEffect(() => {
    getUser()
    getUserQueue()
  }, [])

  useEffect(() => {
    debouncedGetBusinessQueues()
    debouncedGetUserQueue()
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      console.log(`Socket connected UserWidget: ${socket.id}`);
    });

    socketRef.current = socket;

    // Listen for 'queueUpdated' events from the server
    socket.on('queueUpdated', (updatedQueue) => {
      console.log("'queueUpdated' event received");
      dispatch(setQueue({ queue: updatedQueue }));
    });

    // Cleanup the socket listener on component unmount
    return () => {
      // Clean up the socket connection when the component unmounts
      socket.close();
    };
  }, [queue, queues]); // eslint-disable-line react-hooks/exhaustive-deps

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  const cancelQueue = async () => {
    try {
      const response = await fetch(`http://localhost:3001/queues/${queue._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        // Queue successfully canceled
        dispatch(setQueue({ queue: null })); // Clear the queue
        socketRef.current.emit('updateQueue', data, () => {
          console.log('updateQueue event emitted');
        });
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
                {queues && queues.length > 0 ? queues[0].queueNumber : 'NaN'}
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
      {queue !== null ? (
        <Dialog
          open={turn&&openDia}
          TransitionComponent={Transition}
          keepMounted
          onClose={endTurn}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>It is now your turn</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Please wait for {queue != null ? queue.businessId.businessName : 'NaN'} to complete your transaction
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDia}>OK</Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog
          open={turn&&openDia}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDia}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Queue Complete</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Your queue has been completed.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDia}>OK</Button>
          </DialogActions>
        </Dialog>
      )}

    </WidgetWrapper>
  );
};

export default UserWidget;
