import { Box, Typography, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import { jwtDecode } from "jwt-decode";
import BusinessUserWidget from "scenes/widgets/BusinessUserWidget";
import QueuesWidget from "scenes/widgets/QueuesWidget"
import BusinessesWidget from "scenes/widgets/BusinessesWidget";
import SearchBusinessWidget from "scenes/widgets/SearchBusinessWidget";

const HomePage = () => {
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => (state.user === null) ? state.business : state.user);
  const decodedToken = jwtDecode(token);
  const userType = decodedToken.type;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          {userType === 'user' && (
            <UserWidget userId={_id} picturePath={picturePath} />
          )}
          {userType === 'business' && (
            <BusinessUserWidget businessId={_id} picturePath={picturePath} />
          )}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >

          {userType === 'user' && (
            <>
              <SearchBusinessWidget />
              <BusinessesWidget userId={_id} />
            </>

          )}
          {userType === 'business' && (
            <QueuesWidget businessId={_id} />
          )}
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            {/* Top right */}
            <Box m="2rem 0" />
            {/* Bottom right */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
