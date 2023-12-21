import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Business from "components/Business";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQueue } from "state";

const BusinessWidget = ({
    businessId,
    name,
    businessPicturePath,
    status,
}) => {
    const token = useSelector((state) => state.token);

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

    return (
        <WidgetWrapper m="2rem 0" style={{ padding: '1.25rem' }}>
            <Business
                businessId={businessId}
                name={name}
                businessPicturePath={businessPicturePath}
                status={status}
            />
        </WidgetWrapper>
    );
};

export default BusinessWidget;