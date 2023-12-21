import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Customer from "components/Customer";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQueue } from "state";

const QueueWidget = ({
    queueId,
    queueUserId,
    name,
    subtitle,
    userPicturePath,
    queueNum,
}) => {
    const token = useSelector((state) => state.token);

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

    return (
        <WidgetWrapper m="0 0 2rem">
            <Customer
                customerId={queueUserId}
                name={name}
                subtitle={subtitle}
                queueNum={queueNum}
                userPicturePath={userPicturePath}
            />
        </WidgetWrapper>
    );
};

export default QueueWidget;