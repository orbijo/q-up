import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBusinesses } from "state";
import BusinessWidget from "./BusinessWidget";
import SearchBusinessWidget from "./SearchBusinessWidget";


const BusinessesWidget = ({ userId }) => {
    const dispatch = useDispatch();
    const businesses = useSelector((state) => state.businesses);
    const token = useSelector((state) => state.token);

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

    console.log(businesses)

    return (
        <>
        {/* Stylize this input */}
            {businesses.map(
                ({
                    _id,
                    businessName,
                    picturePath,
                    businessReg,
                    online,
                }) => (
                    <BusinessWidget
                        key={_id}
                        businessId={_id}
                        name={businessName}
                        businessPicturePath={picturePath}
                        status={online}
                    />
                )
            )}
        </>
    );
};

export default BusinessesWidget;
