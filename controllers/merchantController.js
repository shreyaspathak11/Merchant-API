const Merchant = require('../models/Merchant');
const merchant  = require('../models/Merchant');

//List all merchants
//for example: api/merchants/?searchQuery=shreyas&page=1&pageSize=10&dateFrom=2021-01-01&dateTo=2021-12-31
exports.listMerchants = async (req, res) => {       
    try {
        const {page = 1, pageSize = 10, searchQuery, dateFrom, dateTo} = req.query;
    
        const query = {};

        if (searchQuery) {
            query.$or = [       //$or operator performs a logical OR operation 
                { merchantName: { $regex: new RegExp(searchQuery, 'i') } },     //regex is used for case insensitive search
                { email: { $regex: new RegExp(searchQuery, 'i') } },            //regexp is used to search for a pattern in a string here i is for case insensitive
              ];
        }

        if (dateFrom && dateTo) {    //took dateFrom and dateTo as date of addition of merchant
            query.createdAt = {
                $gte: dateFrom,     //greater than or equal to dateFrom
                $lte: dateTo,       //less than or equal to dateTo
            };
        }

        const merchants = await merchant.find(query)
        .skip((Number(page) - 1) * Number(pageSize))    //skip the first n merchants
        .limit(Number(pageSize));                       //limit the number of merchants to pageSize
    
        //Count total number of merchants for pagination
        const total = await merchant.countDocuments(query); //countDocuments counts the number of documents in the database

        res.status(200).json({
            success: true,
            message: 'List of all merchants successfully retrieved',
            merchants,
            total
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



//Add a merchant
exports.addMerchant = async (req, res) => {
    try {
        const { storeID, merchantName, email, commission } = req.body;

        //Checking if all values are entered
        if (!storeID || !merchantName || !email || !commission) {
            return res.status(400).json({
                success: false,
                message: 'Please enter all required fields'
            });
        }

        //Checking if merchant already exists
        const existingMerchant = await Merchant.findOne({ email });
        if (existingMerchant) {
            return res.status(400).json({
                success: false,
                message: 'Merchant already exists'
            });
        }

        //Creating new merchant
        const newMerchant = await Merchant.create({
            storeID,
            merchantName,
            email,
            commission
        });

        res.status(200).json({
            success: true,
            message: 'Merchant created successfully',
            newMerchant
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



//Update a merchant
exports.updateMerchant = async (req, res) => {
    try {
        const { merchantId } = req.params;      // merchantId is the _id of the merchant to be updated

        const { merchantName, email, commission } = req.body;

    // Validate input if needed
        if (!merchantName || !email || !commission) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        //Checking if merchant exists
        const existingMerchant = await Merchant.findById(merchantId);
        if (!existingMerchant) {
        return res.status(404).json({ success: false, message: 'Merchant not found' });
        }

        //Updating merchant as per the new values
        existingMerchant.merchantName = merchantName;
        existingMerchant.email = email;
        existingMerchant.commission = commission;

        const updatedMerchant = await existingMerchant.save();

        res.status(200).json({
            success: true,
            message: 'Merchant updated successfully',
            updatedMerchant
        });
    }   catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



//Delete a merchant
exports.deleteMerchant = async (req, res) => {
    try {
        const { merchantId } = req.params;

        //Checking if merchant exists
        const existingMerchant = await Merchant.findById(merchantId);
        if (!existingMerchant) {
            return res.status(404).json({ success: false, message: 'Merchant not found' });
        }

        //Deleting merchant
        await Merchant.findByIdAndDelete(merchantId);


        res.status(200).json({
            success: true,
            message: 'Merchant deleted successfully'
        });
    }   catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



//Get merchant details

exports.getMerchant = async (req, res) =>  {
    try {
        const { merchantId } = req.params;

        //Checking if merchant exists
        const existingMerchant = await Merchant.findById(merchantId);
        if (!existingMerchant) {
            return res.status(404).json({ success: false, message: 'Merchant not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Merchant details retrieved successfully',
            existingMerchant
        });

    }   catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



//filter merchants 
exports.filterMerchants = async (req, res) => {
    try {
        const { filterOption } = req.query;

        // Checking if filterOption is entered
        if (!filterOption) {
            return res.status(400).json({ success: false, message: 'No filter options provided' });
        }

        let filters;

        try {
            filters = JSON.parse(filterOption);
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Invalid filter options' });
        }

        // Constructing query
        const query = {};

        if (filters.merchantName) {
            query.merchantName = { $regex: new RegExp(filters.merchantName, 'i') };
        }
        if (filters.email) {
            query.email = { $regex: new RegExp(filters.email, 'i') };
        }
        if (filters.commission) {
            query.commission = Number(filters.commission);
        }

        // Finding merchants as per the query
        const filteredMerchants = await Merchant.find(query);

        res.status(200).json({
            success: true,
            message: 'Merchants filtered successfully',
            filteredMerchants
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
