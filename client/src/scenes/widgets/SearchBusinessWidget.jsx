import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
  } from "@mui/icons-material";
  import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
  } from "@mui/material";
  import SearchIcon from '@mui/icons-material/Search';
  import FlexBetween from "components/FlexBetween";
  import Dropzone from "react-dropzone";
  import UserImage from "components/UserImage";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setBusinesses } from "state";
  
  const SearchBusinessWidget = () => {
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    const [searchQuery, setSearchQuery] = useState("");

    const getBusinesses = async () => {
        const queryParams = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
        const response = await fetch(`http://localhost:3001/businesses/${queryParams}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setBusinesses({ businesses: data }));
      };

    useEffect(() => {
        getBusinesses();
    }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps
  
    return (
      <WidgetWrapper style={{ padding: '1.25rem' }}>
        <FlexBetween gap="1rem">
          <SearchIcon sx={{ fontSize: "1.5rem" }} />
          <InputBase
            placeholder="Which establishment are you looking for..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
          />
        </FlexBetween>
        
        <Divider sx={{ margin: "1.25rem 0" }} />

        <FlexBetween>

        <Button
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            marginLeft: 'auto',
          }}
          onClick={() => setSearchQuery('')}
        >
          CLEAR
        </Button>
      </FlexBetween>

      </WidgetWrapper>
    );
  };
  
  export default SearchBusinessWidget;
  