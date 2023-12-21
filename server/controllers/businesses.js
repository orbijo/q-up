import Business from "../models/Business.js";

/* READ */
export const getBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const business = await Business.findById(id).select('-password');
        res.status(200).json(business);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getBusinesses = async (req, res) => {
    try {
      // Retrieve the search query from the request query parameters
      const { search } = req.query;
  
      // Define the conditions for the search
      const searchConditions = search
        ? { businessName: { $regex: new RegExp(search, 'i') } }
        : {};
  
      // Fetch businesses based on the search conditions
      const businesses = await Business.find(searchConditions).select('-password');
  
      res.status(200).json(businesses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

/* UPDATE */
