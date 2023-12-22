import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, Button } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Customer from "components/Customer";
import { setQueues } from "state";
import { debounce } from 'lodash';
import io from 'socket.io-client';



const BusinessUserWidget = ({ businessId, picturePath }) => {
  
  const dispatch = useDispatch();
  const [business, setBusiness] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const queues = useSelector((state) => state.queues);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();

  const socket = io('http://localhost:3001');

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1000);
    }
  };

  const getBusiness = async () => {
    const response = await fetch(`http://localhost:3001/businesses/${businessId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setBusiness(data);
  };

  const getBusinessQueues = async () => {
    const response = await fetch(`http://localhost:3001/queues/business/${businessId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setQueues({ queues: data }));
  }

  const getNextQueue = async (queueId) => {
    try {
     handleButtonClick(); // Initiate loading state
   
     const response = await fetch(`http://localhost:3001/queues/${queueId}`, {
       method: "DELETE",
       headers: { Authorization: `Bearer ${token}` },
     });
   
     // Wait for a minimum of 1 second
     const delay = new Promise(resolve => setTimeout(resolve, 1000));
     await delay;
   
     if (response.ok) {
       // Queue successfully canceled
       dispatch(setQueues({ queues: queues.slice(1) }));
   
       // Establish a socket connection and emit 'queueUpdate' event
       const socket = io('http://localhost:3001');
       socket.emit('updateQueue', { _id: queueId });
       
     } else {
       // Handle error, show a message or log it
       console.error("Failed to update queue");
     }
    } catch (error) {
     // Handle fetch error
     console.error("Fetch error:", error);
    } finally {
     // Ensure loading state is reset after the response
     setLoading(false);
    }
   };

  const debouncedGetBusinessQueues = debounce(getBusinessQueues, 1000);

  useEffect(() => {
    getBusiness();
    debouncedGetBusinessQueues();

    socket.on('updateQueue', (data) => {
      console.log(`Data: ${data}`)
    });

  }, [queues]); // eslint-disable-line react-hooks/exhaustive-deps

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
            {queues && queues.length > 0 ? queues.length : 0}
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
        {
          queues && queues.length > 0 ? (
            <Customer
              customerId={queues[0]._id}
              name={`${queues[0].userId.firstName} ${queues[0].userId.lastName}`}
              subtitle={queues[0].createdAt}
              queueNum={queues[0].queueNumber}
              userPicturePath={queues[0].userId.picturePath}
            />
          ) : (
            <>
              <FlexBetween gap="1rem" mb="0.5rem">
                <FlexBetween gap="1rem">
                  <PersonOffIcon />
                  <Box>
                    <Typography color={main} fontWeight="500">
                      No customers for now...
                    </Typography>
                  </Box>
                </FlexBetween>
              </FlexBetween>
            </>
          )
        }
      </Box>

      <Divider />

      {
        queues && queues.length > 0 ? (
          <Box position="relative" p="1rem 0">
            <FlexBetween mb="0.5rem">
              <></>
              <Button
                variant="text"
                disabled={loading}
                onClick={(() => getNextQueue(queues[0]._id))}
              >
                {loading ? <CircularProgress size={24} color="primary" /> : 'Next'}

              </Button>
              {loading && (
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                >
                </Box>
              )}
            </FlexBetween>
          </Box>
        ) : (
          <Box p="1rem 0">
            <FlexBetween mb="0.5rem">
              <Button variant="text">Text</Button>
              <Button disabled={true} variant="text">Next</Button>
            </FlexBetween>
          </Box>
        )
      }

    </WidgetWrapper>
  );
};

export default BusinessUserWidget;
